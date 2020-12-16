const db = require('../../models');
const {
    UserInputError,
    AuthenticationError,
} = require('apollo-server-express');
const { parseObject, saveFileMultiple } = require('../../helps');

const editAssignment = async (_, { changes }, { userCtx }) => {
    try {
        if (userCtx.error) throw new AuthenticationError(userCtx.error);
        const {
            user: { userId },
        } = userCtx;
        const { assignmentId, title, content, dueDate, removeFileId, newFiles } = changes;
        
        const assignment = await db.Assignments.findByPk(assignmentId, {
            include: ['course', 'files'],
        });
        if(assignment === null) {
            throw new UserInputError("Assignment does not exist.");
        }
        if (assignment.course['host_id'] !== userId) {
            throw new AuthenticationError(
                "You don't have permission to edit on this assignment."
            );
        }
        
        const assignmentFiles = await saveFileMultiple(newFiles, 'assignment');

        if(content) {
            assignment['content'] = content;
            assignment['update_at'] = Date.now();
        }
        if(title) {
            assignment['title'] = title;
            assignment['update_at'] = Date.now();
        }
        if(dueDate) {
            assignment['due_date'] = dueDate;
            assignment['update_at'] = Date.now();
        }

        const files = parseObject(assignment.files);
        const removeFile = files.map(file => file['assignment_file_id']).filter(id => {
            return removeFileId.includes(id);
        });
        if(removeFile || newFiles) {
            assignment['update_at'] = Date.now();
        }


        await Promise.all([
            assignment.save(),
            removeFile && db.AssignmentFiles.destroy({ where: { ['assignment_file_id']: removeFile }}),
            newFiles && db.AssignmentFiles.bulkCreate(assignmentFiles.map(file => {
                    file['assignment_id'] = assignmentId;
                    return file;
                })
            ),
        ]);
        return {
            success: true,
        };
    } catch (err) {
        if (
            !(err instanceof UserInputError) &&
            !(err instanceof AuthenticationError)
        ) {
            console.log(err);
        }
        return {
            success: false,
            message: err.message,
        };
    }
};
module.exports = editAssignment;

const db = require('../../models');
const { snakeCase, camelCase } = require('change-case-object');
const {
    UserInputError,
    AuthenticationError,
} = require('apollo-server-express');
const helps = require('../../helps');
const createAssignment = async (_, args, { userCtx }) => {
    try {
        if (userCtx.error) throw new AuthenticationError(userCtx.error);
        const {
            user: { userId: hostId, role },
        } = userCtx;

        const { courseId, title, content, dueDate, files } = args.assignment;
        const course = await db.Courses.findByPk(courseId, { raw: true });
        if (course == null) {
            throw new UserInputError('CourseId does not exist');
        }
        if (role === 'Teacher' && course['host_id'] !== hostId) {
            throw new AuthenticationError(
                'You does not have permission with this course!'
            );
        }
        const assignmentFiles = await helps.saveFileMultiple(files, 'assignment');
        const assignment = await db.Assignments.create(
            snakeCase({
                courseId,
                hostId,
                title,
                content,
                dueDate,
                createAt: Date.now(),
                updateAt: Date.now(),
            })
        );

        const insertedId = camelCase(assignment.toJSON()).assignmentId;
        await db.AssignmentFiles.bulkCreate(
            assignmentFiles.map(file => {
                file['assignment_id'] = insertedId;
                return file;
            })
        );
        return {
            insertedId,
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
module.exports = createAssignment;

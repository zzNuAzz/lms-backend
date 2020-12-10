const db = require('../../models');
const {
    UserInputError,
    AuthenticationError,
} = require('apollo-server-express');

const editAssignment = async (_, args, { userCtx }) => {
    try {
        if (userCtx.error) throw new AuthenticationError(userCtx.error);
        const {
            user: { userId },
        } = userCtx;
        const { assignmentId, title, content, dueDate } = args;
        const assignment = await db.Assignments.findByPk(assignmentId);
        if (assignment['author_id'] !== userId) {
            throw new AuthenticationError(
                "You don't have permission to edit on this assignment."
            );
        }
        
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
        await assignment.save();
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

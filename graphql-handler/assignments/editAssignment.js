const db = require('../../models');
const { snakeCase, camelCase } = require('change-case-object');
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
        const post = await db.Assignments.findByPk(assignmentId);
        if (post['author_id'] !== userId) {
            throw new AuthenticationError(
                "You don't have permission to edit on this post."
            );
        }
        
        if (content || title) {
            post['content'] = content;
            post['title'] = title;
            post['due_date'] = dueDate;
        }
        await post.save();
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

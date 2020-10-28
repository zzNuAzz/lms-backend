const db = require('../../models');
const { snakeCase, camelCase } = require('change-case-object');
const {
    UserInputError,
    AuthenticationError,
} = require('apollo-server-express');

const editThread = async (_, args, { userCtx }) => {
    try {
        if (userCtx.error) throw new AuthenticationError(userCtx.error);
        const {
            user: { userId },
        } = userCtx;
        const { threadId, title, content } = args;
        const thread = await db.ForumThreads.findByPk(threadId);
        if (camelCase(thread.toJSON()).authorId !== userId) {
            throw new AuthenticationError(
                "You don't have permission to edit on this thread."
            );
        }
        if (title) {
            thread['title'] = title;
            thread['update_at'] = new Date();
        }
        if (content) {
            thread['content'] = content;
            thread['update_at'] = new Date();
        }
        console.log(new Date().toLocaleString());
        await thread.save();
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
module.exports = editThread;

const db = require('../../models');
const {
    UserInputError,
    AuthenticationError,
} = require('apollo-server-express');

const editPost = async (_, args, { userCtx }) => {
    try {
        if (userCtx.error) throw new AuthenticationError(userCtx.error);
        const {
            user: { userId },
        } = userCtx;
        const { postId, content } = args;
        const post = await db.ThreadPosts.findByPk(postId);

        if(post === null) {
            throw new UserInputError("Post does not exist!")
        }

        if (post['author_id'] !== userId) {
            throw new AuthenticationError(
                "You don't have permission to edit on this post."
            );
        }
        
        if (content) {
            post['content'] = content;
            post['update_at'] = Date.now();
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
module.exports = editPost;

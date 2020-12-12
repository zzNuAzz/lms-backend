const db = require('../../models');
const {
    UserInputError,
    AuthenticationError,
} = require('apollo-server-express');

const deletePost = async (_, args, { userCtx }) => {
    try {
        if (userCtx.error) throw new AuthenticationError(userCtx.error);
        const {
            user: { userId },
        } = userCtx;
        const { postId } = args;
        const post = await db.ThreadPosts.findByPk(postId);

        if(post == null) {
            throw new UserInputError("Post does not exist!")
        }

        if (post['author_id'] !== userId) {
            throw new AuthenticationError(
                "You don't have permission to delete this post."
            );
        }
        
        await post.destroy();

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
module.exports = deletePost;

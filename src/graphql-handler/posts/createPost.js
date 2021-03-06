const db = require('../../models');
const { snakeCase, camelCase } = require('change-case-object');
const {
    UserInputError,
    AuthenticationError,
} = require('apollo-server-express');

const createPost = async (_, { threadId, content }, { userCtx }) => {
    try {
        if (userCtx.error) throw new AuthenticationError(userCtx.error);
        const {
            user: { userId, role },
        } = userCtx;

        const thread = await db.ForumThreads.findByPk(threadId, {
            include: 'course'
        });
        if (thread === null) {
            throw new UserInputError('Thread does not exist');
        }
        if (role === 'Teacher' && thread.course['host_id'] !== userId) {
            throw new AuthenticationError(
                'You does not have permission with this thread!'
            );
        }
        if (role === 'Student') {
            const filter = { userId, courseId: thread['course_id'], status: 'Accepted' };
            const member = await db.CourseMembers.findOne({
                where: snakeCase(filter),
            });
            if (member == null) {
                throw new AuthenticationError(
                    'You does not have permission with this thread!'
                );
            }
        }

        const post = await db.ThreadPosts.create(
            snakeCase({
                threadId,
                authorId: userId,
                content,
                createAt: Date.now(),
                updateAt: Date.now(),
            })
        );
        
        const insertedId = camelCase(post.toJSON()).postId;
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
module.exports = createPost;

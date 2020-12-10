const db = require('../../models');
const { snakeCase, camelCase } = require('change-case-object');
const {
    UserInputError,
    AuthenticationError,
} = require('apollo-server-express');

const getPost = async (_, args, { userCtx }) => {
    const { postId } = args;
    if (userCtx.error) throw new AuthenticationError(userCtx.error);
    const {
        user: { userId, role },
    } = userCtx;

    const post = await db.ThreadPosts.findOne({
        include: ['author', {association: 'thread', include: ['course']}],
        where: snakeCase({ postId }),
        nest: true,
        raw: true,
    });

    if (post === null) {
        throw new UserInputError('postId is invalid.');
    }
    const course = post.thread.course;
    if (role === 'Teacher' && course['host_id'] !== userId) {
        throw new AuthenticationError('You does not have permission with this post!' );
    }
    if (role === 'Student') {
        const filter = {
            userId,
            courseId: thread['course_id'],
            status: 'Accepted',
        };
        const member = await db.CourseMembers.findOne({where: snakeCase(filter)});
        if (member == null) {
            throw new AuthenticationError('You does not have permission with this post!');
        }
    }

    return camelCase(post);
};
module.exports = getPost;

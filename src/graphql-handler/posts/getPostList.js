const db = require('../../models');
const { snakeCase, camelCase } = require('change-case-object');
const {
    UserInputError,
    AuthenticationError,
} = require('apollo-server-express');

const getPostList = async (_, args, { userCtx }) => {
    const { threadId, pageNumber, pageSize } = args;
    if (userCtx.error) throw new AuthenticationError(userCtx.error);
    const {
        user: { userId, role },
    } = userCtx;

    // const thread = await db.ForumThreads.findByPk(threadId, { raw: true });

    const thread = await db.ForumThreads.findOne({
        include: ['course'],
        where: snakeCase({threadId}),
        nest: true,
        raw: true
    })

    if (thread === null) {
        throw new UserInputError('Thread does not exist.');
    }
    const course = thread.course;
    if (role === 'Teacher' && course['host_id'] !== userId) {
        throw new AuthenticationError(
            'You does not have permission with this thread!'
        );
    }
    if (role === 'Student') {
        const filter = { userId , courseId: course['course_id'], status: 'Accepted' };
        const member = await db.CourseMembers.findOne({
            where: snakeCase(filter),
        });
        if (member == null) {
            throw new AuthenticationError(
                'You does not have permission with this thread!'
            );
        }
    }
    const totalRecords = await db.ThreadPosts.count({
        where: snakeCase({ threadId }),
    });
    const postList = await db.ThreadPosts.findAll({
        limit: pageSize,
        offset: pageNumber * pageSize,
        include: ['author'],
        where: snakeCase({ threadId }),
        order: [['create_at', 'DESC']],
        nest: true,
        raw: true,
    });
    return camelCase({
        postList,
        totalRecords,
        pageNumber,
        totalPages: Math.ceil(totalRecords / pageSize),
    });
};
module.exports = getPostList;

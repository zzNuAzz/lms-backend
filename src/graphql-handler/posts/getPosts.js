const db = require('../../models');
const { snakeCase, camelCase } = require('change-case-object');
const {
    UserInputError,
    AuthenticationError,
} = require('apollo-server-express');

const getPost = async (_, args, { userCtx }) => {
    const { threadId, pageNumber, pageSize } = args;
    if (userCtx.error) throw new AuthenticationError(userCtx.error);
    const {
        user: { userId: authorId, role },
    } = userCtx;

    const thread = await db.ForumThreads.findByPk(threadId, { raw: true });
    if (thread == null) {
        throw new UserInputError('ThreadId is invalid');
    }
    if (role === 'Teacher' && thread['author_id'] !== authorId) {
        throw new AuthenticationError(
            'You does not have permission with this thread!'
        );
    }
    if (role === 'Student') {
        const filter = { userId: authorId, courseId: thread['course_id'], status: 'Accepted' };
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

    console.log(postList)
    return camelCase({
        postList,
        totalRecords,
        pageNumber,
        totalPages: Math.ceil(totalRecords / pageSize),
    });
};
module.exports = getPost;

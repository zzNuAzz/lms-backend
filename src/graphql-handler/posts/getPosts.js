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
        const filter = { userId: authorId, threadId, status: 'Accepted' };
        const member = await db.CourseMembers.findOne({
            where: snakeCase(filter),
        });
        if (member == null) {
            throw new AuthenticationError(
                'You does not have permission with this thread!'
            );
        }
    }
    const totalRecords = await db.ThreadPost.count({
        where: snakeCase({ threadId }),
    });
    const threadPostList = await db.ThreadPost.findAll({
        limit: pageSize,
        offset: pageNumber * pageSize,
        include: [
            { model: db.Users, as: 'author' },
            // { model: db.Courses, as: 'course' },
        ],
        where: snakeCase({ threadId }),
        order: [['update_at', 'DESC']],
        nest: true,
        raw: true,
    });

    return camelCase({
        threadPostList,
        totalRecords,
        pageNumber,
        totalPages: Math.ceil(totalRecords / pageSize),
    });
};
module.exports = getPost;

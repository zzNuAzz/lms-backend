const db = require('../../models');
const { snakeCase, camelCase } = require('change-case-object');
const {
    UserInputError,
    AuthenticationError,
} = require('apollo-server-express');

const getThread = async (_, args, { userCtx }) => {
    const { courseId, pageNumber, pageSize } = args;
    if (userCtx.error) throw new AuthenticationError(userCtx.error);
    const {
        user: { userId: authorId, role },
    } = userCtx;

    const course = await db.Courses.findByPk(courseId, { raw: true });
    if (course == null) {
        throw new UserInputError('CourseId is invalid');
    }
    if (role === 'Teacher' && course['host_id'] !== authorId) {
        throw new AuthenticationError(
            'You does not have permission with this course!'
        );
    }
    if (role === 'Student') {
        const filter = { userId: authorId, courseId, status: 'Accepted' };
        const member = await db.CourseMembers.findOne({
            where: snakeCase(filter),
        });
        if (member == null) {
            throw new AuthenticationError(
                'You does not have permission with this course!'
            );
        }
    }
    const totalRecords = await db.ForumThreads.count({
        where: snakeCase({ courseId }),
    });
    const forumThreadList = await db.ForumThreads.findAll({
        limit: pageSize,
        offset: pageNumber * pageSize,
        include: [
            { model: db.Users, as: 'author' },
            // { model: db.Courses, as: 'course' },
        ],
        where: snakeCase({ courseId }),
        order: [['update_at', 'DESC']],
        nest: true,
        raw: true,
    });

    return camelCase({
        forumThreadList,
        totalRecords,
        pageNumber,
        totalPages: Math.ceil(totalRecords / pageSize),
    });
};
module.exports = getThread;

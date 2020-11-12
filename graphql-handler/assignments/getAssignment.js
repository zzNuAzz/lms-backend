const db = require('../../models');
const { snakeCase, camelCase } = require('change-case-object');
const {
    UserInputError,
    AuthenticationError,
} = require('apollo-server-express');

const getAssignment = async (_, args, { userCtx }) => {
    const { couseId, pageNumber, pageSize } = args;
    if (userCtx.error) throw new AuthenticationError(userCtx.error);
    const {
        user: { userId: hostId, role },
    } = userCtx;

    const course = await db.Courses.findByPk(couseId, { raw: true });
    if (course == null) {
        throw new UserInputError('CourseId is invalid');
    }
    if (role === 'Teacher' && course['host_id'] !== hostId) {
        throw new AuthenticationError(
            'You does not have permission with this course!'
        );
    }
    if (role === 'Student') {
        const filter = { userId, threadId, status: 'Accepted' };
        const member = await db.CourseMembers.findOne({
            where: snakeCase(filter),
        });
        if (member == null) {
            throw new AuthenticationError(
                'You does not have permission with this course!'
            );
        }
    }
    const totalRecords = await db.Assignments.count({
        where: snakeCase({ courseId }),
    });
    const assignmentList = await db.Assignments.findAll({
        limit: pageSize,
        offset: pageNumber * pageSize,
        include: [
            { model: db.Users, as: 'author' },
            // { model: db.Courses, as: 'course' },
        ],
        where: snakeCase({ assignmentId }),
        order: [['update_at', 'DESC']],
        nest: true,
        raw: true,
    });

    return camelCase({
        assignmentList,
        totalRecords,
        pageNumber,
        totalPages: Math.ceil(totalRecords / pageSize),
    });
};
module.exports = getAssignment;

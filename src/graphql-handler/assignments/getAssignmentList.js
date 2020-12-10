const { snakeCase, camelCase } = require('change-case-object');
const {
    UserInputError,
    AuthenticationError,
} = require('apollo-server-express');
const db = require('../../models');
const { parseObject } = require('../../helps');

const getAssignmentList = async (_, args, { userCtx }) => {
    const { courseId, pageNumber, pageSize } = args;
    if (userCtx.error) throw new AuthenticationError(userCtx.error);
    const {
        user: { userId, role },
    } = userCtx;

    const course = await db.Courses.findByPk(courseId, { raw: true });
    if (course == null) {
        throw new UserInputError('CourseId is invalid');
    }
    if (role === 'Teacher' && course['host_id'] !== userId) {
        throw new AuthenticationError(
            'You does not have permission with this course!'
        );
    }
    if (role === 'Student') {
        const filter = { userId, courseId, status: 'Accepted' };
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
    const _assignmentList = await db.Assignments.findAll({
        limit: pageSize,
        offset: pageNumber * pageSize,
        where: snakeCase({ courseId }),
        include: ['files', {association: "course", include:'host'}],
        order: [['update_at', 'DESC']],
    });
    const assignmentList = parseObject(_assignmentList);
    return camelCase({
        assignmentList,
        totalRecords,
        pageNumber,
        totalPages: Math.ceil(totalRecords / pageSize),
    });
};
module.exports = getAssignmentList;

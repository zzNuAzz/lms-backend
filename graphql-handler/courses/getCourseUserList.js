const { snakeCase, camelCase } = require('change-case-object');
const db = require('../../models');

const getCourseUserList = async (_, arg, { userCtx }) => {
    const { courseId, status, pageNumber = 0, pageSize = 10 } = arg;

    const filters = { status, courseId };

    const totalRecords = await db.CourseMembers.count({
        where: snakeCase(filters),
    });
    const userList = await db.Users.findAll({
        include: [{ model: db.CourseMembers, where: snakeCase(filters) }],
        limit: pageSize,
        offset: pageNumber * pageSize,
        raw: true,
    });
    return camelCase({
        userList,
        status,
        totalRecords,
        pageNumber,
        totalPages: Math.ceil(totalRecords / pageSize),
    });
};

module.exports = getCourseUserList;

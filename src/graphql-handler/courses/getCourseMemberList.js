const { snakeCase, camelCase } = require('change-case-object');
const db = require('../../models');

const getCourseMemberList = async (_, arg, { userCtx }) => {
    const { courseId, status, pageNumber = 0, pageSize = 10 } = arg;

    const filters = { courseId };
    if(status) filters.status = status;

    const totalRecords = await db.CourseMembers.count({
        where: snakeCase(filters),
    });

    const memberList = await db.CourseMembers.findAll({
        include: ['user'],
        where: snakeCase(filters),
        limit: pageSize,
        offset: pageNumber * pageSize,
        raw: true,
        nest: true
    });

    return camelCase({
        memberList,
        totalRecords,
        pageNumber,
        totalPages: Math.ceil(totalRecords / pageSize),
    });
};

module.exports = getCourseMemberList;

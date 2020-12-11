const { snakeCase, camelCase } = require('change-case-object');
const db = require('../../models');

const getCourseList = async (_, arg, { userCtx }) => {
    const { hostId, pageNumber = 0, pageSize = 10 } = arg;

    const filters = {};
    if (hostId) {
        filters.hostId = hostId;
    }

    const totalRecords = await db.Courses.count({ where: snakeCase(filters) });
    const courseList = await db.Courses.findAll({
        include: [{ model: db.Users, as: 'host' }],
        limit: pageSize,
        offset: pageNumber * pageSize,
        where: snakeCase(filters),
        order: [['course_id', 'desc']],
        nest: true,
        raw: true,
    });
    
    return camelCase({
        courseList,
        totalRecords,
        pageNumber,
        totalPages: Math.ceil(totalRecords / pageSize),
    });
};

module.exports = getCourseList;

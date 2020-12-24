const { snakeCase, camelCase } = require('change-case-object');
const db = require('../../models');
const { Op } = require('sequelize');
const getCourseMemberList = async (_, arg, { userCtx }) => {
    const { courseId, status, pageNumber = 0, pageSize = 10 } = arg;

    const filters = { ['course_id']: courseId };
    if(status) filters.status = status;
    if(filters.status === undefined) {
        filters[Op.not] = {
            status: "Rejected"
        }
    }
    
    const totalRecords = await db.CourseMembers.count({
        where: snakeCase(filters),
    });

    const memberList = await db.CourseMembers.findAll({
        include: ['user'],
        where: filters,
        limit: pageSize,
        offset: pageNumber * pageSize,
        order: [['status', 'ASC'], ['course_member_id', 'DESC']],
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

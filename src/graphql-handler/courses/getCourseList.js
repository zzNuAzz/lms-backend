const { UserInputError } = require('apollo-server-express');
const { snakeCase, camelCase } = require('change-case-object');
const db = require('../../models');

const getCourseList = async (_, arg, { userCtx }) => {
    const { hostId, pageNumber = 0, pageSize = 10, order: _order } = arg;

    const filters = {};
    if (hostId) {
        filters.hostId = hostId;
    }

    const order = snakeCase(_order);
    // validate order
    order.map(o => {
        if(o.length < 2) throw new UserInputError("Too few param in order on query.");
        if(o.length > 2) throw new UserInputError("Too more param in order on query.");
        if(o[1] !== 'desc' && o[1] !== 'asc') throw new UserInputError("Invalid order priority in query.");
        if(!['name','course_id', 'short_description', 'create_at', 'update_at'].includes(o[0])) {
            throw new UserInputError("Invalid order field in query.");
        }
    })


    const totalRecords = await db.Courses.count({ where: snakeCase(filters) });
    const courseList = await db.Courses.findAll({
        include: [{ model: db.Users, as: 'host' }],
        limit: pageSize,
        offset: pageNumber * pageSize,
        where: snakeCase(filters),
        order,
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

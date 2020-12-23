const { UserInputError, AuthenticationError } = require('apollo-server-express');
const { snakeCase, camelCase } = require('change-case-object');
const db = require('../../models');
const { Op } = require('sequelize');

const getUserCourseListExclude = async (_, arg, { userCtx }) => {
	if (userCtx.error) throw new AuthenticationError(userCtx.error);
    const {statusExclude, pageNumber = 0, pageSize = 10, order: _order } = arg;
	const {user: {userId}} = userCtx;

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

	const filteredCourse = await db.CourseMembers.findAll({where:{['user_id']: userId, status: {[Op.notIn]: statusExclude}},  raw: true, nest: true})
	const idCourseFilter = filteredCourse.map(e=>e['course_id']);
	// console.log(cccc);
	const totalRecords = await db.Courses.count({  where: {['course_id']: {[Op.notIn]: idCourseFilter}} });
    const courseList = await db.Courses.findAll({
        limit: pageSize,
        offset: pageNumber * pageSize,
        where: {['course_id']: { [Op.notIn]: idCourseFilter }},
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

module.exports = getUserCourseListExclude;

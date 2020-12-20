const { AuthenticationError, UserInputError } = require('apollo-server-express');
const db = require('../../models');
const { snakeCase } = require('change-case-object');

const getEnrollStatus = async (_, { courseId }, { userCtx }) => {

	if (userCtx.error) throw new AuthenticationError(userCtx.error);
	const { user: { userId, role } } = userCtx;
	
	const course = await db.Courses.findByPk(courseId);

	if(course === null) {
		throw new UserInputError("Course does not exist");
	}
	
	if (role === 'Student') {
		const filter = { userId, courseId};
		const member = await db.CourseMembers.findOne({
			where: snakeCase(filter),
		});
		if (member === null) {
			return "NotEnroll"
		}
		return member.status;

	}
};

module.exports = getEnrollStatus;

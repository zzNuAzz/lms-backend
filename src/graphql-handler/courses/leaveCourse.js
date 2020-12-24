const {
	UserInputError,
	AuthenticationError,
} = require('apollo-server-express');
const { snakeCase, camelCase } = require('change-case-object');
const db = require('../../models');

const leaveCourse = async (_, { courseId }, { userCtx }) => {
	try {
		if (userCtx.error) throw new AuthenticationError(userCtx.error);
		const { user: { userId } } = userCtx;

		const member = await db.CourseMembers.destroy({
			where: snakeCase({ userId, courseId }),
			nest: true,
		});
		if(!member) {
			throw new UserInputError('You have not enroll this course yet.');
		}
		return { success: true };
	} catch (err) {
		if (
			!(err instanceof UserInputError) &&
			!(err instanceof AuthenticationError)
		) {
			console.log(err);
		}
		return { success: false, message: err.message };
	}
};

module.exports = leaveCourse;

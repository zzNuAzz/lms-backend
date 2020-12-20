const { AuthenticationError, UserInputError } = require('apollo-server-express');
const db = require('../../models');
const { snakeCase } = require('change-case-object');

const checkUserInCourse = async (_, { courseId }, { userCtx }) => {
    try {
        if (userCtx.error) throw new AuthenticationError(userCtx.error);
        const {
            user: { userId, role },
		} = userCtx;
		
		const course = await db.Courses.findByPk(courseId);

		if(course === null) {
			throw new UserInputError("Course does not exist");
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
			if (member === null) {
				throw new AuthenticationError(
					'You does not have permission with this course!'
				);
			}
		}
        return {
			success: true,
			message: "OK"
		};
    } catch (err) {
		if (!(err instanceof UserInputError) && !(err instanceof AuthenticationError)) {
            console.log(err);
        }
        return {
            success: false,
            message: err.message,
        };
    }
};

module.exports = checkUserInCourse;

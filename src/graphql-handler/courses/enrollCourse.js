const {
    UserInputError,
    AuthenticationError,
} = require('apollo-server-express');
const { snakeCase, camelCase } = require('change-case-object');
const { ForeignKeyConstraintError } = require('sequelize');
const db = require('../../models');

const enrollCourse = async (_, args, { userCtx }) => {
    try {
        if (userCtx.error) throw new AuthenticationError(userCtx.error);
        const { courseId, description } = args;
        const {
            user: { userId },
        } = userCtx;

        const result = await db.CourseMembers.findOne({
            where: snakeCase({ courseId, userId }),
        });
        if (result) {
            // update
            if (result.status === 'Accepted') {
                throw new UserInputError('User already in course.');
            } else if (result.status === 'Pending') {
                throw new UserInputError('User already sent enroll request.');
            }
            result.update({ status: 'Pending', description });
        } else {
            // insert

            await db.CourseMembers.create(
                snakeCase({
                    courseId,
                    userId,
                    status: 'Pending',
                    description,
                })
            );
        }
    } catch (err) {
        if(err instanceof ForeignKeyConstraintError) {
            return { success: false, message: "Course does not exist." };
        }
        if (
            !(err instanceof UserInputError) &&
            !(err instanceof AuthenticationError)
        ) {
            console.log(err);
        }
        return { success: false, message: err.message };
    }
    return {
        success: true,
    };
};

module.exports = enrollCourse;

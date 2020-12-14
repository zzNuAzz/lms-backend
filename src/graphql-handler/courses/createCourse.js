const db = require('../../models');
const { snakeCase, camelCase } = require('change-case-object');
const {
    UserInputError,
    AuthenticationError,
} = require('apollo-server-express');

const createCourse = async (_, { name, shortDescription ,description }, { userCtx }) => {
    try {
        if (userCtx.error) throw new AuthenticationError(userCtx.error);
        const {
            user: { userId: hostId },
        } = userCtx;

        const course = await db.Courses.create(snakeCase({
            hostId,
            name,
            shortDescription,
            description,
            createAt: Date.now(),
            updateAt: Date.now(),
        }));

        const insertedId = camelCase(course.toJSON()).courseId;
        return {
            insertedId,
            success: true,
        };
    } catch (err) {
        if (
            !(err instanceof UserInputError) &&
            !(err instanceof AuthenticationError)
        ) {
            console.log(err);
        }
        return {
            success: false,
            message: err.message,
        };
    }
};
module.exports = createCourse;
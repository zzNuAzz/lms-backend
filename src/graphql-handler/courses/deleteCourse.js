const db = require('../../models');
const {
    UserInputError,
    AuthenticationError,
} = require('apollo-server-express');

const deleteCourse = async (_, args, { userCtx }) => {
    try {
        if (userCtx.error) throw new AuthenticationError(userCtx.error);
        const {
            user: { userId },
        } = userCtx;
        const { courseId } = args;
        const course = await db.Courses.findByPk(courseId);

        if(course === null) {
            throw new UserInputError("Course does not exist.")
        }
        if (course['host_id'] !== userId) {
            throw new AuthenticationError(
                "You don't have permission to delete this course."
            );
        }
        
        await course.destroy();
       
        return {
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
module.exports = deleteCourse;

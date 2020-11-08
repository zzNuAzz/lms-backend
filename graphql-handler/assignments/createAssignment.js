const db = require('../../models');
const { snakeCase, camelCase } = require('change-case-object');
const {
    UserInputError,
    AuthenticationError,
} = require('apollo-server-express');

const createAssignment = async (_, { courseId, title, content, dueDate }, { userCtx }) => {
    try {
        if (userCtx.error) throw new AuthenticationError(userCtx.error);
        const {
            user: { userId: hostId, role },
        } = userCtx;

        const course = await db.Courses.findByPk(courseId, { raw: true });
        if (course == null) {
            throw new UserInputError('CourseId does not exist');
        }
        if (role === 'Teacher' && course['host_id'] !== hostId) {
            throw new AuthenticationError(
                'You does not have permission with this course!'
            );
        }

        const assignment = await db.Assignments.create(
            snakeCase({
                courseId,
                hostId,
                title,
                content,
                createAt: Date.now(),
                dueDate,
            })
        );
        
        const insertedId = camelCase(assignment.toJSON()).assignmentId;
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
module.exports = createAssignment;

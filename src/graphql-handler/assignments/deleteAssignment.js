const db = require('../../models');
const {
    UserInputError,
    AuthenticationError,
} = require('apollo-server-express');

const editAssignment = async (_, { assignmentId }, { userCtx }) => {
    try {
        if (userCtx.error) throw new AuthenticationError(userCtx.error);
        const {
            user: { userId },
        } = userCtx;
        const assignment = await db.Assignments.findByPk(assignmentId, {
            include: ['course', 'files'],
        });
        if(assignment === null) {
            throw new UserInputError("Assignment does not exist.");
        }
        if (assignment.course['host_id'] !== userId) {
            throw new AuthenticationError(
                "You don't have permission to edit on this assignment."
            );
        }
        
        await assignment.destroy();
        
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
module.exports = editAssignment;

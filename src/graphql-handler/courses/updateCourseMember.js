const {
    UserInputError,
    AuthenticationError,
} = require('apollo-server-express');
const { snakeCase, camelCase } = require('change-case-object');
const db = require('../../models');

const updateCourseMember = async (_, args, { userCtx }) => {
    const { courseMemberId, status, description } = args;
    
    try {
        if (userCtx.error) throw new AuthenticationError(userCtx.error);
        const { user: { userId: callerId } } = userCtx;
        
        const member = await db.CourseMembers.findOne({
            include: [{ model: db.Courses, as: 'course' }],
            where: snakeCase({ courseMemberId }),
            nest: true,
        });

        if (!member) {
            throw new UserInputError('Member does not exist.');
        }
        if (callerId !== member.course.host_id) {
            throw new UserInputError(
                "You don't have permission with this course."
            );
        }
        member.update({ status, description });
    } catch (err) {
        if (
            !(err instanceof UserInputError) &&
            !(err instanceof AuthenticationError)
        ) {
            console.log(err);
        }
        return { success: false, message: err.message };
    }
    return { success: true };
};

module.exports = updateCourseMember;

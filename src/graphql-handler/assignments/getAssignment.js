const db = require('../../models');
const { snakeCase, camelCase } = require('change-case-object');
const {
    UserInputError,
    AuthenticationError,
} = require('apollo-server-express');
const { parseObject } = require('../../helps');

const getAssignment = async (_, args, { userCtx }) => {
    const { assignmentId } = args;
    if (userCtx.error) throw new AuthenticationError(userCtx.error);
    const {
        user: { userId, role },
    } = userCtx;

    const _assignment = await db.Assignments.findOne({
        include: [ 'files', {association:'course', include:['host']} ],
        where: snakeCase({ assignmentId }),
        nest: true
    });
    const assignment = parseObject(_assignment);
    
    if(assignment === null) {
        throw new UserInputError("Assignment does not exist.");
    }
    
    const course = assignment.course;
    if (role === 'Teacher' && course['host_id'] !== userId) {
        throw new AuthenticationError(
            'You does not have permission with this course!'
        );
    }
    if (role === 'Student') {
        const filter = { userId, courseId: course['course_id'], status: 'Accepted' };
        const member = await db.CourseMembers.findOne({
            where: snakeCase(filter),
        });
        if (member === null) {
            throw new AuthenticationError(
                'You does not have permission with this course!'
            );
        }
    }
    return camelCase(assignment);
};
module.exports = getAssignment;

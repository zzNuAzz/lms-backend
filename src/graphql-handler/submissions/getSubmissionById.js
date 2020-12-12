const db = require('../../models');
const { snakeCase, camelCase } = require('change-case-object');
const {
    UserInputError,
    AuthenticationError,
} = require('apollo-server-express');
const {parseObject} = require('../../helps');

const getSubmissionById = async (_, args, { userCtx }) => {
    if (userCtx.error) throw new AuthenticationError(userCtx.error);
    const { submissionId } = args;
    const {
        user: { userId, role },
    } = userCtx;
    
    const _submission = await db.Submissions.findOne({
        include: ['author', 'files', {association: 'assignment', include: ['course']}],
        where: snakeCase({submissionId}),
        nest: true
    })
    const submission = parseObject(_submission);

    if(submission === null) {
        throw new UserInputError("Submission does not exist.");
    }

    if (role === 'Teacher' && submission.assignment.course['host_id'] !== userId) {
        throw new AuthenticationError('You does not have permission!');
    }
    if (role === 'Student' && submission['author_id'] !== userId) {
       throw new AuthenticationError("You does not have permission!")
    }

    return camelCase(submission);
};
module.exports = getSubmissionById;

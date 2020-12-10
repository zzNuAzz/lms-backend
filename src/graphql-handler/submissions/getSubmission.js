const db = require('../../models');
const { snakeCase, camelCase } = require('change-case-object');
const {
    UserInputError,
    AuthenticationError,
} = require('apollo-server-express');
const {parseObject} = require('../../helps');

const getSubmission = async (_, args, { userCtx }) => {
    if (userCtx.error) throw new AuthenticationError(userCtx.error);
    const { assignmentId } = args;
    const {
        user: { userId: authorId },
    } = userCtx;
    
    const _submission = await db.Submissions.findOne({
        include: ['author', 'files', {association: 'assignment', include: ['course']}],
        where: snakeCase({assignmentId, authorId}),
        nest: true
    })
    const submission = parseObject(_submission);

    return camelCase(submission);
};
module.exports = getSubmission;

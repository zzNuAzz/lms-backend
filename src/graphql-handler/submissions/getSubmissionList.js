const db = require('../../models');
const { snakeCase, camelCase } = require('change-case-object');
const {
    UserInputError,
    AuthenticationError,
} = require('apollo-server-express');
const { parseObject } = require('../../helps');

const getSubmission = async (_, args, { userCtx }) => {
    if (userCtx.error) throw new AuthenticationError(userCtx.error);
    const { assignmentId, pageNumber, pageSize } = args;
    const {user: {userId}} = userCtx;

    const totalRecords = await db.Submissions.count({
      where: snakeCase({ assignmentId }),
    });
    
    const _submissionList = await db.Submissions.findAll({
        limit: pageSize,
        offset: pageNumber * pageSize,
        include: ['author', 'files', { 
          association: 'assignment',
          include: [{ association: 'course', where: { ['host_id']: userId } }],
        }],
        where: snakeCase({ assignmentId }),
        order: [['create_at', 'ASC']],
        nest: true,
    });
    const submissionList = parseObject(_submissionList);
    
    return camelCase({
        submissionList,
        totalRecords:totalRecords,
        pageNumber,
        totalPages: Math.ceil(totalRecords / pageSize),
    });
};
module.exports = getSubmission;

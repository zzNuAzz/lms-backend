const Sequelize = require('sequelize');
const { snakeCase, camelCase } = require('change-case-object');
const {
  UserInputError,
  AuthenticationError,
} = require('apollo-server-express');
const db = require('../../models');
const { parseObject } = require('../../helps');

const getSubmission = async (_, args, { userCtx }) => {
    if (userCtx.error) throw new AuthenticationError(userCtx.error);
    const { assignmentId, pageNumber, pageSize } = args;
    const {user: {userId}} = userCtx;

    const where =  {
      ['assignment_id']: assignmentId,
      ['submission_id']:{
        [Sequelize.Op.in]: 
          Sequelize.literal(`(select max(submission_id) from Submissions group by assignment_id, author_id)`)
      }
    }
    const totalRecords = await db.Submissions.count({ where });
    
    const _submissionList = await db.Submissions.findAll({
        limit: pageSize,
        offset: pageNumber * pageSize,
        include: ['author', 'files', { 
          association: 'assignment',
          include: [{ association: 'course', where: { ['host_id']: userId } }],
        }],
        where,
        order: [['submission_id', 'ASC']],
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

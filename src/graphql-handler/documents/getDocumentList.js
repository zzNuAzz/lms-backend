const db = require('../../models');
const { snakeCase, camelCase } = require('change-case-object');
const {
    UserInputError,
    AuthenticationError,
} = require('apollo-server-express');

const getDocumentList = async (_, args, { userCtx }) => {
    const { courseId, pageNumber, pageSize } = args;
    if (userCtx.error) throw new AuthenticationError(userCtx.error);

    const course = await db.Courses.findByPk(courseId, { raw: true });
    if (course == null) {
        throw new UserInputError('CourseId does not exist');
    }
    const totalRecords = await db.Documents.count({
        where: snakeCase({ courseId }),
    });
    const documentList = await db.Documents.findAll({
        limit: pageSize,
        offset: pageNumber * pageSize,
        include: [{ model: db.Users, as: 'author' }],
        where: snakeCase({ courseId }),
        nest: true,
        raw: true,
    });
    return camelCase({
        documentList,
        totalRecords,
        pageNumber,
        totalPages: Math.ceil(totalRecords / pageSize),
    });
};
module.exports = getDocumentList;

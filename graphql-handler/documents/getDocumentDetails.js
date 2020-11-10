const db = require('../../models');
const { snakeCase, camelCase } = require('change-case-object');
const {
    UserInputError,
    AuthenticationError,
} = require('apollo-server-express');

const getDocumentDetails = async (_, args, { userCtx }) => {
    const { documentId } = args;
    if (userCtx.error) throw new AuthenticationError(userCtx.error);

    const document = await db.Courses.findByPk(documentId, { raw: true });
    if (document == null) {
        throw new UserInputError('CourseId does not exist');
    }

    const documentDetails = await db.Documents.findAll({
        limit: pageSize,
        offset: pageNumber * pageSize,
        include: [{ model: db.DocumentFiles, as: 'files' }],
        where: snakeCase({ documentId }),
        nest: true,
        raw: true,
    });
    return camelCase(documentDetails);
};
module.exports = getDocumentDetails;

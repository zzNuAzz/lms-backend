const db = require('../../models');
const { snakeCase, camelCase } = require('change-case-object');
const {
    UserInputError,
    AuthenticationError,
} = require('apollo-server-express');

const getDocument = async (_, args, { userCtx }) => {
    if (userCtx.error) throw new AuthenticationError(userCtx.error);
    const {
        user: { userId, role },
    } = userCtx;
    
    
};
module.exports = getDocument;

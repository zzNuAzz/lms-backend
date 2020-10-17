const db = require('../../models');
const { snakeCase } = require('change-case-object');

const checkUsername = async (_, { username }) => {
    const result = await db.Users.findOne({ where: snakeCase({ username }) });
    return result === null;
};
module.exports = checkUsername;

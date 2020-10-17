const db = require('../../models');
const { camelCase, snakeCase } = require('change-case-object');

const getUserProfileById = async (_, { userId } = {}) => {
    if (userId == null) return null;
    console.log(userId);
    const result = await db.Users.findOne({
        attributes: {
            exclude: ['password'],
        },
        where: snakeCase({ userId }),
        raw: true,
    });
    return camelCase(result);
};
module.exports = getUserProfileById;

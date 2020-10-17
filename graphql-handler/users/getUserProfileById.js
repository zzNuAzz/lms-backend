const db = require('../../models');
const { camelCase, snakeCase } = require('change-case-object');

const getUserProfileById = async (_, { userId } = {}) => {
    if (userId == null) return null;
    const result = await db.Users.findOne(
        {
            attributes: {
                exclude: ['password'],
            },
        },
        { where: snakeCase({ userId }) }
    );
    return camelCase(result.dataValues);
};
module.exports = getUserProfileById;

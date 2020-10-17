const { snakeCase, camelCase } = require('change-case-object');
const db = require('../../models');

const validateUserInfo = changes => {
    console.log('validate info user', { changes });
};

const updateUserProfile = async (_, { changes }, { userCtx }) => {
    const {
        user: { userId },
    } = userCtx;

    validateUserInfo(changes);

    await db.Users.update(snakeCase(changes), {
        where: snakeCase({ userId }),
    });
    const changedUser = await db.Users.findOne({
        where: snakeCase({ userId }),
        raw: true,
    });
    return camelCase(changedUser);
};

module.exports = updateUserProfile;

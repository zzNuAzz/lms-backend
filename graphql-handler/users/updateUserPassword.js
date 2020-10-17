const { snakeCase } = require('change-case-object');
const bcrypt = require('bcrypt');
const db = require('../../models');
const config = require('config');

const SALT_ROUNDS = config.get('bcrypt_salt') || 10;
const setUserPassword = async (userId, newPassword) => {
    const password = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await db.Users.update({ password }, { where: snakeCase({ userId }) });
    return true;
};

// validate user password input
const validateUserPassword = password => {
    console.log('validate input password', { password });
};

const updateUserPassword = async (_, { input }, { userCtx }) => {
    const { currentPassword, newPassword } = input;
    validateUserPassword(newPassword);
    const {
        user: { userId },
    } = userCtx;
    const { password } = await db.Users.findOne({
        where: snakeCase({ userId }),
    });

    const matchPassword = await bcrypt.compare(currentPassword, password);
    return matchPassword && setUserPassword(userId, newPassword);
};

module.exports = updateUserPassword;

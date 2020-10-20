const { snakeCase } = require('change-case-object');
const bcrypt = require('bcrypt');
const db = require('../../models');
const config = require('config');

const SALT_ROUNDS = config.get('bcrypt_salt') || 10;
const setUserPassword = async (userId, newPassword) => {
    try {
        const password = await bcrypt.hash(newPassword, SALT_ROUNDS);
        await db.Users.update({ password }, { where: snakeCase({ userId }) });
    } catch (err) {
        console.log(err);
        return { success: false, message: err.message };
    }
    return { success: true };
};

// validate user password input
const validateUserPassword = password => {
    console.log('validate input password', { password });
};

const updateUserPassword = async (_, args, { userCtx }) => {
    if (userCtx.error) throw new AuthenticationError(userCtx.error);
    const { currentPassword, newPassword } = args;
    validateUserPassword(newPassword);
    const {
        user: { userId },
    } = userCtx;
    const { password } = await db.Users.findOne({
        where: snakeCase({ userId }),
    });

    const matchPassword = await bcrypt.compare(currentPassword, password);
    if (!matchPassword) {
        return {
            success: false,
            message: 'Input password is incorrect',
        };
    }
    return setUserPassword(userId, newPassword);
};

module.exports = updateUserPassword;

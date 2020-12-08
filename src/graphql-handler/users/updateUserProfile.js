const { snakeCase, camelCase } = require('change-case-object');
const db = require('../../models');

const validateUserInfo = changes => {
    console.log('validate info user', { changes });
};

const updateUserProfile = async (_, { changes }, { userCtx }) => {
    try {
        if (userCtx.error) throw new AuthenticationError(userCtx.error);
        const {
            user: { userId },
        } = userCtx;

        validateUserInfo(changes);

        await db.Users.update(snakeCase(changes), {
            where: snakeCase({ userId }),
        });
        return { success: true };
    } catch (err) {
        if (
            !(err instanceof UserInputError) &&
            !(err instanceof AuthenticationError)
        ) {
            console.log(err);
        }
        return {
            success: false,
            message: err.message,
        };
    }
};

module.exports = updateUserProfile;

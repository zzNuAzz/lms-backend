const { snakeCase } = require('change-case-object');
const helps = require('../../helps');
const db = require('../../models');

const uploadAvatar = async (_, { avatar }, { userCtx }) => {
    if (userCtx.error) throw userCtx.error;
    
    const {
        user: { userId },
    } = userCtx;
    try {
        const { url } = await helps.saveAvatar(avatar, 'avatar', `${userId}_${helps.uuid()}`);
        await db.Users.update(
            snakeCase({ pictureUrl: url }),
            snakeCase({ where: { userId } })
        );
        return { success: true };
    } catch (err) {
        console.log(err)
        return {
            success: false,
            message: err.message,
        };
    }
};

module.exports = uploadAvatar;

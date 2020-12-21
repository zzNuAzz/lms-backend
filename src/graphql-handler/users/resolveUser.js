const { camelCase } = require('change-case-object');
const db = require('../../models');

const resolveUser = async (_, args, { userCtx: {signedIn, user }}) => {
    let _user = null;
    if(signedIn) {
        _user = await db.Users.findByPk(user.userId, {raw: true});
    }
    return {
        signedIn,
        user: camelCase(_user),
    };
};
module.exports = resolveUser;

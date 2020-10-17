const resolveUser = (_, args, { userCtx }) => {
    return userCtx;
};
module.exports = resolveUser;

const helps = require('../../helps');

const uploadFile = async (_, { file }, { userCtx }) => {
    if (userCtx.error) throw userCtx.error;
    return await helps.saveFileToTemp(file);
};

module.exports = uploadFile;

const helps = require('../../helps');

const uploadFile = async (_, { files }, { userCtx }) => {
    if (userCtx.error) throw userCtx.error;
    return await Promise.all(files.map(file => helps.saveFileToTemp(file)));
};

module.exports = uploadFile;

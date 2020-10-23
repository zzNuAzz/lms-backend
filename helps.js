const fs = require('fs');
const fileStoreDir = require('config').get('file-store-dir');

const normalizeFileName = str =>
    str
        .replace(/\s+/g, '_')
        .normalize('NFD')
        .replace(/[đ|\u00f0]/g, 'd')
        .replace(/[\u0300-\u036f]/g, '');

module.exports.saveFile = (file, dir, name) => {
    return file.then(file => {
        const { createReadStream, filename, mimetype } = file;
        const saveName = name
            ? normalizeFileName(filename).replace(
                  /(.+?)(\.[^.]*$|$)/,
                  `${name}$2`
              )
            : normalizeFileName(filename);
        const url = ['','files',dir,saveName].join('/');
        if (!fs.existsSync(`${fileStoreDir}/${dir}`)) {
            fs.mkdirSync(`${fileStoreDir}/${dir}`, { recursive: true });
        }
        const fileStream = createReadStream();
        return new Promise((resolve, reject) => {
            fileStream
                .pipe(
                    fs.createWriteStream(
                        [fileStoreDir, dir, saveName].join('/')
                    )
                )
                .on('finish', () => resolve({ url, filename, mimetype }))
                .on('error', err => reject(err));
        });
    });
};

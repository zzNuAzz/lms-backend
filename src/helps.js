const fs = require('fs');
const path = require('path');
const config = require('config');
const { v4: uuidv4 } = require('uuid');
const redisClient = require('./redis');
const { UserInputError } = require('apollo-server-express');

const normalizeFileName = str =>
    str
        .replace(/\s+/g, '_')
        .normalize('NFD')
        .replace(/[đ|\u00f0]/g, 'd')
        .replace(/[\u0300-\u036f]/g, '');

module.exports.saveAvatar = (file, dir, name) => {
    return file.then(file => {
        const { createReadStream, filename, mimetype } = file;
        const saveName = name
            ? normalizeFileName(filename).replace(
                  /(.+?)(\.[^.]*$|$)/,
                  `${name}$2`
              )
            : normalizeFileName(filename);
        const url = ['', 'files', dir, saveName].join('/');
        const fileStoreDir = config.get('file-store-dir');
        if (!fs.existsSync(`${fileStoreDir}/${dir}`)) {
            fs.mkdirSync(`${fileStoreDir}/${dir}`, { recursive: true });
        }
        const fileStream = createReadStream();
        return new Promise((resolve, reject) => {
            fileStream
                .pipe(
                    fs.createWriteStream(path.join(fileStoreDir, dir, saveName))
                )
                .on('finish', () => resolve({ url, filename, mimetype }))
                .on('error', err => reject(err));
        });
    });
};

module.exports.saveFileToTemp = file => {
    return file.then(file => {
        const { createReadStream, filename, mimetype } = file;
        const uuid = uuidv4();
        const saveName = filename.replace(/(.+?)(\.[^.]*$|$)/, `${uuid}$2`);

        const fileStoreTemp = config.get('file-store-tmp');
        if (!fs.existsSync(fileStoreTemp)) {
            fs.mkdirSync(fileStoreTemp, { recursive: true });
        }
        const fileStream = createReadStream();
        return new Promise((resolve, reject) =>
            fileStream
                .pipe(fs.createWriteStream(path.join(fileStoreTemp, saveName)))
                .on('finish', () => {
                    redisClient.set(uuid, saveName);
                    resolve({ uuid, filename, mimetype });
                })
                .on('error', err => reject(err))
        );
    });
};

module.exports.saveFile = ({ uuid, name: rawName, dest }, callback) => {
    const name = normalizeFileName(rawName);
    return new Promise((resolve, reject) => {
        redisClient.get(uuid, (err, file) => {
            if (err) return reject(new Error(err));
            try {
                if(file === null) return reject(new UserInputError("File does not exist!"));
                const oldPath = path.join(config.get('file-store-tmp'), file);
                const newPath = path.join(config.get('file-store-dir'), dest, name);   
                if(!fs.existsSync(oldPath)) {
                    return reject(new UserInputError("File does not exist!"));
                }
                if (!fs.existsSync(path.join(config.get('file-store-dir'), dest))) {
                    fs.mkdirSync(path.join(config.get('file-store-dir'), dest), { recursive: true });
                }
                fs.renameSync(oldPath, newPath);
                resolve({ url: path.join('/files', dest, name), path: newPath });
            } catch(err) {reject(new Error(err))}
        });
    });
};

module.exports.saveFileMultiple = (files,dest) => {
    return Promise.all(files.map(file => new Promise((resolve, reject)=> {
        module.exports.saveFile({
            uuid: file.uuid,
            name: file.filename,
            dest: path.join(dest, file.uuid),
        }, (err) => {
            if(err) console.error(err);
        }).then(data => {
            resolve({
            url: data.url,
            path: data.path,
            filename: file.filename,
            mimetype: file.mimetype
        })}).catch(err => reject(err))
    })));
}

module.exports.parseObject = instance => JSON.parse(JSON.stringify(instance))
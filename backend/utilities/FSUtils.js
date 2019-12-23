// Dependencies
const FileSystem = require('fs');
const Path = require('path');
const RimRaf = require('rimraf');
const Sharp = require('sharp');

// Hack: Using Symbols to make methods private
// Private Methods
const getUserFiles = Symbol();

class FSUtils {
    static [getUserFiles](usersFolder, user) {
        const source = Path.join(usersFolder, user);
        const isNotADirectory = path => !FileSystem.lstatSync(path).isDirectory();

        return FileSystem.readdirSync(source)
            .map(fileName => Path.join(source, fileName))
            .filter(isNotADirectory)
            .map(fileName => {
                let photo = fileName.replace(process.cwd(), '').replace(/\\/g, '/');
                return !photo.startsWith('/') ? `/${photo}` : photo;
            });
    }

    static getUserPhotos(usersFolder, user) {
        return FSUtils[getUserFiles](usersFolder, user);
    }

    static getDirectories(usersFolder, source) {
        const isDirectory = path => FileSystem.lstatSync(path).isDirectory();

        return FileSystem.readdirSync(source)
            .map(fileName => Path.join(source, fileName))
            .filter(isDirectory)
            .map(fileName => fileName.replace(usersFolder, '').replace(/\\/g, '').replace(/\//g, ''))
            .map(fileName => {
                return {
                    name: fileName,
                    photos: FSUtils[getUserFiles](usersFolder, fileName)
                }
            });
    }

    static async deleteFolder(path) {
        return new Promise(async (resolve, reject) => {
            RimRaf(path, error => {
                if (error)
                    reject(new Error(error));
                else resolve();
            });
        });
    }

    static decompressImage(compressedImgCur) {
        return compressedImgCur.split('')
            .map((c, i, a) => i % 2 ? undefined : new Array(2 + parseInt(a[i + 1], 36)).join(c)).join('');
    }

    static async uploadBase64(usersFolder, user, data) {
        const userDir = Path.join(usersFolder, user);
        const newData = FSUtils.decompressImage(data);
       
        if(!FileSystem.existsSync(usersFolder))
            FileSystem.mkdirSync(userDir);

        const fullPath = Path.join(userDir, `${user}_${Date.now()}.jpg`);
        const content = newData.split(',')[1];

        return new Promise(async (resolve, reject) => {
            FileSystem.writeFile(fullPath, content, 'base64', error => {
                if(error)
                    reject(new Error(error));
                else resolve(fullPath);
            });
        });
    }

    static async resizeImage(user, path) {
        return new Promise(async (resolve, reject) => {
            const oldPath = path;
            const newPath = path.replace('.jpg', `_resized.jpg`).trim();

            await Sharp(FileSystem.readFileSync(oldPath))
                .resize(320, 247)
                .toFile(newPath)
                .then(() => {
                    FileSystem.unlinkSync(oldPath);
                    resolve(newPath);
                })
                .catch(error => reject(error));
        });
    }
}

module.exports = FSUtils;
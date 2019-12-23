const Multer = require('multer');

class Storage {
    static Configure(usersFolder) {
        return Multer.diskStorage({
            destination: (request, file, callback) => callback(null, usersFolder),
            filename: (request, file, callback) => {
                const fileNameComponents = file.originalname.split('.');
                const fileExtension = fileNameComponents[fileNameComponents.length - 1];
                const fileName = `${file.originalname}_${Date.now()}.${fileExtension}`;
                callback(null, fileName);
            }
        })
    }
}

module.exports = Storage;
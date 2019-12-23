// Dependencies
const FileSystem = require('fs');
const Path = require('path');
const Shart = require('sharp');
const FSUtils = require('../utilities/FSUtils');

// Get users folder path
const UsersFolder = Path.join(process.cwd(), 'data', 'users');

// Configure Storage
const Storage = require('../utilities/StorageUtils').Configure(UsersFolder);

class UserController {
    static getUserPhotos(request, response) {
        response.header('Content-Type', 'application/json');
        response.send(FSUtils.getUserPhotos(UsersFolder, request.query.user));
    }

    static getAll(request, response) {
        response.header('Content-Type', 'application/json');
        response.send(FSUtils.getDirectories(UsersFolder, UsersFolder));
    }

    static addUser(request, response) {
        response.header('Content-Type', 'application/json');

        if (request.body.user === undefined)
            return response.sendStatus(400);

        const UsersFolder = Path.join(process.cwd(), 'data', 'users');
        const currentUserFolder = Path.join(UsersFolder, '', request.body.user.name.toString());

        if (FileSystem.existsSync(currentUserFolder))
            return response.sendStatus(200);

        FileSystem.mkdirSync(currentUserFolder);

        response.sendStatus(200);
    }

    static async uploadBase64(request, response) {
        response.header('Content-Type', 'application/json');

        await FSUtils.uploadBase64(UsersFolder, request.body.user, request.body.data)
            .then(path => {
                FSUtils.resizeImage(request.body.user, path)
                    .then(newPath => { })
                    .catch(error => { throw new Error(error) });

                response.status(200).send({ ok: 1 });
            })
            .catch(error => {
                console.log(error);
                response.sendStatus(500).send({ error });
            });
    }
}

module.exports = UserController;
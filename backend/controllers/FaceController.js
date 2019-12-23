const FileSystem = require('fs');
const Path = require('path');

const FileWithFaces = Path.join(process.cwd(), 'data', 'faces.json');

class FaceController {
    static getFaces(request, response) {
        response.header('Content-Type', 'application/json');

        // Send 404 if the file is not found
        if (!FileSystem.existsSync(FileWithFaces))
            return response.sendStatus(404);

        // Clear node require cache
        delete require.cache[FileWithFaces];

        // Send the faces to the client
        response.send(require(FileWithFaces));
    }

    static saveFaces(request, response) {
        response.header('Content-Type', 'application/json');

        const receivedFaces = request.body.faces;

        // If no faces were received, send 204 (no content)
        if (receivedFaces === undefined || (receivedFaces !== undefined && !Array.from(receivedFaces).length))
            return response.sendStatus(204);

        // Write them down to the file
        FileSystem.writeFileSync(FileWithFaces, JSON.stringify(receivedFaces));

        // Send the response
        response.send('ok');
    }
}

module.exports = FaceController;
const OctopusEndPoint = require('express-octopus').OctopusEndPoint;
const UserControlller = require('../../../controllers/UserController');

class Index extends OctopusEndPoint {
    constructor() {
        super();
    }

    async get(request, response) {
        UserControlller.getUserPhotos(request, response);
    }
}

module.exports = Index;
const OctopusEndPoint = require('express-octopus').OctopusEndPoint;
const FaceController = require('../../../controllers/FaceController');

class Index extends OctopusEndPoint {
    constructor() {
        super();
    }

    async get(request, response) {
        FaceController.getFaces(request, response);
    }

    async post(request, response) {
        FaceController.saveFaces(request, response);
    }
}

module.exports = Index;
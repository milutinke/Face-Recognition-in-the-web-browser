const OctopusEndPoint = require('express-octopus').OctopusEndPoint;
const UserControlller = require('../../../../controllers/UserController');

class Index extends OctopusEndPoint {
    constructor() {
	    super();
    }

    async post(request, response) {
        UserControlller.addUser(request, response);
    }
}

module.exports = Index;
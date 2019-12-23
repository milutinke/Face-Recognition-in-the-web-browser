const Express = require('express');
const FileSystem = require('fs');
const https = require('https');
const App = Express();

App.use(Express.static('static'));

// SSL
/*
https.createServer({
    key: FileSystem.readFileSync('./key.pem'),
    cert: FileSystem.readFileSync('./cert.pem'),
    passphrase: 'bym0987654321'
}, App)
.listen(8080, () => console.log('Started on 8080.'));*/

App.listen(8080, () => console.log('Started on 8080.'));
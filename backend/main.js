// Dependencies
const Express = require('express');
const ExpressOctopus = require('express-octopus');
const Path = require('path');
const CookieParser = require('cookie-parser');
const BodyParser = require('body-parser');
const FileSystem = require('fs');
//const https = require('https');

// Hack: Using symbols to make methods private
const initialiseExpress = Symbol();
const configureExpress = Symbol();
const initialiseOctopus = Symbol();
const octopusAutowire = Symbol();
const startServer = Symbol();

class Main {
    constructor(port) {
        // Initialise Express
        this[initialiseExpress]();

        // Configure Express
        this[configureExpress]();

        // Init Octopus
        this[initialiseOctopus]();

        // Octopus Autowire
        this[octopusAutowire]();

        // Start Express Server
        this[startServer](port);
    }

    [initialiseExpress]() {
        // Express is already instanced, skip
        if (this.app !== undefined)
            return;

        // Instantiate express
        this.app = Express();
    }

    [configureExpress]() {
        // If the express is not initialised, skip
        if (this.app === undefined)
            throw new Error(`Express is not instantiated!`.bgRed.white);

        // Express is already configured, skip
        if (this.alreadyConfigured !== undefined)
            return;

        this.alreadyConfigured = true;

        this.app.use(CookieParser());
        this.app.use(BodyParser.json({ limit: '100mb', extended: true }));
        this.app.use(BodyParser.urlencoded({ limit: '100mb', extended: true }));

        // Allow cross origin requests
        this.app.use((request, response, next) => {
            response.header('Access-Control-Allow-Origin', '*');
            response.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE');
            response.header('Access-Control-Allow-Headers', 'origin, content-type, Authorization');
            response.header('Content-Type', 'application/json');

            if (response.method === 'OPTIONS')
                response.sendStatus(200);
            else next();
        });

        // Serve static
        this.app.use('/data', Express.static(Path.join(process.cwd(), '/', 'data')));
    }

    [initialiseOctopus]() {
        // If the express is not initialised, skip
        if (this.app === undefined)
            throw new Error(`Express is not initialised!`.bgRed.white);

        // Octopus is already instantiated, skip
        if (this.octopus !== undefined)
            return;

        // Instantiate and configure octopus
        this.octopus = new ExpressOctopus.Setup(
            this.app,
            ExpressOctopus.DefaultConfiguration.Development
        );
    }

    [octopusAutowire]() {
        // Octopus is not instantiated
        if (this.octopus === undefined)
            throw new Error(`Express-Octopus is not instantiated!`.bgRed.white);

        // Already autowired, skip
        if (this.alreadyAutoWired !== undefined)
            return;

        this.alreadyAutoWired = true;
        this.octopus.autowire();
    }

    [startServer](port) {
        if (isNaN(port) || !Number.isInteger(port))
            throw new Error('Port must be an integer!');

        if (this.app === undefined)
            throw new Error(`Express is not initialised!`.bgRed.white);

        // SSL
        /*
        https.createServer({
            key: FileSystem.readFileSync('./key.pem'),
            cert: FileSystem.readFileSync('./cert.pem'),
            passphrase: 'bym0987654321'
        }, this.app)
        .listen(3000, '192.168.0.13', () => console.log('Started on 3000.'));*/

        this.app.listen(port, () => console.log(`The server has been started on port: ${port}.`.green));
    }
}

module.exports = Main;
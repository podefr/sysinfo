"use strict";

console.log("Starting agent");

const configuration = require("./agent.conf.json");
const io = require("socket.io");

let server;

startServer();
loadModules();

function startServer() {
    const port = configuration.PORT;

    console.log("Starting server on port", port);
    server = io(port);
}

function loadModules() {
    Object.keys(configuration.MODULES).forEach(function (moduleName) {
        console.log(`Loading module ${moduleName}`);

        const module = require(`./modules/${moduleName}/index`);

        try {
            let moduleNamespace = server
                .of(`/${moduleName}`)
                .on("connection", _ => console.log(`New client connected on ${moduleName}`))
                .on("disconnect", _ => console.log(`Client disconnected from ${moduleName}`));

            module.init(moduleNamespace, configuration.MODULES[moduleName].configuration);
        } catch (e) {
            console.error(`Cannot initialize module ${moduleName}, make sure it has an init function. [link to error documentation]`);
            throw new Error(e);
        }
    });
}


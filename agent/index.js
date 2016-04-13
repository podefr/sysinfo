"use strict";

console.log("Starting agent");

const configuration = require("./agent.conf.json");

Object.keys(configuration.MODULES).forEach(function (moduleName) {
    console.log(`Loading module ${moduleName}`);

    const module = require(`./${moduleName}/index`);

    try {
        module.init(configuration.MODULES[moduleName].configuration);
    } catch (e) {
        console.error(`Cannot initialize module ${moduleName}, make sure it has an init function. [link to error documentation]`);
        throw new Error(e);
    }
});
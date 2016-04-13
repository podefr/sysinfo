"use strict";

console.log("Starting agent");

const configuration = require("./agent.conf");

configuration.MODULES.forEach(function (path) {
    console.log(`Loading module ${path}`);

    const module = require(`./${path}/index`);

    try {
        module.init();
    } catch (e) {
        console.error(`Cannot initialize module ${path}, make sure it has an init function. [link to error documentation]`);
        throw new Error(e);
    }
});
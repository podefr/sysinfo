"use strict";

console.log("Starting server");

const ioClient = require("socket.io-client");
const configuration = require("./server.conf.json");

startModules();

function startModules() {
   Object.keys(configuration.SERVER.MODULES).forEach(moduleName => {
      const moduleConfiguration = configuration.SERVER.MODULES[moduleName];

      console.log(`Starting ${moduleName}`);

      const module = require(`./${moduleName}/index`);

      module.init(connectAgent(moduleName), moduleConfiguration);
   });
}

function connectAgent(moduleName) {
   const URL = configuration.AGENT.URL;
   const PORT = configuration.AGENT.PORT;

   return ioClient.connect(`${URL}:${PORT}/${moduleName}`);
}
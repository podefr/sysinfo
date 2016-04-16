"use strict";

console.log("Starting server");

const express = require("express");
const ioServer = require("socket.io");
const ioClient = require("socket.io-client");
const configuration = require("./server.conf.json");
const http = require("http");
const path = require("path");

const application = express();
const server = http.Server(application);
const serverSocket = ioServer(server);

startWebServer();
initIO();
startModules();

function startModules() {
   Object.keys(configuration.SERVER.MODULES).forEach(moduleName => {
      const moduleConfiguration = configuration.SERVER.MODULES[moduleName];
      const module = require(`./${moduleName}/index`);
      const moduleRoutes = require(`./${moduleName}/${moduleName}.conf.json`).ROUTES;

      module.init(connectToAgent(moduleName), serverSocket.of(`${moduleName}`), moduleConfiguration);

      Object.keys(moduleRoutes).forEach(routeName => {
         const methodName = moduleRoutes[routeName];

         if (typeof module[methodName] !== "function") {
            throw new Error(`No handler ${moduleName}.${methodName} found for route ${moduleName}/${routeName}`);
         }
         application.get(`/${moduleName}/${routeName}`, module[methodName].bind(module));
      });

      console.log(`${moduleName} started`);
   });
}

function connectToAgent(moduleName) {
   const URL = configuration.AGENT.URL;
   const PORT = configuration.AGENT.PORT;
   const socket = ioClient.connect(`${URL}:${PORT}/${moduleName}`);

   socket.on("connect", _ => console.log(`${moduleName} is connected`));
   socket.on("disconnect", _ => console.log(`${moduleName} is disconnected`));

   return socket;
}

function startWebServer() {
   const port = configuration.SERVER.PORT;

   application.get("/", (request, response) => {
      response.sendFile(path.resolve(`${__dirname}/${configuration.SERVER.INDEX_PATH}`));
   });

   server.listen(port);
   console.log(`Web server running on http://localhost:${port}`);
}

function initIO() {
   serverSocket.on("connect", _ => console.log("Accepted new connection from web client"));
}
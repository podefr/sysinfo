"use strict";

console.log("Starting server");

const ioServer = require("socket.io");
const ioClient = require("socket.io-client");
const configuration = require("./server.conf.json");
const http = require("http");
const fs = require("fs");

startModules(startIO(startWebServer()));

function startModules(serverSocket) {
   Object.keys(configuration.SERVER.MODULES).forEach(moduleName => {
      const moduleConfiguration = configuration.SERVER.MODULES[moduleName];
      const module = require(`./${moduleName}/index`);

      console.log(`Starting ${moduleName}`);
      module.init(connectAgent(moduleName), serverSocket.of(`${moduleName}`), moduleConfiguration);
   });
}

function connectAgent(moduleName) {
   const URL = configuration.AGENT.URL;
   const PORT = configuration.AGENT.PORT;
   const socket = ioClient.connect(`${URL}:${PORT}/${moduleName}`);

   socket.on("connect", _ => console.log(`${moduleName} is connected`));
   socket.on("disconnect", _ => console.log(`${moduleName} is disconnected`));

   return socket;
}

function startWebServer() {
   const port = configuration.SERVER.PORT;
   const server = http.createServer((request, response) => {
      response.writeHead(200, {"Content-Type": "text/html"});
      response.write(fs.readFileSync(configuration.SERVER.INDEX_PATH));
      response.end();
   });

   server.listen(port);
   console.log(`Web server running on http://localhost:${port}`);

   return server;
}

function startIO(server) {
   const serverSocket = ioServer(server);

   serverSocket.on("connect", _ => console.log("Accepted new connection to web server"));

   return serverSocket;
}
"use strict";

let _agentSocket;

const infos = {};

module.exports = {
    init: function init(agentSocket, clientSocket) {
        _agentSocket = agentSocket;

        _agentSocket.on("all", (snapshot) => {
            Object.assign(infos, snapshot);
        });

        _agentSocket.on("update", (update) => {
            Object.assign(infos, update);

            clientSocket.emit("update", update);
        });
    },

    getAllInfo: function getAllInfo(request, response) {
        response.send(infos);
    }
};
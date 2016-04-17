"use strict";

let _agentSocket;

module.exports = {
    init: function init(agentSocket, clientSocket) {
        _agentSocket = agentSocket;

        _agentSocket.on("disconnect", emitStatus);

        _agentSocket.on("connect", emitStatus);

        function emitStatus() {
            clientSocket.emit("status", {
                status: _agentSocket.connected
            });
        }
    },

    getStatus: function getStatus(request, response) {
        response.send({
            status: _agentSocket.connected
        });
    }
};
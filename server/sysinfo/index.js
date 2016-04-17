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

    /**
     * get all info
     *
     * @example
     *
     * returns:
     *
     * {
     *  CPU_ARCHITECTURE: "x64",
     *  CPUS: [
     *      {
     *          model: "Intel",
     *          speed: 2300,
     *          times: {
     *              user: 23345345,
     *              nice: 0,
     *              sys: 45345345345,
     *              idle: 4334345
     *          }
     *      }, ...
     *  ],
     *  FREEMEM: 33345,
     *  NETWORK_INTERFACES: {... see node.js doc }
     *  OS_RELEASE: "1.34.2",
     *  OS_TYPE: "Darwin"
     *  PLATFORM: "darwin",
     *  TOTALMEM: 345345345,
     *  UPTIME: 52343535
     * }
     *
     * @param request
     * @param response
     */
    getAllInfo: function getAllInfo(request, response) {
        response.send(infos);
    }
};
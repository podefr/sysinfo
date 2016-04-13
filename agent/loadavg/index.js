"use strict";

const stats = require("./stats");
const scheduler = require("./scheduler");
const ioServer = require("socket.io");

module.exports = {
    init: function init(socket, moduleConfiguration) {
        console.log("Start polling load average");

        function emitLoadAverage() {
            stats.getLoadAverage()
                .then(loadAverage => {
                    console.log("load average", loadAverage);
                    socket.emit("current", loadAverage);
                })
                .fail(error => console.error(error));
        }

        socket.on("connect", emitLoadAverage);

        scheduler.addJob(emitLoadAverage);
        scheduler.start(moduleConfiguration.POLLING_FREQUENCY_S * 1e3);
    }
};
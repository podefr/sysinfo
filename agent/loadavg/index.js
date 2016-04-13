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
                    const data = {
                        loadAverage: loadAverage,
                        time: new Date()
                    };

                    console.log("load average", data);
                    socket.emit("current", data);
                })
                .fail(error => console.error(error));
        }

        socket.on("connect", emitLoadAverage);

        scheduler.addJob(emitLoadAverage);
        scheduler.start(moduleConfiguration.POLLING_FREQUENCY_S * 1e3);
    }
};
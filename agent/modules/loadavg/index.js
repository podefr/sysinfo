"use strict";

const stats = require("./stats");
const Scheduler = require("./../../lib/scheduler");

module.exports = {
    init: function init(socket, moduleConfiguration) {
        const scheduler = new Scheduler();
        console.log("Start polling load average");

        function emitLoadAverage() {
            stats.getLoadAverage()
                .then(loadAverage => {
                    console.log("Sending loadAverages");

                    socket.emit("current", {
                        loadAverage: loadAverage,
                        time: new Date()
                    });
                })
                .fail(error => console.error(error));
        }

        socket.on("connect", emitLoadAverage);

        scheduler.addJob(emitLoadAverage);
        scheduler.start(moduleConfiguration.POLLING_FREQUENCY_S * 1e3);
    }
};
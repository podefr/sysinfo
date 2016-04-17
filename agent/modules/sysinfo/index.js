"use strict";

const os = require("os");
const Scheduler = require("./../../lib/scheduler");

module.exports = {
    init: function init(socket, moduleConfiguration) {
        const scheduler = new Scheduler();
        console.log("Start polling system info");

        socket.on("connect", () => {
            console.log("Sending all system info");

            socket.emit("all", getAllInfo());

            scheduler.start(moduleConfiguration.POLLING_FREQUENCY_S * 1e3);
        });

        scheduler.addJob(() => {
            console.log("Sending system info update");

            socket.emit("update", getUpdate())
        });


        function getAllInfo() {
            return {
                CPU_ARCHITECTURE: os.arch(),
                CPUS: os.cpus(),
                FREEMEM: os.freemem(),
                NETWORK_INTERFACES: os.networkInterfaces(),
                OS_RELEASE: os.release(),
                OS_TYPE: os.type(),
                PLATFORM: os.platform(),
                TOTALMEM: os.totalmem(),
                UPTIME: os.uptime()
            }
        }

        function getUpdate() {
            return {
                FREEMEM: os.freemem(),
                UPTIME: os.uptime()
            }
        }
    }
};
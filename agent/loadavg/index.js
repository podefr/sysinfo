"use strict";

const stats = require("./stats");
const scheduler = require("./scheduler");

module.exports = {
    init: function init(moduleConfiguration) {
        console.log("Starting polling load average");

        scheduler.addJob(_ => {
            stats.getLoadAverage().then(loadAverage => {
                console.log(loadAverage);
            });
        });

        scheduler.start(moduleConfiguration.POLLING_FREQUENCY_S * 1e3);
    }
};
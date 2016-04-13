"use strict";

const exec = require("child_process").exec;
const q = require("q");

const configuration = require("./loadavg.conf.json");

function extractLoadAverage(uptimeString) {
    return uptimeString
        .match(new RegExp(configuration.LOAD_AVG_PATTERN))[1]
        .split(" ");
}

module.exports = {
    getLoadAverage: function getLoadAverage() {
        let defer = q.defer();

        exec("uptime", function getUptime(error, uptime) {
            if (error) {
                defer.reject(error);
            }

            return defer.resolve(extractLoadAverage(uptime));
        });

        return defer.promise;
    }
};
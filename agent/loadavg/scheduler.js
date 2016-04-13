"use strict";

let schedulerHandle;
let running = false;

let jobs = [];

function executeJobs() {
    jobs.forEach(job => job());
}

module.exports = {
    start: function start(interval) {
        if (!running) {
            setInterval(executeJobs, interval);
        }
    },

    addJob: function addJob(job) {
        jobs.push(job);
    },

    removeJob: function removeJob() {
    },

    stop: function stop() {
    }

};
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
            schedulerHandle = setInterval(executeJobs, interval);
            running = true;
        }
    },

    addJob: function addJob(job) {
        jobs.push(job);
    },

    removeJob: function removeJob() {
    },

    stop: function stop() {
        if (running) {
            clearInterval(schedulerHandle);
        }
    }

};
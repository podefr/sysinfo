"use strict";

module.exports = function Scheduler() {
    let schedulerHandle;
    let running = false;

    const jobs = [];

    function executeJobs() {
        jobs.forEach(job => job());
    }

    this.start = function start(interval) {
        if (!running) {
            schedulerHandle = setInterval(executeJobs, interval);
            running = true;
        }
    };

    this.addJob = function addJob(job) {
        jobs.push(job);
    };

    this.removeJob = function removeJob() {

    };

    this.stop = function stop() {
        if (running) {
            clearInterval(schedulerHandle);
        }
    };
};
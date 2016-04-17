"use strict";

const moment = require("moment");

/**
 * A static, shared store to save all the received load averages
 * Should be kept outside of the server process but is here for simplicity.
 *
 * It has a simple insert function to push the received load averages, and a get function
 * to get all the alerts until T time
 */
const statsStore = [];

module.exports = {
    /**
     * Insert a new load average. Note that load averages are expected to be inserted chronologically
     * @param {Object} reading a new load average
     */
    insert: function insert(reading) {
        statsStore.push(reading);
    },

    /**
     * Get a list of chronologically sorted load averages based on the provided time window
     * @param {Number} number the number of units (2 minutes, 3 seconds...)
     * @param {String} unit the unit of time (hours, minutes, seconds...)
     * @returns {Array} A list of chronologically sorted load averages
     */
    get: function get(number, unit) {
        const limit = moment().subtract(number, unit);
        let index = statsStore.length;

        while (--index) {
            if (moment(limit).isAfter(statsStore[index].time)) {
                break;
            }
        }

        return statsStore.slice(index);
    }
};
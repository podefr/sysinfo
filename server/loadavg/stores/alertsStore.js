"use strict";

const alertsStore = [];

/**
 * A static, shared store to save all the generated alerts
 * Should be kept outside of the server process but is here for simplicity.
 *
 * It has a simple insert function to push new generated alerts and a get function
 * to get the N last alerts
 */
module.exports = {
    /**
     * Insert a new alert in the array
     * @param {Object} alert a new alert
     */
    insert: function insert(alert) {
        alertsStore.push(alert);
    },

    /**
     * Get the N last alerts
     * @param {Number} count the number of alerts to get. All of called without params
     * @returns {Array} an array of N alerts
     */
    get: function get(count) {
        return alertsStore.slice(-count);
    }
};
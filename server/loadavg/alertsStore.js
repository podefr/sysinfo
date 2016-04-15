"use strict";

const alertsStore = [];

module.exports = {
    insert: function insert(reading) {
        alertsStore.push(reading);
    },

    select: function select(limit) {
        if (!limit) {
            return alertsStore.slice();
        }
    }
};
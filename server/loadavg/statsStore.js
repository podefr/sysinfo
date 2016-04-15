"use strict";

const moment = require("moment");

const statsStore = [];

module.exports = {
    insert: function insert(reading) {
        statsStore.push(reading);
    },

    select: function select(limit) {
        if (!limit) {
            return statsStore.slice();
        }
    }
};
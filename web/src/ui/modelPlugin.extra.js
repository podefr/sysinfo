"use strict";

const moment = require("moment");

module.exports = {
    formatTime: function formatTime(time) {
        this.innerText = moment(time).format("lll");
    },

    formatNumber: function formatNumber(number) {
        this.innerText = (number).toFixed(2);
    }
};
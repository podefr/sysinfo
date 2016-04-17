"use strict";

const Alerts = require("./ui/Alerts");
const LoadAverages = require("./ui/LoadAverages");

let cerberusAPI;
let configuration;
let loadAverages;
let alerts;

module.exports = {
    init: function init(_cerberusAPI, _configuration) {
        cerberusAPI = _cerberusAPI;
        configuration = _configuration;

        this.initializeUIElements();
        this.getSnapshots();
        this.subscribeToUpdates();
    },

    initializeUIElements: function initializeUIElements() {
        const dom = cerberusAPI.getDom();

        alerts = new Alerts(cerberusAPI);
        alerts.init();
        alerts.render(dom.querySelector(".alerts"));


        loadAverages = new LoadAverages(cerberusAPI);
        loadAverages.init();
        loadAverages.render(dom.querySelector(".load-averages"));
    },

    getSnapshots: function getSnapshots() {
        cerberusAPI.getJSON("loadavg", "get-load-averages", {
            number: 10,
            unit: "minutes"
        }).then(loadAverages.setSnapshot);
        alerts.setSnapshot([]);
    },

    subscribeToUpdates: function subscribeToUpdates() {
        cerberusAPI.getSocket("loadavg").on("current", loadAverages.update);

        alerts.update();
    }
};
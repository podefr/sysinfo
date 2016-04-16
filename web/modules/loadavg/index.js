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
        alerts.setSnapshot([]);
        loadAverages.setSnapshot([]);
    },

    subscribeToUpdates: function subscribeToUpdates() {
        let loadAveragesSocket = cerberusAPI.getSocket("loadavg");

        loadAveragesSocket.on("current", loadavg => console.log(loadavg));

        alerts.update();
        loadAverages.update();
    }
};
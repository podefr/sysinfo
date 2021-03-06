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

        this.getCpuCount().then((cpuCount) => {
            this.initializeUIElements(cpuCount);
            this.getSnapshots();
            this.subscribeToUpdates();
        });
    },

    initializeUIElements: function initializeUIElements(cpuCount) {
        const dom = cerberusAPI.getDom();

        alerts = new Alerts(cerberusAPI);
        alerts.init();
        alerts.render(dom.querySelector(".alerts"));


        loadAverages = new LoadAverages(cerberusAPI);
        loadAverages.init();
        loadAverages.setCpuCount(cpuCount);
        loadAverages.setTimeWindow(configuration.timeWindow);
        loadAverages.setDimensions(configuration.chartDimensions);
        loadAverages.render(dom.querySelector(".load-averages"));
    },

    getSnapshots: function getSnapshots() {
        getLoadAverages().then(loadAverages.setSnapshot);
        getAlerts().then(alerts.setSnapshot);
    },

    subscribeToUpdates: function subscribeToUpdates() {
        const loadavgSocket = cerberusAPI.getSocket("loadavg");

        loadavgSocket.on("current", _ => {
            getLoadAverages().then(loadAverages.setSnapshot);
        });

        loadavgSocket.on("alert", alert => {
            getAlerts().then(alerts.setSnapshot);
            cerberusAPI.APICall("notifications", "notify", {
                text: `Load average triggered an alert`,
                type: alert.type === "ALERT_RAISED" ? "ember" : "green"
            });
        });

    },

    getCpuCount: function getCpuCount() {
        return cerberusAPI
            .getJSON("sysinfo", "get-all-info")
            .then((allInfo) => {
                return allInfo.CPUS.length;
            });
    }
};

function getLoadAverages() {
    return cerberusAPI.getJSON("loadavg", "get-load-averages", configuration.timeWindow);
}

function getAlerts() {
    return cerberusAPI.getJSON("loadavg", "get-alerts", configuration.alertsCount);
}
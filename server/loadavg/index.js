"use strict";

const Bacon = require("baconjs").Bacon;

const statsStore = require("./stores/statsStore");
const alertsStore = require("./stores/alertsStore");

const Alerts = require("./alerts/Alerts");

module.exports = {
    init: function init(agentSocket, serverSocket, configuration) {
        const stream = createStream(agentSocket);
        const alerts = new Alerts(stream);

        alerts
            .setThreshold(configuration.THRESHOLD)
            .setAverageTimeWindow(configuration.TIME_WINDOW[0], configuration.TIME_WINDOW[1])
            .startComputing()
            .doAction(saveToStore(alertsStore))
            .doAction(broadcastToClient("alert", serverSocket))
            .log();

        stream
            .doAction(saveToStore(statsStore))
            .doAction(broadcastToClient("current", serverSocket))
            .log();
    },

    getAlerts: function getAlerts(request, response) {
        response.send(alertsStore.get());
    },

    getLoadAverages: function getLoadAverages(request, response) {
        response.send(statsStore.get());
    }
};

function createStream(agentSocket) {
    return Bacon.fromBinder(sink => {
        agentSocket.on("current", loadAverage => {
            sink(loadAverage);
        });
    });
}

function broadcastToClient(eventName, serverSocket) {
    return event => {
        serverSocket.emit(eventName, event);
    };
}

function saveToStore(store) {
    return data => {
        store.insert(data);
    }
}
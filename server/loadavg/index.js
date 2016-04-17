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
        let count = +request.query.count;

        response.send(alertsStore.get(count));
    },

    getLoadAverages: function getLoadAverages(request, response) {
        let number = +request.query.number;
        let unit = request.query.unit;

        response.send(statsStore.get(number, unit));
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
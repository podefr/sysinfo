"use strict";

const Bacon = require("baconjs").Bacon;

const statsStore = require("./statsStore");
const alertsStore = require("./alertsStore");

const Alerts = require("./Alerts");

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
            .doAction(broadcastToClient("current", serverSocket));

        serverSocket.on("connect", _ => {
            // send snapshots!!!
        });
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
"use strict";

const bacon = require("baconjs");
const moment = require("moment");

const statsStore = require("./statsStore");
const alertsStore = require("./alertsStore");

const Alerts = require("Alerts");

module.exports = {
    init: function init(agentSocket, serverSocket, configuration) {
        const stream = createStream(agentSocket);
        const alerts = new Alerts(stream, broadcastToClient("alert", serverSocket));

        alerts.setThreshold(1);
        alerts.setAverageTimeWindow(2, "minutes");

        alerts
            .init()
            .doAction(saveToStore(alertsStore));

        stream
            .doAction(saveToStore(statsStore))
            .doAction(broadcastToClient("current", serverSocket))
            .log();

        serverSocket.on("connect", _ => {
            // send snapshots!!!
        });
    }
};

function createStream(agentSocket) {
    return bacon.fromBinder(sink => {
        agentSocket.on("current", loadAverage => {
            sink(new bacon.Next(loadAverage));
        });
    });
}

function broadcastToClient(serverSocket, eventName) {
    return event => {
        serverSocket.emit(eventName, event);
    };
}

function saveToStore(store) {
    return data => {
        store.insert(data);
    }
}
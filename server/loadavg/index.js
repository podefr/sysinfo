"use strict";

const bacon = require("baconjs");
const moment = require("moment");

const statsStore = require("./statsStore");
const alertsStore = require("./alertsStore");

module.exports = {
    init: function init(agentSocket, serverSocket, configuration) {
        const stream = createStream(agentSocket);

        stream
            .map(saveToStore(statsStore))
            .map(broadcastToClient(serverSocket))
            .log();

        const startDate = moment().unix();

        const hasNotEnoughData = stream.map(data => {
            return startDate > moment(data.time).subtract(2, "minutes").unix();
        }).toProperty();

        stream
            .map(extractCurrentLoadAverage)
            .scan([], accumulateLoadAverage)
            .toEventStream()
            .map(calculateAverage)
            .skipWhile(hasNotEnoughData)
            .map(computeAlert)
            .skipDuplicates()
            .skipWhile(cantTriggerAlert)
            .map(triggerAlert)
            .log();

        serverSocket.on("connect", _ => {
        });
    }
};

function calculateAverage(accumulatedLoadAverage) {
    const sum = accumulatedLoadAverage.reduce((sum, item) => sum + item.currentLoadAverage, 0);

    return sum / accumulatedLoadAverage.length;
}

function cantTriggerAlert(alert) {
    return alert === "noalert";
}

function computeAlert(average) {
    if (average >= 2) {
        return "alert";
    } else {
        return "noalert";
    }
}

function triggerAlert(alert) {
    return alert;
}

function isOlderThanLimit(time) {
    return moment(time).unix() < moment().subtract(2, "minutes").unix();
}

function extractCurrentLoadAverage(data) {
    return {
        currentLoadAverage: data.loadAverage[0],
        time: data.time
    }
}

function accumulateLoadAverage(acc, data) {
    acc.push(data);
    return acc.filter(item => !isOlderThanLimit(item.time));
}

function createStream(agentSocket) {
    return bacon.fromBinder(sink => {
        agentSocket.on("current", loadAverage => {
            sink(new bacon.Next(loadAverage));
        });
    });
}

function broadcastToClient(serverSocket) {
    return event => {
        serverSocket.emit("current", event);
        return event;
    };
}

function saveToStore(store) {
    return data => {
        store.insert(data);
        return data;
    }
}
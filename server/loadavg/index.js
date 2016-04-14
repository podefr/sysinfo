"use strict";

const bacon = require("baconjs");
const moment = require("moment");

module.exports = {
  init: function init(agentSocket, serverSocket, configuration) {
      const stream = bacon.fromBinder(sink => {
          agentSocket.on("current", loadAverage => {
              sink(new bacon.Next(loadAverage));
          });
      });

      stream
          .map(event => {
              serverSocket.emit("current", event);
              return event;
          })
          .log();
  }
};
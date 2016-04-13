"use strict";

module.exports = {
  init: function init(socket, configuration) {
      socket.on("current", function (loadAverage) {
          console.log("got load average", loadAverage);
      });
  }
};
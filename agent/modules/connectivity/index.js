"use strict";

module.exports = {
    init: function init(socket) {
        socket.on("connect", () => {
            socket.emit("ping");
        });
    }
};
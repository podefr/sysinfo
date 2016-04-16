"use strict";

let cerberusAPI;

module.exports = {
    init: function init(_cerberusAPI) {
        cerberusAPI = _cerberusAPI;

        let socket = cerberusAPI.getSocket("loadavg");

        socket.on("current", loadavg => console.log(loadavg));

        initializeUIElements();
        initializeWebSocket();

    }
};

function initializeUIElements() {
console.log("initializing UIElements");
}

function initializeWebSocket() {

}
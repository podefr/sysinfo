"use strict";

module.exports = {
    init: function init(cerberusAPI) {
        const sysinfoDom = cerberusAPI.getDom();
        const socket = cerberusAPI.getSocket("sysinfo");

        cerberusAPI
            .getJSON("sysinfo", "get-all-info")
            .then(setSnapshot);

        socket.on("update", update);

        function setSnapshot() {

        }

        function update() {

        }

    }
};
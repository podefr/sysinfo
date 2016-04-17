"use strict";

const InfoUI = require("./ui/Info");

module.exports = {
    init: function init(cerberusAPI) {
        const infoUIDom = cerberusAPI.getDom().querySelector(".general-info");
        const socket = cerberusAPI.getSocket("sysinfo");

        const infoUI = new InfoUI();

        infoUI.init();
        infoUI.render(infoUIDom);

        cerberusAPI
            .getJSON("sysinfo", "get-all-info")
            .then(infoUI.setSnapshot);

        socket.on("update", infoUI.update);
    }
};
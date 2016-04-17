"use strict";

module.exports = {
    init: function init(cerberusAPI) {
        const splash = cerberusAPI.getDom().querySelector(".splash-screen");
        const socket = cerberusAPI.getSocket("connectivity");

        cerberusAPI
            .getJSON("connectivity", "get-status")
            .then(showSplashScreen);

        socket.on("status", showSplashScreen);

        function showSplashScreen(data) {
            if (data.status) {
                splash.classList.add("hide");
            } else {
                splash.classList.remove("hide");
            }
        }

    }
};
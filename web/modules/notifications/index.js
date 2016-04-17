"use strict";

let dom;
let configuration;

module.exports = {
    init: function init(cerberusAPI, _configuration) {
        dom = cerberusAPI.getDom().querySelector(".notification");
        configuration = _configuration;
    },

    notify: function notify(options) {
        ["show", options.type].forEach(className => dom.classList.add(className));
        dom.innerText = options.text;

        setTimeout(() => {
            ["show", options.type].forEach(className => dom.classList.remove(className));
        }, configuration.NOTIFICATION_DELAY)
    }
};
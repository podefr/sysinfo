"use strict";

const Store = require("emily").Store;

module.exports = function Alerts(cerberusAPI) {
    const _alertsStore = new Store([]);
    let _list;

    this.init = function init() {
        const List = cerberusAPI.getUIElement("list");

        _list = new List(_alertsStore);
    };

    this.render = function render(dom) {
        _list.render(dom);
    };

    this.setSnapshot = function setSnapshot(snapshot) {
        _alertsStore.reset(snapshot.reverse());
    };
};
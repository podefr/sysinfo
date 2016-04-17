"use strict";

const OObject = require("olives").OObject;
const BindPlugin = require("olives")["Bind.plugin"];
const bindPluginExtra = require("../modelPlugin.extra");

module.exports = function List(model) {
    const list = new OObject(model);

    list.seam.addAll({
        model: new BindPlugin(model, bindPluginExtra)
    });

    this.render = function render(view) {
        list.alive(view);
    }
};
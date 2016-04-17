"use strict";

const OObject = require("olives").OObject;
const BindPlugin = require("olives")["Bind.plugin"];

module.exports = function List(model) {
    const list = new OObject(model);

    list.seam.addAll({
        model: new BindPlugin(model, {
            toggleClass: function toggleClass(value, className) {
                if (value) {
                    this.classList.add(className);
                } else {
                    this.classList.remove(className);
                }
            }
        })
    });

    this.render = function render(view) {
        list.alive(view);
    }
};
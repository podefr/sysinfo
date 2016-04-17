"use strict";

const Store = require("emily").Store;
const OObject = require("olives").OObject;
const BindPlugin = require("olives")["Bind.plugin"];
const moment = require("moment");

module.exports = function Info() {
    const infoStore = new Store({});
    const info = new OObject(infoStore);

    function toGB(memory) {
        return (memory / Math.pow(2, 30)).toFixed(2) + " GB";
    }

    this.init = function init() {
        info.seam.addAll({
            model: new BindPlugin(infoStore, {
                getSeconds: function getSeconds(seconds) {
                    this.innerText = moment().subtract(seconds, "seconds").fromNow();
                },

                getMemory: function getMemory(memory) {
                    this.innerText = toGB(memory);
                },

                getCpuModel: function getCpuModel(CPUS) {
                    this.innerText = CPUS[0].model;
                },

                getCpuSpeed: function getCpuSpeed(CPUS) {
                    this.innerText = CPUS[0].speed;
                },

                getCpuCount: function getCpuCount(CPUS) {
                    this.innerText = CPUS.length;
                }
            })
        });
    };

    this.render = function render(dom) {
        info.alive(dom);
    };

    this.update = function update(update) {
        Object.keys(update).forEach((key) => {
            infoStore.set(key, update[key]);
        });
    };

    this.setSnapshot = function setSnapshot(snapshot) {
        infoStore.reset(snapshot);
    };
};
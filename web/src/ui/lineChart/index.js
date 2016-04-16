"use strict";

//const d3 = require("d3");

module.exports = function LineChart() {
    let minDomain = 0;
    let maxDomain;

    let minRange = 0;
    let maxRange;

    let _scale;

    this.setDomain = function setDomain(max, min) {
        maxDomain = max;

        if (typeof min !== "undefined") {
            minDomain = min;
        }
    };

    this.setRange = function setRange(max, min) {
        maxRange = max;

        if (typeof min !== "undefined") {
            minRange = min;
        }
    };

    this.render = function render(dom) {
        if (!dom) {
            throw new Error("LineChart requires a dom element to e rendered");
        }
        _scale = createScale();

        dom.append("svg:svg");


    };

    function createScale() {
        if (!maxDomain || !maxRange) {
            throw new Error("LineChart requires a max range and a max domain to be rendered");
        }

        return d3
            .scale
            .linear()
            .domain([minDomain, maxDomain])
            .range([minRange, maxRange]);
    }
};
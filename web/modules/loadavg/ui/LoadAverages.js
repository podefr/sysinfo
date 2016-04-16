"use strict";

let lineChart;

module.exports = function LoadAverages(cerberusAPI) {
    this.init = function init(options) {
        const LineChart = cerberusAPI.getUIElement("lineChart");
        lineChart = new LineChart();
    };

    this.render = function render(dom) {
        lineChart.setDomain(8);
        lineChart.setRange(200);
        lineChart.render(dom);
    };

    this.setSnapshot = function setSnapshot() {

    };

    this.update = function update() {

    };
};
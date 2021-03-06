"use strict";

const d3 = require("d3");
const moment = require("moment");

module.exports = function LoadAverages(cerberusAPI) {
    let _lineChart;
    let _timeWindow;
    let _cpuCount;
    let _height;
    let _width;

    this.init = function init() {
        const LineChart = cerberusAPI.getUIElement("lineChart");
        _lineChart = new LineChart();
    };

    this.setTimeWindow = function setTimeWindow(timeWindow) {
        _timeWindow = timeWindow;
    };

    this.setDimensions = function setDimensions(dimensions) {
        _width = dimensions.width;
        _height = dimensions.height;
    };

    this.setCpuCount = function setCpuCount(cpuCount) {
        _cpuCount = cpuCount;
    };

    this.render = function render(dom) {
        _lineChart.setXScale(createXScale());
        _lineChart.setYScale(createYScale());
        _lineChart.setDimensions(_width, _height);
        _lineChart.render(dom);
    };

    this.setSnapshot = function setSnapshot(update) {
        _lineChart.update(update.map(transformForChart));
        _lineChart.updateXDomain([
            new Date(moment().subtract(_timeWindow.number, _timeWindow.unit)),
            new Date(moment())
        ]);
    };

    function createXScale() {
        return d3.time.scale.utc()
            .domain([
                new Date(moment().subtract(_timeWindow.number, _timeWindow.unit)),
                new Date(moment())
            ])
            .range([0, _width]);
    }

    function createYScale() {
        return d3.scale.linear()
            .domain([_cpuCount, 0])
            .range([0, _height]);
    }

    function transformForChart(item) {
        return {
            x: item.time,
            y: item.loadAverage[0]
        };
    }
};
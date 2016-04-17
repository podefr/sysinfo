"use strict";

let d3 = require("d3");

module.exports = function LineChart() {
    let _xScale;
    let _yScale;

    let _xAxis;

    let _path;
    let _svg;

    let _data = [];

    let _line = d3.svg.line()
        .x(item => _xScale(new Date(item.x)))
        .y(item => _yScale(item.y));

    this.setXScale = function setXScale(xScale) {
        _xScale = xScale;
    };

    this.setYScale = function setYScale(yScale) {
        _yScale = yScale;
    };

    this.render = function render(dom) {
        if (!dom) {
            throw new Error("LineChart requires a DOM element to be rendered");
        }

        if (!_yScale || !_xScale) {
            throw new Error("LineChart requires both an xScale and a yScale to be rendered");
        }

        _svg = d3.select(dom)
            .append("svg:svg")
            .attr("class", "ui-line-chart");

        _path = _svg.append("svg:path")
            .attr("class", "line");

        _addAxes();

        _render();
    };

    function _render() {
        _path
            .attr("d", _line(_data));
    }

    function _addAxes() {
        _xAxis = d3.svg.axis()
            .scale(_xScale)
            .orient("bottom");

        let yAxis = d3.svg.axis()
            .scale(_yScale)
            .orient("left");

        _svg.append("svg:g")
            .attr("class", "x axis")
            .call(_xAxis);

        _svg.append("svg:g")
            .attr("class", "y axis")
            .call(yAxis);
    }

    this.update = function update(snapshot) {
        _data = snapshot;

        _render();
    };

    this.updateXDomain = function updateXDomain(domain) {
        _xScale.domain(domain);
        _svg.select(".x.axis")
            .call(_xAxis);
    };
};
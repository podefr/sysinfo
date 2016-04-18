"use strict";

let d3 = require("d3");

module.exports = function LineChart() {
    let _xScale;
    let _yScale;

    let _xAxis;

    let _path;
    let _svg;

    let _width;
    let _height;
    let _padding = 40;

    let _data = [];

    let _rulerPath;

    let _legend;

    let _line = d3.svg.line()
        .x(item => _xScale(new Date(item.x)))
        .y(item => _yScale(item.y));

    let _verticalLine = d3.svg.line()
        .x(point => _xScale(new Date(point[0])))
        .y(point => _yScale(point[1]));

    this.setXScale = function setXScale(xScale) {
        _xScale = xScale;
    };

    this.setYScale = function setYScale(yScale) {
        _yScale = yScale;
    };

    this.setDimensions = function setDimensions(width, height) {
        _width = width;
        _height = height;
    };

    this.render = function render(dom) {
        if (!dom) {
            throw new Error("LineChart requires a DOM element to be rendered");
        }

        if (!_yScale || !_xScale) {
            throw new Error("LineChart requires both an xScale and a yScale to be rendered");
        }

        dom.addEventListener("mousemove", _onMouseMove);
        dom.addEventListener("mouseout", _onMouseOut);

        _svg = d3.select(dom)
            .append("svg:svg")
            .attr("width", _width)
            .attr("height", _height)
            .attr("class", "ui-line-chart");

        _legend = _svg.append("text")
            .attr("class", "legend");

        _path = _svg.append("svg:path")
            .attr("class", "line");

        _rulerPath = _svg.append("svg:path")
            .attr("class", "line hide ui-line-chart-ruler");

        _addAxes();
        _render();
    };

    function _render() {
        _path
            .attr("d", _line(_data));
    }

    function _onMouseMove(event) {
        const clientRects = getSVGRect(this);

        let relativeX = event.clientX - clientRects.left;
        let relativeY = event.clientY - clientRects.top;

        if (relativeX < _padding || relativeX > clientRects.width - _padding ||
            relativeY < _padding || relativeY > clientRects.width - _padding) {
            return;
        }
        _rulerPath.classed("hide", false);
        _legend.classed("hide", false);

        let invertedX = _xScale.invert(relativeX - _padding);
        let minY = _yScale.domain()[0];
        let maxY = _yScale.domain()[1];

        _rulerPath.attr("d", _verticalLine([[invertedX, maxY], [invertedX, minY]]));

        _legend
            .attr("x", relativeX - 20)
            .attr("y", relativeY - _padding - 20)
            .text(_yScale.invert(relativeY - _padding).toFixed(2));
    }

    function _onMouseOut() {
        _rulerPath.classed("hide", true);
        _legend.classed("hide", true);
    }

    function getSVGRect(dom) {
        return dom.querySelector("svg").getClientRects()[0];
    }

    function _addAxes() {
        _xAxis = d3.svg.axis()
            .scale(_xScale)
            .orient("bottom")
            .innerTickSize(-_height)
            .outerTickSize(0)
            .tickPadding(10);

        let yAxis = d3.svg.axis()
            .scale(_yScale)
            .orient("left")
            .innerTickSize(-_width)
            .outerTickSize(0)
            .tickPadding(10);

        _svg.append("svg:g")
            .attr("class", "x axis")
            .attr("transform", `translate(0, ${_height})`)
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
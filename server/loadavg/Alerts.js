"use strict";

const bacon = require("baconjs");
const moment = require("moment");

/**
 * Computes alerts on a N minutes window of load averages.
 * When there are enough load averages and the average is greater then A,
 * then an alert is triggered. When the average goes back below 1, the alert is lifted.
 *
 * @param {Stream} stream a bacon stream to get the load averages from
 * @param {Function} onAlert a callback to be called when an alert triggers
 * @constructor
 */
module.exports = function Alerts(stream, onAlert) {
    if (!stream) {
        throw new Error("Alerts requires a Bacon stream when instantiated");
    }

    if (typeof onAlert !== "function") {
        throw new Error("Alerts requires an onAlert callback when instantiated");
    }

    const ALERT_RAISED = "ALERT_RAISED";
    const ALERT_CLEARED = "ALERT_CLEARED";

    /**
     * The size of the time window
     * @type {Array} a tuple with a number and a unit, used by moment.js
     * @private
     */
    let _timeWindow = [1, "minute"];

    /**
     * The callback when an alert is triggered
     * @type {Function} callback
     * @private
     */
    let _onAlert = onAlert;

    /**
     * The unix timestamp when the stream starts so that we know when we can start triggering events
     * @type {Number}
     * @private
     */
    let _startDate;

    /**
     *
     * @type {number}
     * @private
     */
    let _threshold = 1;

    /**
     * Set a time window to calculate averages on. All events that were triggered outside of the window
     * will be discarded. Also, the first alert will only be triggered when the oldest event is older than the window,
     * so that we're sure that we're triggering it based on an average from an relevant time window.
     *
     * @example
     * setAverageTimeWindow(2, "minutes");
     * setAverageTimeWindow(30, "seconds");
     * setAverageTimeWindow(1, "hour");
     *
     * @param {Number} number the number of units
     * @param {String} unit the unit (minutes, hours, seconds...)
     */
    this.setAverageTimeWindow = function setAverageTimeWindow(number, unit) {
        if (typeof number !== "number" || typeof unit !== "string") {
            throw new Error(`setAverageTimeWindow needs to be called with a number and a string that represents \
                a time period. For instance: setAverageTimeWindow(2, "minutes")`);
        }

        _timeWindow = [number, unit];
    };

    /**
     * Set the threshold above and below which alerts are triggered
     * @param {Number} threshold the threshold above and below which alerts are triggered
     */
    this.setThreshold = function setThreshold(threshold) {
        if (typeof threshold !== "number") {
            throw new Error("setThreshold needs to be called with a number representing the load average that triggers alerts");
        }

        _threshold = threshold;
    };

    /**
     * Initializes the alerts computation. And alert is triggered when the threshold is reached, then the onAlert callback is called.
     */
    this.init = function init() {
        _startDate = moment().unix();

        let hasNotEnoughData = getNotEnoughDataProperty(stream);

        return stream
            .scan([], accumulateLoadAverage)
            .toEventStream()
            .map(calculateAverage)
            .skipWhile(hasNotEnoughData)
            .map(computeAlert)
            .skipDuplicates()
            .skipWhile(cantTriggerAlert)
            .doAction(_onAlert)
            .log();
    };

    function getNotEnoughDataProperty(stream) {
        return stream.map(data => {
            return _startDate > moment(data.time).subtract(_timeWindow[0], _timeWindow[1]).unix();
        }).toProperty();
    }

    function accumulateLoadAverage(accumulator, data) {
        accumulator.push(data);
        return accumulator.filter(item => !isOlderThanLimit(item.time));
    }

    function calculateAverage(accumulatedLoadAverage) {
        const sum = accumulatedLoadAverage.reduce((sum, item) => sum + item.loadAverage[0], 0);

        return sum / accumulatedLoadAverage.length;
    }

    function isOlderThanLimit(time) {
        return moment(time).unix() < moment().subtract(_timeWindow[0], _timeWindow[1]).unix();
    }

    function computeAlert(average) {
        return {
            load: average,
            time: moment().format(),
            type: average >= _threshold ? ALERT_RAISED : ALERT_CLEARED
        };
    }

    function cantTriggerAlert(alert) {
        return alert.type === ALERT_CLEARED;
    }
};
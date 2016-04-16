"use strict";

const moment = require("moment");

/**
 * Computes alerts on a N minutes window of load averages.
 * When there are enough load averages and the average is greater then A,
 * then an alert is triggered. When the average goes back below 1, the alert is lifted.
 *
 * @param {Stream} stream a bacon stream to get the load averages from
 * @constructor
 */
module.exports = function Alerts(stream) {
    if (!stream) {
        throw new Error("Alerts requires a Bacon stream when instantiated");
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
     *
     * @returns {this} the instance
     */
    this.setAverageTimeWindow = function setAverageTimeWindow(number, unit) {
        if (typeof number !== "number" || typeof unit !== "string") {
            throw new Error(`setAverageTimeWindow needs to be called with a number and a string that represents \
                a time period. For instance: setAverageTimeWindow(2, "minutes")`);
        }

        _timeWindow = [number, unit];

        return this;
    };

    /**
     * Set the threshold above and below which alerts are triggered
     *
     * @param {Number} threshold the threshold above and below which alerts are triggered
     * @returns {this} the instance
     */
    this.setThreshold = function setThreshold(threshold) {
        if (typeof threshold !== "number") {
            throw new Error("setThreshold needs to be called with a number representing the load average that triggers alerts");
        }

        _threshold = threshold;

        return this;
    };

    /**
     * Starts the alerts computation. An alert is triggered when the threshold is reached and is then passed down the stream
     * Alerts look like:
     *
     * { loadAverage: 2,
      *  time: 'iso-date-time',
      *  type: "ALERT_RAISED" || "ALERT_CLEARED"
      * }
     * @returns {Stream} an alerts stream.
     */
    this.startComputing = function startComputing() {
        _startDate = moment().unix();

        let hasNotEnoughData = getNotEnoughDataProperty(stream);

        return stream
            .scan([], accumulateLoadAverage)
            .toEventStream()
            .map(calculateAverage)
            .skipWhile(hasNotEnoughData)
            .map(computeAlert)
            .skipDuplicates(isSameAlert)
            .skipWhile(cantTriggerAlert);
    };

    /**
     * Get a Bacon property that tells if the data is old enough to cover the time window
     * @param stream
     * @returns {BaconProperty} a bacon property that evaluates to true if the data doesn't cover the time window
     */
    function getNotEnoughDataProperty(stream) {
        return stream.map(data => {
            return _startDate > moment(data.time).subtract(_timeWindow[0], _timeWindow[1]).unix();
        }).toProperty();
    }

    /**
     * Accumulate load average events and discards the ones that are older than the time window
     * @param {Array} accumulator the accumulator to accumulate load averages
     * @param {Object} data each load average event
     * @returns {Array} the accumulator
     */
    function accumulateLoadAverage(accumulator, data) {
        accumulator.push(data);
        return accumulator.filter(item => !isOlderThanLimit(item.time));
    }

    /**
     * Calculate the average of current load averages on the moving time window
     * @param {Array} accumulatedLoadAverage the accumulated load averages in the time window
     * @returns {Number} the average of the load averages
     */
    function calculateAverage(accumulatedLoadAverage) {
        const sum = accumulatedLoadAverage.reduce((sum, item) => sum + item.loadAverage[0], 0);

        return sum / accumulatedLoadAverage.length;
    }

    /**
     * Tells if a date is older than the time window
     * @param {IsoDate} time an iso date
     * @returns {boolean} true if the given time is older than the time window
     */
    function isOlderThanLimit(time) {
        return moment(time).unix() < moment().subtract(_timeWindow[0], _timeWindow[1]).unix();
    }

    /**
     * Creates an alert object based on the average
     * @param {Number} average the load average average
     * @returns {{load: *, time: *, type: string}}
     */
    function computeAlert(average) {
        return {
            load: average,
            time: moment().format(),
            type: average >= _threshold ? ALERT_RAISED : ALERT_CLEARED
        };
    }

    /**
     * Tells if the stream of alerts can be unlocked
     * @param {Object} alert an alert object
     * @returns {boolean} true if it's a cleared alert
     */
    function cantTriggerAlert(alert) {
        return alert.type === ALERT_CLEARED;
    }

    /**
     * Tells if two alerts are the same by comparing their type
     * @param {Object} oldAlert the old alert
     * @param {Object} newAlert the new alert
     * @returns {boolean} true if they have the same type
     */
    function isSameAlert(oldAlert, newAlert) {
        return oldAlert.type === newAlert.type;
    }
};
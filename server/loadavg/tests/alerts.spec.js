"use strict";

const bacon = require("baconjs");
const moment = require("moment");

const Alerts = require("../Alerts");

describe("Given a load average stream And an onAlert callback", function () {
    let stream;
    let sink;
    let onAlert;

    beforeEach(function () {
        stream = bacon.fromBinder(_sink => {
            sink = _sink;
        });

        onAlert = jasmine.createSpy();
    });

    describe("And Alerts is initialized with a 30 seconds window and a threshold of 2", function () {
        let alerts;

        beforeEach(function () {
            alerts = new Alerts(stream, onAlert);

            alerts.setAverageTimeWindow(30, "seconds");
            alerts.setThreshold(2);

            alerts.init();
        });

        describe("When the first load average events come in", function () {
            beforeEach(function () {
                [
                    {
                        loadAverage: [2.5, 3, 2],
                        time: moment().format()
                    },
                    {
                        loadAverage: [2.5, 3, 2],
                        time: moment().add(20, "seconds").format()
                    }
                ].map(event => sink(event));
            });

            it("Then no alert is triggered", function () {
                expect(onAlert).not.toHaveBeenCalled();
            });
        });

        describe("When there are enough events to cover the time window", function () {
            beforeEach(function () {
                [
                    {
                        loadAverage: [2.2, 3, 2],
                        time: moment().format()
                    },
                    {
                        loadAverage: [1.9, 3, 2],
                        time: moment().add(20, "seconds").format()
                    },
                    {
                        loadAverage: [1.7, 3, 2],
                        time: moment().add(40, "seconds").format()
                    }
                ].map(event => sink(event));
            });

            describe("And the average is below the threshold", function () {
                it("Then no alert is triggered (there's no alert to clear)", function () {
                    expect(onAlert).not.toHaveBeenCalled();
                });

                describe("When the average crosses the threshold", function () {
                    beforeEach(function () {
                        [
                            {
                                loadAverage: [2.2, 3, 2],
                                time: moment().format()
                            },
                            {
                                loadAverage: [2.3, 3, 2],
                                time: moment().add(60, "seconds").format()
                            }
                        ].map(event => sink(event));
                    });

                    it("Then an alert is triggered", function () {
                        expect(onAlert).toHaveBeenCalledWith({
                            load: 2,
                            time: moment().format(),
                            type: "ALERT_RAISED"
                        });
                    });
                });
            });

            describe("And the average is above the threshold", function () {
                beforeEach(function () {
                    [
                        {
                            loadAverage: [2.2, 3, 2],
                            time: moment().format()
                        },
                        {
                            loadAverage: [2.3, 3, 2],
                            time: moment().add(60, "seconds").format()
                        }
                    ].map(event => sink(event));
                });

                it("Then an alert is triggered", function () {
                    expect(onAlert).toHaveBeenCalledWith({
                        load: 2.06,
                        time: moment().format(),
                        type: "ALERT_RAISED"
                    });
                });

                describe("When the average goes below the threshold", function () {
                    beforeEach(function () {
                        [
                            {
                                loadAverage: [1.5, 3, 2],
                                time: moment().format()
                            },
                            {
                                loadAverage: [1, 3, 2],
                                time: moment().add(60, "seconds").format()
                            }
                        ].map(event => sink(event));
                    });

                    it("Then the alert is cleared", function () {
                        expect(onAlert).toHaveBeenCalledWith({
                            load: 1.8285714285714287,
                            time: moment().format(),
                            type: "ALERT_CLEARED"
                        });
                    });
                });
            });
        });
    });
});
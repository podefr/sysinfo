"use strict";

const Bacon = require("baconjs").Bacon;
const moment = require("moment");

const Alerts = require("../Alerts");

describe("Given a load average stream And an onAlert callback", () => {
    let stream;
    let sink;
    let onAlert;

    beforeEach(() => {
        stream = Bacon.fromBinder(_sink => sink = _sink);

        onAlert = jasmine.createSpy();
    });

    describe("And Alerts is initialized with a 30 seconds window and a threshold of 2", () => {
        beforeEach(() => {
            new Alerts(stream)
                .setAverageTimeWindow(30, "seconds")
                .setThreshold(2)
                .startComputing()
                .doAction(onAlert);
        });

        describe("When the first load average events come in", () => {
            beforeEach(() => {
                [
                    {
                        loadAverage: [2.5, 3, 2],
                        time: moment().format()
                    },
                    {
                        loadAverage: [2.5, 3, 2],
                        time: moment().add(20, "seconds").format()
                    }
                ].forEach(event => sink(event));
            });

            it("Then no alert is triggered", () => {
                expect(onAlert).not.toHaveBeenCalled();
            });
        });

        describe("When there are enough events to cover the time window", () => {
            beforeEach(() => {
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
                ].forEach(event => sink(event));
            });

            describe("And the average is below the threshold", () => {
                it("Then no alert is triggered (there's no alert to clear)", () => {
                    expect(onAlert).not.toHaveBeenCalled();
                });

                describe("When the average crosses the threshold", () => {
                    beforeEach(() => {
                        [
                            {
                                loadAverage: [2.2, 3, 2],
                                time: moment().format()
                            },
                            {
                                loadAverage: [2.3, 3, 2],
                                time: moment().add(60, "seconds").format()
                            }
                        ].forEach(event => sink(event));
                    });

                    it("Then an alert is triggered", () => {
                        expect(onAlert).toHaveBeenCalledWith({
                            load: 2,
                            time: moment().format(),
                            type: "ALERT_RAISED"
                        });
                    });
                });
            });

            describe("And the average is above the threshold", () => {
                beforeEach(() => {
                    [
                        {
                            loadAverage: [2.2, 3, 2],
                            time: moment().format()
                        },
                        {
                            loadAverage: [2.3, 3, 2],
                            time: moment().add(60, "seconds").format()
                        }
                    ].forEach(event => sink(event));
                });

                it("Then an alert is triggered", () => {
                    expect(onAlert).toHaveBeenCalledWith({
                        load: 2.06,
                        time: moment().format(),
                        type: "ALERT_RAISED"
                    });
                });

                describe("When more load average is coming triggering the same alert", () => {
                    beforeEach(() => {
                        onAlert.reset();
                        sink({
                            loadAverage: [3, 3, 2],
                            time: moment().format()
                        });
                    });

                    it("Then no excessive alert is triggered", () => {
                        expect(onAlert).not.toHaveBeenCalled();
                    });
                });

                describe("When the average goes below the threshold", () => {
                    beforeEach(() => {
                        [
                            {
                                loadAverage: [1.5, 3, 2],
                                time: moment().format()
                            },
                            {
                                loadAverage: [1, 3, 2],
                                time: moment().add(60, "seconds").format()
                            }
                        ].forEach(event => sink(event));
                    });

                    it("Then the alert is cleared", () => {
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
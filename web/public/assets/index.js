"use strict";

(function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw f.code = "MODULE_NOT_FOUND", f;
            }var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
                var n = t[o][1][e];return s(n ? n : e);
            }, l, l.exports, e, t, n, r);
        }return n[o].exports;
    }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
        s(r[o]);
    }return s;
})({ 1: [function (require, module, exports) {
        "use strict";

        var cerberusAPI = void 0;

        module.exports = {
            init: function init(_cerberusAPI) {
                cerberusAPI = _cerberusAPI;

                var socket = cerberusAPI.getSocket("loadavg");

                socket.on("current", function (loadavg) {
                    return console.log(loadavg);
                });

                initializeUIElements();
                initializeWebSocket();
            }
        };

        function initializeUIElements() {
            console.log("initializing UIElements");
        }

        function initializeWebSocket() {}
    }, {}], 2: [function (require, module, exports) {
        module.exports = {
            "name": "loadavg",
            "description": "Renders load average over a period of time",
            "entry": "index.js",
            "cerberus": {
                "UIElements": ["lineChart"],
                "routes": ["loadavg"],
                "exposes": []
            },
            "configuration": {
                "timeWindow": {
                    "number": 10,
                    "unit": "minutes"
                }
            }
        };
    }, {}], 3: [function (require, module, exports) {
        module.exports = {
            "title": "Cerberus - System monitoring",
            "modules": {
                "loadavg": "../modules/loadavg/"
            },
            "UIElements": ["lineChart"]
        };
    }, {}], 4: [function (require, module, exports) {
        "use strict";

        var configuration = void 0;

        function CerberusAPI(name, UIElements, sockets) {
            this.getUIElement = function getUIElement(UIElementName) {
                if (!UIElements[UIElementName]) {
                    throw new Error(name + " doesn't have access to UIElement " + UIElementName + ". Add it to the module's manifest.");
                }

                return UIElements[UIElementName];
            };

            this.getSocket = function getSocket(socketName) {
                if (!sockets[socketName]) {
                    throw new Error(name + " doesn't have access to socket " + socketName + ". Add it to the module's manifest.");
                }

                return sockets[socketName];
            };
        }

        module.exports = {
            init: function init(config) {
                configuration = config;
            },

            getCerberusForModule: function getCerberusForModule(name, manifest) {
                var moduleUIElements = manifest.UIElements.reduce(function (memo, moduleUIElement) {
                    if (!configuration.UIElements[moduleUIElement]) {
                        throw new Error(name + " is requesting UIElement " + moduleUIElement + " but it doesn't exist");
                    }

                    memo[moduleUIElement] = configuration.UIElements[moduleUIElement];
                    return memo;
                }, {});

                var moduleSockets = manifest.routes.reduce(function (memo, socketName) {
                    if (!configuration.AgentSockets[socketName]) {
                        throw new Error(name + " is requesting socket " + socketName + " but it doesn't exist");
                    }

                    memo[socketName] = configuration.AgentSockets[socketName];
                    return memo;
                }, {});

                return new CerberusAPI(name, moduleUIElements, moduleSockets);
            }
        };
    }, {}], 5: [function (require, module, exports) {
        "use strict";

        var cerberusAPI = require("./cerberusAPI.js");

        // UIElements and modules are preloaded to help the build but they shouldn't be,
        // See web/README.md and docs/FEATURESREQUESTS.md.
        var preloadedUIElements = {
            "lineChart": require("../ui/lineChart/index")
        };

        var preloadedModules = {
            "loadavg": {
                "manifest": require("../../modules/loadavg/manifest.json"),
                "module": require("../../modules/loadavg/index.js")
            }
        };

        var configuration = void 0;

        function getSockets(sockets) {
            return sockets.reduce(function (memo, socketName) {
                memo[socketName] = window.io(window.location.hostname + ":" + window.location.port + "/" + socketName);
                return memo;
            }, {});
        }

        module.exports = {
            init: function init(cerberusConf) {
                configuration = cerberusConf;

                cerberusAPI.init({
                    UIElements: preloadedUIElements,
                    AgentSockets: getSockets(Object.keys(configuration.modules))
                });
            },

            loadUIElements: function loadUIElements() {
                return configuration.UIElements.reduce(function (UIElements, UIElementName) {
                    console.log("Loading UIElement " + UIElementName);

                    UIElements[UIElementName] = preloadedUIElements[UIElementName];
                    return UIElements;
                }, {});
            },

            loadModules: function loadModules() {
                var _this = this;

                var modules = configuration.modules;

                Object.keys(modules).forEach(function (moduleName) {
                    console.log("Loading module " + moduleName);

                    var preloadedModule = preloadedModules[moduleName];
                    preloadedModule.module.init(_this.getCerberusAPI(moduleName), preloadedModule.manifest.configuration);
                });
            },

            getCerberusAPI: function loadCerberusAPI(moduleName) {
                var manifest = preloadedModules[moduleName].manifest;

                return cerberusAPI.getCerberusForModule(manifest.name, manifest.cerberus);
            }
        };
    }, { "../../modules/loadavg/index.js": 1, "../../modules/loadavg/manifest.json": 2, "../ui/lineChart/index": 7, "./cerberusAPI.js": 4 }], 6: [function (require, module, exports) {
        "use strict";

        var configuration = require("./cerberus.conf.json");
        var cerberus = require("./cerberus/index.js");

        cerberus.init(configuration);
        cerberus.loadUIElements();
        cerberus.loadModules();
    }, { "./cerberus.conf.json": 3, "./cerberus/index.js": 5 }], 7: [function (require, module, exports) {
        "use strict";

        //const d3 = require("d3");

        module.exports = function LineChart() {
            var minDomain = 0;
            var maxDomain = void 0;

            var minRange = 0;
            var maxRange = void 0;

            var _scale = void 0;

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

                return d3.scale.linear().domain([minDomain, maxDomain]).range([minRange, maxRange]);
            }
        };
    }, {}] }, {}, [6]);
//# sourceMappingURL=index.js.map

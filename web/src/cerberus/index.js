"use strict";

const cerberusAPI = require("./cerberusAPI.js");

// UIElements and modules are preloaded to help the build but they shouldn't be,
// See web/README.md and docs/FEATURESREQUESTS.md.
const preloadedUIElements = {
  "lineChart": require("../ui/lineChart/index"),
  "list": require("../ui/list/index")
};

const preloadedModules = {
  "loadavg": {
      "manifest": require("../../modules/loadavg/manifest.json"),
      "module": require("../../modules/loadavg/index.js")
  }
};

let configuration;

function getSockets(sockets) {
    return sockets.reduce((memo, socketName) => {
        memo[socketName] = window.io(`${window.location.hostname}:${window.location.port}/${socketName}`);
        return memo;
    }, {});
}

module.exports = {
    init: function init(cerberusConf) {
        configuration = cerberusConf;

        cerberusAPI.init({
            UIElements: preloadedUIElements,
            AgentSockets: getSockets(Object.keys(configuration.modules)),
            restUrl: `http://${window.location.hostname}:${window.location.port}/rest`
        });
    },

    loadUIElements: function loadUIElements() {
        return configuration.UIElements.reduce((UIElements, UIElementName) => {
            console.log(`Loading UIElement ${UIElementName}`);

            UIElements[UIElementName] = preloadedUIElements[UIElementName];
            return UIElements;
        }, {});
    },

    loadModules: function loadModules() {
        let modules = configuration.modules;

        Object.keys(modules).forEach((moduleName) => {
            console.log(`Loading module ${moduleName}`);

            let preloadedModule = preloadedModules[moduleName];
            preloadedModule.module.init(this.getCerberusAPI(moduleName), preloadedModule.manifest.configuration);
        });
    },

    getCerberusAPI: function loadCerberusAPI(moduleName) {
        let manifest = preloadedModules[moduleName].manifest;

        return cerberusAPI.getCerberusForModule(manifest.name, manifest.cerberus);
    }
};
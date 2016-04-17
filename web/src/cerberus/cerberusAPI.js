"use strict";

const request = require("request");
const q = require("q");

let configuration;

function CerberusAPI(name, UIElements, sockets) {
    this.getUIElement = function getUIElement(UIElementName) {
        if (!UIElements[UIElementName]) {
            throw new Error(`${name} doesn't have access to UIElement ${UIElementName}. Add it to the module's manifest.`);
        }

        return UIElements[UIElementName];
    };

    this.getSocket = function getSocket(socketName) {
        if (!sockets[socketName]) {
            throw new Error(`${name} doesn't have access to socket ${socketName}. Add it to the module's manifest.`);
        }

        return sockets[socketName];
    };

    this.getJSON = function getJSON(apiName, url, query) {
        if (!sockets[apiName]) {
            throw new Error(`${name} doesn't have access to route ${apiName}. Add it to the module's manifest.`);
        }

        const defer = q.defer();

        request({
            method: 'GET',
            url: `${configuration.restUrl}/${apiName}/${url}`,
            qs: query || {}
        }, (error, response, body) => {
            if (error) {
                defer.reject(error);
                throw new Error(error);
            }
            if (response.statusCode === 200) {
                defer.resolve(JSON.parse(body));
            } else {
                defer.reject(response);
            }
        });

        return defer.promise;
    };

    this.getDom = function getDom() {
        return document.querySelector(`[data-module="${name}"]`);
    };
}

module.exports = {
    init: function init(config) {
        configuration = config;
    },

    getCerberusForModule: function getCerberusForModule(name, manifest) {
        let moduleUIElements = manifest.UIElements.reduce((memo, moduleUIElement) => {
            if (!configuration.UIElements[moduleUIElement]) {
                throw new Error(`${name} is requesting UIElement ${moduleUIElement} but it doesn't exist`);
            }

            memo[moduleUIElement] = configuration.UIElements[moduleUIElement];
            return memo;
        }, {});

        let moduleSockets = manifest.routes.reduce((memo, socketName) => {
            if (!configuration.AgentSockets[socketName]) {
                throw new Error(`${name} is requesting socket ${socketName} but it doesn't exist`);
            }

            memo[socketName] = configuration.AgentSockets[socketName];
            return memo;
        }, {});

        return new CerberusAPI(name, moduleUIElements, moduleSockets);
    }
};

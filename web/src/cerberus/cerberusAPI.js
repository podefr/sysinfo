"use strict";

const request = require("request");
const q = require("q");

let configuration;

function CerberusAPI(name, UIElements, sockets) {
    /**
     * Get UIElement by name. It has to be referenced in the module's manifest to be used.
     * @param {String} UIElementName name of the UIElement to get
     * @returns {UIElement} UIElement constructor
     */
    this.getUIElement = function getUIElement(UIElementName) {
        if (!UIElements[UIElementName]) {
            throw new Error(`${name} doesn't have access to UIElement ${UIElementName}. Add it to the module's manifest.`);
        }

        return UIElements[UIElementName];
    };

    /**
     * Get a channel on the web socket by name. The channel has to be referenced in the module's manifest to be accessible.
     * @param {String} socketName get socket by name
     * @returns {webSocket} the web socket, ready to be used
     */
    this.getSocket = function getSocket(socketName) {
        if (!sockets[socketName]) {
            throw new Error(`${name} doesn't have access to socket ${socketName}. Add it to the module's manifest.`);
        }

        return sockets[socketName];
    };

    /**
     * Get JSON data from the server using it's rest/ API
     * @param {String} apiName name of the api to call (usually name of module)
     * @param {url} url the url to call (usually snaked-case method name)
     * @param {Object} query the query string
     * @returns {Function|promise} promise that resolves with the data
     */
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

    /**
     * Get dom returns the DOM element where the module is rendered. It's not a sandbox but can be considered as such.
     * @returns {DOMElement} the dom element where the module is rendered
     */
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

"use strict";

const configuration = require("./cerberus.conf.json");
const cerberus = require("./cerberus/index.js");

cerberus.init(configuration);
cerberus.loadUIElements();
cerberus.loadModules();
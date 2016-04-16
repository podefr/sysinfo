# Client modules

Client modules are external modules that can be "dropped" into the application (also called Cerberus).

## How to add a new client module:

1. Since modules live in the same codebase for simplicity, add a directory with the module name inside `web/modules/`.
2. Add a `manifest.json` file which describes the application to Cerberus

### Manifest.json

`manifest.json` tells Cerberus what the module needs from the framework. Cerberus can then make educated decisions based on various criteria and entitlements.
The manifest also describes the modules public API that other modules can used (inter-module communication).
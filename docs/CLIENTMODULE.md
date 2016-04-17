# Client modules

Client modules are external modules that can be "dropped" into the application (also called Cerberus).

## How to add a new client module:

1. Since modules live in the same codebase for simplicity, add a directory with the module name inside `web/modules/`.
2. Add a `manifest.json` file which describes the application to Cerberus

### Manifest.json

`manifest.json` tells Cerberus what the module needs from the framework. Cerberus can then make educated decisions based on various criteria and entitlements.
The manifest also describes the modules public API that other modules can used (inter-module communication).

Example manifest:

```json
{
  "name": "loadavg",
  "description": "Renders load average over a period of time",
  
  // The entry point to the module. It needs to have an init() method
  "entry": "index.js",
  
  // How to tell cerberus what the module needs to work and what it exposes
  "cerberus": {
    "UIElements": ["lineChart"],
    "routes": ["loadavg"],
    "exposes": []
  },
  
  // The module's configuration itself. This is a blob that's just passed to the init() method.
  "configuration": {
    "timeWindow": {
      "number": 10,
      "unit": "minutes"
    }
  }
}
```

### Telling Cerberus to load the module

In theory, we would just have to add the module in Cerberus' configuration. To do that, add the module to `cerberus.conf.json`.

Unfortunately, since Cerberus doesn't dynamically load the module at this point, we also need to preload it. Go to `src/cerberus/index.js` 
and add your module to `preloadedModules`, following the pattern used for other modules.


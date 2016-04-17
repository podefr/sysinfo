# Cerberus

Cerberus is the name of the web client/framework that's used to render data coming from the server.

## Cerberus framework

The framework is useful for various things:

 - [implemented] Accessing the data from the server
 - [implemented] Giving access to the data to each individual modules
 - [implemented] Loading the UI elements and giving access to them to the modules
 - [not implemented] Mounting/Unmounting modules based on various criteria (performance, memory, configuration, maintenance...)
 - [not implemented] Managing permissions for modules to access or not specific data based on entitlements...

## Cerberus API

CerberusAPI is an object that's passed to every initialized module and that allows it to:
- Communicate with the outside world with `getJSON` and `gtSocket`
- get UIElements using `getUIElement`
- get access to the application's DOM with `getDom`
- Call another module's method using `APICall`

More info in `cerberusAPI.js`'s JSdoc

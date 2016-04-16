# Web client

## How to run the application

## Architecture decision

1. Logging in the app is using `console` directly but a better logging tool should be used so that log level can be configured
 when the application is running in development mode or production mode.
2. UIElements are explicitly required into the application to help the current build package them into the application, but they should
 only be loaded based on the configuration.
3. Modules are also bundled into the application at build time to help the build, but they should by dynamically packaged into the application
 based on the configuration.

## Developing

### How to build the application

`gulp package`

### How to run the tests

`gulp test`

### How to watch changes

`gulp watch`


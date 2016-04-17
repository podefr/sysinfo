# Web client

## How to run the application

## Architecture decision

1. Logging in the app is using `console` directly but a better logging tool should be used so that log level can be configured
 when the application is running in development mode or production mode.
2. UIElements are explicitly required into the application to help the current build package them into the application, but they should
 only be loaded based on the configuration.
3. Modules are also bundled into the application at build time to help the build, but they should by dynamically packaged into the application
 based on the configuration.
4. When receiving a load average update, we retrieve a new snapshot for the desired time window instead of shifting and pushing the data into the current snapshot.
 This design makes it simpler to always display the right data, but it's of course less efficient since we have an extra rest call for each update.
  If it becomes a performance issue, we can add the logic on the client to do incremental updates, making sure that we don't remove any previous data that's still relevant.

## Developing

### How to build the application

`gulp package`: will build the sass and the bundled JS into `public/assets` where the web server serves the files from
`gulp sass` or `gulp compile`: respectively only builds the css or the JS

It's also possible 

### How to run the tests 

`gulp test`: no tests, doesn't currently work as reported in the backlog

### How to watch changes

`gulp watch`: needs to be optimized, it doesn't watch all the proper directories and can be improved, prefer building sass or compile


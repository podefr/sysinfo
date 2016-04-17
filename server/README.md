# Server

## How to run server

From `server/` run `npm run start`. You should see:
 
```
Starting server
Web server running on http://localhost:8001
loadavg started
connectivity started
sysinfo started
loadavg is connected
connectivity is connected
sysinfo is connected
{ loadAverage: [ 1.4, 1.43, 1.41 ],
  time: '2016-04-17T17:08:44.893Z' }
Accepted new connection from web client
{ loadAverage: [ 1.4, 1.43, 1.41 ],
  time: '2016-04-17T17:08:51.687Z' }
````

The web server runs on port 8001 by default, it can be edited in the configuration file.

## Configuration

Edit `server.conf.json`:

### Agent configuration

`AGENT.URL` and `AGENT.PORT` update the agent's port and url if need be. By default, it should be the same as the agent's configuration

### Server configuration

`SERVER.MODULES`: Object containing the configuration for each module that the server loads. Add/remove modules from here. 

### Architecture decisions

1. Just like for the agent, the modules are checked-in inside the server folder but they should really be separate modules that would
 evolve independently. We should also be able to update, load/unload them separately.
2. For simplicity, the data collected from the agent and computed is stored in the server's memory and not in a dedicated data layer.
3. The WebSocket between the server and the web client is multiplexed.
4. Each server module is configuring the routes that the client can hit in a configuration file. The server's main module will map the routes accordingly
 to the appropriate method in the module.

### How to add a new module to the server

1. Create a subdirectory in server/ since modules are maintained in the same codebase for simplicity
2. Put a `config/{moduleName}.conf.json` configuration there.
3. Add an `index.js` with a `init` function that will initialize the module. It will receive a WebSocket to get data from the Agent,
 a WebSocket to push data to the web client (both are namespaced so they will only get and push data for their own module), and some extra
 configuration that's defined at a server level.
4. You can also add `ROUTES` to each server module. For instance: `"ROUTES": { "get-data": "getData" }` will call the `module.getData(req, res)`
 function when the client makes a request on `/rest/{moduleName}/get-data`. 
 
### How to get the module to expose routes

In the module's `config/{moduleName}.conf.json`, add a `"ROUTES"` object. This object needs to tell the routes `url` and the name of the method
 that will be called when hitting the route. For example with the `loadavg` module:
  
```json
"ROUTES" : {
 "get-load-averages": "getLoadAverages"
}
```

This means that when calling `rest/loadavg/get-load-averages`, the `getLoadAverages` method will be called with `request, response`.
 
## Running the tests

Make sure `jasmine-node` is installed (`npm install -g jasmine-node`) and run `jasmine-node ./`, or `npm test`
# Server

## How to run server

From `server/` run `npm run start`. You should see:
 
```
Starting server
Starting loadavg
got load average [ '1.54', '1.60', '1.58' ]
got load average [ '1.54', '1.60', '1.58' ]
````

The server runs on port 8000 by default, it can be edited in the configuration file.

## Configuration

Edit `server.conf.json`:

### Agent configuration

`AGENT.URL` and `AGENT.PORT` update the agent's port and url if need be. By default, it should be the same as the agent's configuration

### Server configuration

`SERVER.MODULES`: Object containing the configuration for each module that the server loads. Add/remove modules from here. 

### Architecture decisions

1. Just like for the agent, the modules are checked-in inside the server folder but they should really be separate modules that would
 evolve independently. We should also be able to update, load/unload them separately.
2. For simplicity, the data collected from the agent is stored in the server's memory and not in a dedicated data layer.

 
## Running the tests

Make sure `jasmine-node` is installed (`npm install -g jasmine-node`) and run `jasmine-node ./`, or `npm test`
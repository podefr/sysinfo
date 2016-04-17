# Agent

## How to run agent

Make sure it's installed by doing `npm install` in this directory first.

Then run `npm run start`. You should see:

```
Loading module loadavg
Start polling load average
Loading module connectivity
New client connected on loadavg
New client connected on connectivity
load average { loadAverage: [ 1.47, 1.47, 1.62 ],
  time: Sun Apr 17 2016 04:20:20 GMT-0400 (EDT) }
load average { loadAverage: [ 1.43, 1.46, 1.62 ],
  time: Sun Apr 17 2016 04:20:25 GMT-0400 (EDT) }
load average { loadAverage: [ 1.44, 1.46, 1.62 ],
```

## Configuration

Edit `agent.conf.json`:

`PORT`: the port that the server is using to expose the data. Set to 8000 by default, bump if your host is already using port 8000

## Architecture decisions

Here I'm explaining some of the choices I've made when writing agent and how I could have done it differently:

1. I'm using console.log for logging because it's simple but we could use proper logging libraries if we wanted to save and rotate the logs somewhere.
2. The agent's modules are folders in agent's codebase but they should really be installed dependencies (npm?) so that they can evolve and be hotswapped without restarting the agent.
3. It would be nice if the agent would also provide some simple tools such as a logger, a scheduler, tools to run linux commands... since it's what most modules are going to be doing.
4. I'm using setInterval to poll at a regular time, but if the server is overloaded the thread may slow down and the interval may tick at a slower rate, or maybe not at all anymore,
 so we may want to set a priority to the agent's process or use another technique for polling the uptime.
5. The socket.io connection is multiplexed so that only one WebSocket is used for all metrics
6. For the sake of simplicity, the agent polls data as soon as it starts, but we could wait for it to have connections, or pause the polling when
 there's no client connected
 
### Adding a module to agent:

Connectivity is a very simple module that shows how to bootstrap a new one. Basically:

1. Add the module to `agent.conf.json`
2. Add a directory with the module name under `agent`
3. Add an `index.js` with an `init` method. The `init` method will get its instance of the websocket to push data, and the configuration from `agent.conf.json`.

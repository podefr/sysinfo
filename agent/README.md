# Agent

## How to run agent

From `agent`, run `npm run start`. You should see

```
> agent@0.0.1-dev exec /Users/olivierscherrer/Documents/workspace/datadog/agent
> node index.js

Starting agent
Starting server on port 8000
Loading module loadavg
Start polling load average
load average [ '1.33', '1.56', '1.57' ]
New client connected on loadavg
load average [ '1.55', '1.60', '1.58' ]
load average [ '1.66', '1.62', '1.59' ]
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

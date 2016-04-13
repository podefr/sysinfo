# Agent

## How to run agent

From `agent`, run `npm run exec`. You should see

```
> agent@0.0.1-dev exec /Users/olivierscherrer/Documents/workspace/datadog/agent
> node index.js

Starting agent
Loading module loadavg
```

## Architecture decisions

Here I'm explaining some of the choices I've made when writing agent and how I could have done it differently:

1. I'm using console.log for logging because it's simple but we could use proper logging libraries if we wanted to save and rotate the logs somewhere.
2. The agent's modules are folders in agent's codebase but they should really be installed dependencies (npm?) so that they can evolve and be hotswapped without restarting the agent.

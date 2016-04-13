# Load Monitoring Web Application

## Requirements:

Create a simple web application that monitors load average on your machine:

- Collect the machine load (using “uptime” for example)
- Display in the application the key statistics as well as a history of load over the past 10 minutes in 10s intervals. We’d suggest a graphical representation using D3.js, but feel free to use another tool or representation if you prefer. Make it easy for the end-user to picture the situation!
- Make sure a user can keep the web page open and monitor the load on their machine.
- Whenever the load for the past 2 minutes exceeds 1 on average, add a message saying that “High load generated an alert - load = {value}, triggered at {time}”
- Whenever the load average drops again below 1 on average for the past 2 minutes, Add another message explaining when the alert recovered.
- Make sure all messages showing when alerting thresholds are crossed remain visible on the page for historical reasons.
- Write a test for the alerting logic
- Explain how you’d improve on this application design

## In this repository:

- `agent/`: the agent's code. The agent runs on the target system and collects the data
- `docs/`: all the docs explaining the architecture, the features, howtos...
- `scripts`: useful scripts to run the application
- `server/` the server's code. The server connects to the agent to receive the collected data and exposes various endpoints to the webapp
- `web/` the webapp's code. The webapp renders the collected data in a user friendly way.

## Getting started

### Prerequisits

- node.js 5.8.0+
- recent Chrome (tested on Canary 51)

### Running the application

The simplest way is to execute the start script:

`./scripts/start.sh`

If you've just downloaded the repository, start by running the install script:

`./scripts/install.sh`

### License

MIT
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
- `server/` the server's code. The server connects to the agent to receive the collected data and exposes various endpoints to the webapp
- `web/` the webapp's code. The webapp renders the collected data in a user friendly way.

## Getting started

### Prerequisites

- node.js 5.8.0+
- recent Chrome (tested on Canary 51)

### Running the application

The application is composed of two modules. There's a lot to read in the respective READMEs, but here's a summary:

1. The `agent`, which runs on the target system to collect the data
2. The `server`, which serves the webapp assets and crunches the data for the presentation layer

They are developed to be installed on separate machines, but to make things easier, they can be installed and executed on the same machine using `npm` scripts:

1. `npm install` in this directory will recursively install `agent/` and `server/` by pulling the dependencies
2. `npm run start` in this directory will recursively start both the agent and the server on port `localhost:8000`. The url and port can be configured in each application's folder.

When both have started, you will be able to load your browser and navigate to `http://localhost:8000`

### Tech stack

The application is running on `node.js` and `ES6` is used where possible.

It's using `socket.io` for communication between `agent`, `server` and `webclient`.
The `server` is using `express` to route `REST` calls.
The `webclient` is using `D3` for charting and the `Olives` MVC framework that I've also authored.
It's using `moment` for data manipulation and `Bacon.js` for streams.


### License

MIT
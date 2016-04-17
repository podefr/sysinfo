# Load Monitoring Web Application

## Requirements:

Create a simple web application that monitors load average on your machine:

- [DONE] Collect the machine load (using “uptime” for example)
- [DONE] Display in the application the key statistics as well as a history of load over the past 10 minutes in 10s intervals. We’d suggest a graphical representation using D3.js, but feel free to use another tool or representation if you prefer. Make it easy for the end-user to picture the situation!
- [DONE] Make sure a user can keep the web page open and monitor the load on their machine.
- [DONE] Whenever the load for the past 2 minutes exceeds 1 on average, add a message saying that “High load generated an alert - load = {value}, triggered at {time}”
- [DONE] Whenever the load average drops again below 1 on average for the past 2 minutes, Add another message explaining when the alert recovered.
- [DONE] Make sure all messages showing when alerting thresholds are crossed remain visible on the page for historical reasons.
- [DONE] Write a test for the alerting logic
- [DONE see docs/FEATUREREQUESTS.md] Explain how you’d improve on this application design

## In this repository:

- `agent/`: the agent's code. The agent runs on the target system and collects the data
- `docs/`: all the docs explaining the architecture, the features, howtos, backlog...
- `server/` the server's code. The server connects to the agent to receive the collected data and exposes various endpoints to the webapp
- `web/` the webapp's code. The webapp renders the collected data in a user friendly way.

## Getting started

### Prerequisites

- node.js 5.8.0+ (should work on node.js 4.x.x+)
- recent Chrome (tested on Canary 51). Will not work on other browsers due to ES6 since Babel or similar isn't used. This is documented in the list of issues.

### Running the application

The application is composed of two modules. There's a lot to read in the respective READMEs, but here's a summary:

1. The `agent`, which runs on the target system to collect the data
2. The `server`, which serves the webapp assets and crunches the data for the presentation layer

They are developed to be installed on separate machines, but to make things easier, they can be installed and executed on the same machine using `npm` scripts:

1. `npm install` in this directory will recursively install `agent/`, `server/` and `web/` by pulling all the dependencies
2. `npm run start-agent` in this directory will run the agent on port `8000` by default. This can be configured in the agent's configuration.
3. `npm run start-server` in this directory will run the web server on port `8001`. This can be configured in the server's configuration.
4. `npm run start-webapp` in this directory will simply open your default browser on `http://localhost:8001`. Note that only Chrome Canary 51 was tested.
 You can also manually navigate to `http://localhost:8001` in your favorite browser.

## Modules

#### loadavg

Load average is composed of two elements:
 - The graph which displays a sliding window of load averages over a period of 10 minutes, refreshed every 10 seconds. The Y axis is the number of CPUs since it's a decent
 measure to compare the current load average against.
 - A list of triggered alerts. An alerts is triggered when the load exceeds 1 over a period of 2 minutes. Then it triggers another alert when the load goes below 1.

#### connectivity

A very simple module that shows the basics of how to add an application. It has an `agent` counterpart that just sends pings,
a server counterpart that monitors the multiplexed socket, and a `web` module that displays a splash screen when the connectivity
between the agent and the server is lost. To try it, simply kill the `agent` process and restart it.

#### General system information

Displays general information about the monitored system such as when the system started, the free and total memory and OS and CPU information.

#### Notifications

Displays notifications from other modules via the framework's inter-application communication protocol.

## Tech stack

The application is running on `node.js` and `ES6` is used where possible.

It's using `socket.io` for communication between `agent`, `server` and `webclient`.
The `server` is using `express` to route `REST` calls.
The `webclient` is using `D3` for charting and the `Olives and Emily` MVC framework that I've also authored.
It's using `moment` for date manipulation and `Bacon.js` for streams.

## Dev process

I started with breaking down the work into small tasks and put a backlog together. You can find it in `docs/BACKLOG.md`.
Whenever a considered the task down, I put a [X] mark next to it. I've also added a list of tech debt/defects at the bottom of the backlog.

### License

MIT
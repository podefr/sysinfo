# Backlog

## [Agent]
 - [X] AGENT-01 Bootstrap agent, add package.json with install and run scripts
 - [X] AGENT-02 Add module to get the load average from "uptime"
 - [X] AGENT-03 Expose stats to outside world
 - [ ] AGENT-04 Run agent with mock data for testing/demo

## [Server]
 - [X] SERVER-01 Bootstrap server, add package.json with install and run scripts
 - [X] SERVER-02 Add module to compute alerts for load average
 - [X] SERVER-03 Add route to get load average 
 - [X] SERVER-04 Add route to get alerts
 - [X] SERVER-05 Serve webapp and assets

## [Webapp]
 - [ ] WEBAPP-01 Bootstrap webapp, add package.json, install scripts
 - [ ] WEBAPP-02 Install dev environment including css preprocessor, test frameworks and dependencies
 - [ ] WEBAPP-03 Add index.html, initialize framework
 - [ ] WEBAPP-04 Install and render load average component
 - [ ] WEBAPP-04 Install and render alerts component
 - [ ] WEBAPP-05 Render notifications when a new alerts come in
 
## [Framework]
 - [ ] FRAMEWORK-01 Create framework skeleton to expose data and load components
 - [ ] FRAMEWORK-02 Stream data from server to components on demand
 - [ ] FRAMEWORK-03 Load component from manifest file
 - [ ] FRAMEWORK-04 Add inter-component communication

## [UI]
 - [ ] UI-01 Create reusable line chart with default CSS
 - [ ] UI-02 Create reusable notification with default CSS
 - [ ] UI-02 Create reusable list with default CSS

## [LOADAVG]
 - [ ] LOADAVG-01 Bootstrap load average module to render a line chart with the historical load average
 - [ ] LOADAVG-02 Open API for external components to highlight a zone of the chart on demand
 
## [ALERTS]
 - [ ] ALERTS-01 Render list of alerts when load average is above 1 or gets back to normal
 - [ ] ALERTS-02 Display notification when a new alert comes in
 - [ ] ALERTS-03 Request load average to highlight a zone when hovering over a specific alert
 
## [RESPONSIVE]
 - [ ] RESPONSIVE-01 Add tabs to toggle between alerts and load average chart when window size reduces
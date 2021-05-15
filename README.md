# Botex-Admin

A web user interface for [botex](https://github.com/scraperwall/botex) implemented in VueJS.  

![Template](https://scw.im/img/botex-admin-dashboard.png)


## Description

 botex-admin is a web UI for the botex bot analysis tool from [ScraperWall](https://scraperwall.com/).  It offers a real-time view of how botex analyzes website traffic. 


## Dependencies

botex-admin requires node (>= 8.10.x) and yarn.

## Installation

Once you've cloned this repository run yarn once to install all required libraries:

	$ yarn


## Configuration

Add an .env file at the root of this checked-out repository and let botox-admin know where to access the botex API. The IP address should be that of the computer botex runs on.

	VUE_APP_TITLE="ScraperWall Bad Bot Check"
	VUE_APP_API_URL="http://127.0.0.1:4343/"
	VUE_APP_WS_URL="ws://127.0.0.1:4343/ws"

## Starting botex-admin

Then it's only a matter of starting the UI with yarn:

	$ yarn run serve

You should now be able to access it at the URL yarn prints to the console.


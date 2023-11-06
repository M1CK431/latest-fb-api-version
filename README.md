# Latest Facebook API version
If, like me, you are tired of regularly bumping your Facebook API version when initializing the SDK, despite (almost) each time your are not concerned by any deprecation or breaking change... :face_exhaling:
<br /><br />

## Features
This project aims to help you dealing with (extremely too fast) deprecation policy of Facebook API version in the following manners:
- 🦸 setup a REST API which provides the latest Facebook API version (HTTP mode)
- 💻 get the latest Facebook API version in your terminal (CLI mode)
- 🔔 alert you on version change using a webhook or running the command of your choice
- 🗒️ keep a log each time the version changed
<br /><br />

## How it works
On start, the latest FB API version is retrieved from https://developers.facebook.com/docs/graph-api/changelog?locale=en_US and stored in memory. A timer is started to refresh the cache regularly ([see `UPDATE_INTERVAL` environnement variable below](https://github.com/M1CK431/latest-fb-api-version#configuration)).

When a HTTP GET request is made to the API, the cached FB API version is returned (with the date of the latest check). The appropriate `Expires` HTTP header is set so you can exactly know when the next check will occurs.

In CLI mode ([see Usage section below](https://github.com/M1CK431/latest-fb-api-version#as-cli-command)), the latest Facebook API version is returned in you terminal. No HTTP server is start and the program exit immediately.
<br /><br />

## Prerequisites
This project requires at least Node.js v20.6.0 to handle your `.env` file and v18.0.0 for the webhook feature (based on [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)) and v18.11.0 for `-watch` mode ([see Development section below](https://github.com/M1CK431/latest-fb-api-version#development)).
<br /><br />

## Installation
Simply clone this repository and install production dependencies using `yarn --production` (or `npm i --production` but this project use `yarn` internally).
<br /><br />

## Configuration
There is a few environnement variables available:
- `HOST` and `PORT` is to configure the HTTP server
- `UPDATE_INTERVAL` is the check frequency for latest FB API version (unit: seconds)
- `ON_CHANGE` hook triggered when FB API version change is detected. Can be:
	- a webhook URL (POST request with state as JSON payload)
	- an executable absolute path (exec with args like: $1=version $2=last check date)

There is a `.env.example` file in the repository with all existing variables and there default values. Just copy it as `.env` and adapt it your needs :wink:
<br /><br />

## Usage
### As HTTP REST API (default)

Just use `yarn start` :rocket:

Example:

    $ yarn start
    Listening on http://0.0.0.0:3000

then

    $ curl http://localhost:3000/
    {"version":"v18.0","updatedAt":"2023-11-06T23:14:21.469Z"}

    $ curl -I http://localhost:3000/
    HTTP/1.1 200 OK
    Content-Type: application/json
    Expires: Tue, 07 Nov 2023 23:14:21 GMT
    Date: Mon, 06 Nov 2023 23:15:05 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

### As CLI command
To use the CLI mode, use the `--cli` flag like this: `yarn start --cli` or `node index.js --cli`.

Example:

    $ node ./index.js --cli
    v18.0

## Development
To start this project in developpement mode, install all dependencies using `yarn`.
Once installed, you can use `yarn dev` to start the server in [`watch` mode](https://nodejs.org/docs/latest-v18.x/api/cli.html#--watch).

:warning: Don't forget to setup your editor to use the configured linter/prettier!
Alternatively, use `yarn lint` *before openning any pull request*.
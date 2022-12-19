# Small Logging Server using Node and Docker

## Define Data Model for Logging

You can add multiple schemas for the logging data by adding a custom file `model.<yourmodel>.json`to the `models` directory.

```json
{
    "eventName": "Name",
    "timestamp": 123,
    "eventId": 1
}
```

When deploying the application using `docker-compose` set the environment variable `USE_MODEL` (see below).

## Use Access Token to Log Data

See: [express-access-token](https://www.npmjs.com/package/express-access-token)

## Deploy Application using Docker

```bash
git pull https://github.com/visualengineers/smallloggingserver-node.git
ENV="production" ACCESS_TOKEN="your_token" USE_MODEL="your_model" docker-compose up -d --build
```

## Test Logging via Terminal

```bash
curl -X POST -H "Authorization: Bearer 123" -H "Content-Type: application/json" -d '{"eventName": "This is another test log message", "timestamp": "223123"}' http://localhost:3000/log 
```

## Available Routes on the Server

- POST `/log` - post a log to the server (protected by access token)
- GET `/display` - display the current logging data
- GET `/schema` - display the currently used schema for JSON logs
- GET `/export` - export data to a CSV file

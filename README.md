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

## Development

Build and run with docker-compose and shut down node container, run app locally from development environenmt using `npm start`.

## Use Access Token to Log Data

See: [express-access-token](https://www.npmjs.com/package/express-access-token)

## Deploy Application using Docker

```bash
git clone https://github.com/visualengineers/smallloggingserver-node.git
ENV="production" ACCESS_TOKEN="your_token" docker-compose up -d --build
```

## Test Logging via Terminal

```bash
curl -X POST -H "Authorization: Bearer 123" -H "Content-Type: application/json" -d '{"eventName": "This is another test log message", "timestamp": "223123"}' http://localhost:3000/log/config 
```

## Available Routes on the Server

- POST `/log/:schema` - post a log to the server for a logging schema (protected by access token)
- GET `/display/:schema` - display the current logging data for a logging schema
- GET `/schema/:schema` - display the selected schema for JSON logs
- GET `/export/:schema` - export data to a CSV file for a logging schema

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

## Available Routes on the Server

- POST `/log/:schema` - post a log to the server for a logging schema (protected by access token)
- GET `/display/:schema` - display the current logging data for a logging schema
- GET `/schema/:schema` - display the selected schema for JSON logs
- GET `/export/:schema` - export data to a CSV file for a logging schema

## Use Access Token to Log Data

See: [express-access-token](https://www.npmjs.com/package/express-access-token)

### Test Logging via Terminal

```bash
curl -X POST -H "Authorization: Bearer <your_token>" -H "Content-Type: application/json" -d '{"eventName": "This is another test log message", "timestamp": "223123"}' http://localhost:3000/log/config 
```

### Angular Example

```ts
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { isDevMode } from '@angular/core';
import { take } from 'rxjs';

export class Logging {
  constructor(public http: HttpClient) {}

  sendData(data: any) { // data must be flat JSON object without arrays
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer <your_token>'
    });
    const url = isDevMode()
      ? 'http://<local_logging_server>:<port>/log/<your_schema>'
      : 'http://<production_logging_server>:<port>/log/<your_schema>';
    this.http
      .post(url, data, { headers: headers })
      .pipe(take(1))
      .subscribe({
        complete: () => { console.log('Logging Success'); },
        error: (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
              console.log('Client-side error occured.');
          } else {
              console.log('Server-side error occured.');
              console.log(err.error);
          }
        }
      });
  }
}
```

## Development

Build and run with docker-compose and shut down node container, run app locally from development environenmt using `npm start`.

## Deploy Application using Docker

```bash
git clone https://github.com/visualengineers/smallloggingserver-node.git
ENV="production" ACCESS_TOKEN="your_token" docker compose up -d --build
```

For Powershell use:

```powershell
$env:ACCESS_TOKEN='123'
$env:ENV='production'
docker-compose up -d --build
```

## Enter running MongoDB container to access and delete data

Run Mongo shell in your container:

```bash
docker exec -it <container_id> mongosh
```

Query your data in [mongo shell](https://www.mongodb.com/docs/v3.4/reference/mongo-shell/):

```mongodb
show dbs
use eventLogs
show tables
db.yourschema.find()
db['<yourschema>'].find()
db.yourschema.deleteMany({})
exit
```

To reset and delete all schemas do

```mongodb
use eventLogs
db.dropDatabase();
```
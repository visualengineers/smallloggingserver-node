# Small Logging Server using Node and Docker

```bash
docker-compose up -d --build
```

```bash
url -X POST -H "Content-Type: application/json" -d '{"eventName": "This is another test log message", "timestamp": "223123"}' http://localhost:3000/log 
```

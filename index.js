const express = require('express');
const cors = require('cors');
const ipfilter = require('express-ipfilter').IpFilter
const mongoose = require('mongoose');
const app = express();
const port = 3000;
const path = __dirname + '/views/';

mongoose.set('strictQuery', true);

// Connect to MongoDB
mongoose.connect('mongodb://mongodb:27017/eventLogs', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

// Define a schema for event logs
const eventLogSchema = new mongoose.Schema({
  eventName: String,
  timestamp: Number
})

// Create a model for event logs
const EventLog = mongoose.model('EventLog', eventLogSchema)

// Configure CORS options
const corsOptions = {
  origin: ['http://itv21.informatik.htw-dresden.de:3000/', 'http://localhost:3000'],
  allowedHeaders: ['Content-Type']
}

// Use cors middleware
app.use(cors(corsOptions));

app.use(express.json()); // Use express.json() middleware to parse JSON bodies

app.get("/sharks",function(req,res){
    res.sendFile(path + "sharks.html");
});
  

app.post('/log', (req, res) => {
  const { eventName, timestamp } = req.body
  // Create a new event log
  const eventLog = new EventLog({
    eventName,
    timestamp
  })

  // Save the event log to the database
  eventLog.save()
    .then(() => {
      res.send('Event data logged')
    })
    .catch(err => {
      res.status(500).send(err)
    })
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
});

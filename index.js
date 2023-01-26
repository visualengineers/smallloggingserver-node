const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressAccessToken = require('express-access-token');
const cors = require('cors');
const ipfilter = require('express-ipfilter').IpFilter
const mongoose = require('mongoose');
const app = express();
const port = 3000;
const path = __dirname + '/views/';
const { Parser } = require('json2csv');
const Models = require('./models/model.js');

const blacklist = ['78.54.214.87'];

const dbUrl = process.env.ENV == 'production' 
    ? 'mongodb://mongodb:27017/eventLogs'
    : 'mongodb://localhost:27017/eventLogs';

mongoose.set('strictQuery', true);

// Connect to MongoDB
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Configure CORS options
const corsOptions = {
    origin: ['http://itv21.informatik.htw-dresden.de:3000/', 'http://localhost:3000'],
    allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
};

const accessTokens = process.env.ENV == 'production' 
    ? [ process.env.ACCESS_TOKEN ]
    : [ "123" ];
const firewall = (req, res, next) => {
    const authorized = accessTokens.includes(req.accessToken);
    if(!authorized) return res.status(403).send('Forbidden');
    next();
};

// Use cors middleware
app.use(cors(corsOptions));

app.use(bodyParser.json({ limit: '200kb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.json()); // Use express.json() middleware to parse JSON bodies

app.use(ipfilter(blacklist));

app.set('view engine', 'ejs');

app.post('/log/:schema', expressAccessToken,
    firewall,
    (req, res) => {
    if (!req.is('application/json')) {
        // Send error here
        res.sendStatus(400);
    } else {
        // Create a new event log
        const eventLog = new Models[req.params["schema"]](req.body);

        // Save the event log to the database
        eventLog.save()
            .then(() => {
                res.send('Event data logged')
            })
            .catch(err => {
                res.status(500).send(err)
            });
    }
});

app.get('/display/:schema',
    async (req, res) => {
    try {
        const allLogs = await Models[req.params["schema"]].find().lean();
        const results = { 
            'results': (allLogs) ? allLogs : null
          };
        res.render('logs', results);
    } catch (error) {
        console.log('error:', error.message);
        res.status(500).send(error.message);
    }
});

app.get('/export/:schema', async (req, res) => {
    try {
        const fields = Object.keys(Models[req.params["schema"]].schema.obj);
        const opts = { fields };
        const json2csv = new Parser(opts);
        const allLogs = await Models[req.params["schema"]].find({});

        let data = json2csv.parse(allLogs);
        res.attachment('logging_data.csv');
        res.status(200).send(data);
    } catch (error) {
        console.log('error:', error.message);
        res.status(500).send(error.message);
    }
});

app.get('/schema/:model', async (req, res) => {
    try {
        const fields = Object.keys(Models[req.params["model"]].schema.obj);
        const results = { 
            'results': fields
          };
        res.render('schema', results);
    } catch (error) {
        console.log('error:', error.message);
        res.status(500).send(error.message);
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});

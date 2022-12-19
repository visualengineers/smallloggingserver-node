const fs = require('fs');
const mongoose = require('mongoose');
const generateSchema = require('generate-schema');

let modelRaw = fs.readFileSync('./models/model.json');
let modelData = JSON.parse(modelRaw);

// Define a schema for event logs
const eventLogSchema = generateSchema.mongoose(modelData);

// Create a model for event logs
const model = mongoose.model('EventLogs', eventLogSchema)

module.exports = model;
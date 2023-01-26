const fs = require('fs');
const mongoose = require('mongoose');
const generateSchema = require('generate-schema');
const models = [];

//let modelRaw = fs.readFileSync('./models/model.json');
//let modelData = JSON.parse(modelRaw);

fs.readdirSync('./models/').forEach(file => {
    var split = file.split('.');
    if(split[0]==="model" && split[2]==="json") {
        let modelRaw = fs.readFileSync('./models/' + file);
        let modelData = JSON.parse(modelRaw);
        
        // Define a schema for event logs
        const eventLogSchema = generateSchema.mongoose(modelData);

        // Create a model for event logs
        const model = mongoose.model(split[1], eventLogSchema)

        models[split[1]] = model;
        console.log(split[1]);
    }    
  });

module.exports = models;
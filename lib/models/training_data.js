const mongoose = require('mongoose');
const dbConnection = require('../../db');

mongoose.Promise = Promise;

const trainingDataSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = dbConnection.model('TrainingData', trainingDataSchema);
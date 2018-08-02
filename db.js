const mongoose = require('mongoose');

// Replace mongoose's promise with the default one because it is deprecated
mongoose.Promise = Promise;

let connection = mongoose.createConnection('mongodb://127.0.0.1:27017/training-data')
.on('connected', () => {
    console.log('Connected to Database ...');
})
.on('error', (err) => {
    console.log('A Database error occurred ...', err);
})
.on('disconnected', () => {
    console.log('Disconnected from Database');
})
.on('SIGINT', () => {
    console.log('Database disconnected through app termination');
});

module.exports = connection;
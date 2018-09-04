// Require modules
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const NaiveBayes = require('./lib/naive_bayes');
const TrainingData = require('./lib/models/training_data');

// Initailize classifier
let naiveBayes = new NaiveBayes();

// Begin training from file
console.log('----------------------------');
console.log('Classifier File training started ...', new Date());
naiveBayes.trainFromFile('./training_data.txt');
console.log('Classifier File training finished ...', new Date());
console.log('----------------------------');
// Begin training from database
console.log('Classifier Database training started ...', new Date());
TrainingData.find({})
.then((data) => {
    data.forEach(datum => naiveBayes.trainInline(datum.text, datum.category));
})
.catch(err => console.log(err));
console.log('Classifier Database training finished ...', new Date());
console.log('----------------------------');

// Start the Node server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server now listening on port ${PORT} ...`);
});

// Specify the 'assets' root
app.use('/assets', express.static('assets'));

// Default url
app.get('/', (req, res, next) => {
    res.sendFile(__dirname + '/chat.html');
});

// Socket stuff ...
io.on('connection', (socket) => {
    showSocketMsg(socket, 'A User has joined the conversation');

    socket.on('send_message', (data) => {
        data.spam = naiveBayes.classify(data.message, 'unknown') === 'bad';
        io.emit('new_message', data);
    });

    socket.on('disconnect', (e) => {
        showSocketMsg(socket, 'A User has left the conversation');
    });

    socket.on('mark_spam', (data) => {
        saveData(data.message, 'bad') // save in database
        .then(datum => naiveBayes.trainInline(data.message, 'bad')) // train classifier
        .catch(err => console.log(err));
    });

    socket.on('mark_not_spam', (data) => {
        saveData(data.message, 'good') // save in database
        .then(datum => naiveBayes.trainInline(data.message, 'good')) // train classifier
        .catch(err => console.log(err));
    });
});

// Utility function
function showSocketMsg(socket, message) {
    io.emit('socket_message', { message });
}

// This saves a text and category to the database
function saveData(text, category) {
    console.log('Adding data to database ...', text, category);
    return TrainingData.create({ text, category });
}
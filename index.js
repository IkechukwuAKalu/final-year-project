const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const NaiveBayes = require('node-naive-bayes');

let naiveBayes = new NaiveBayes();
console.log('...starting classifier training...');
naiveBayes.trainFromFile('./training_data.txt');
console.log('...training finished...');

server.listen(process.env.PORT || 3000, () => {
    console.log('server now listening...');
});

app.use('/assets', express.static('assets'));

app.get('/', (req, res, next) => {
    res.sendFile(__dirname + '/chat.html');
});

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
        naiveBayes.trainInline(data.message, 'bad', true, './training_data.txt');
    });
});

function showSocketMsg(socket, message) {
    io.emit('socket_message', { message });
}
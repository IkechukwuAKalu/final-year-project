const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

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
        io.emit('new_message', data);
    });
    socket.on('disconnect', (e) => {
        showSocketMsg(socket, 'A User has left the conversation');
    });
});

function showSocketMsg(socket, message) {
    io.emit('socket_message', { message });
}
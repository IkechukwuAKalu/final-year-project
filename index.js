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
    console.log('New socket connected');
    socket.on('send_message', (data) => {
        console.log(data);
        io.emit('new_message', data);
    });
    socket.on('disconnect', (e) => {
        console.log('Socket disconnected', e);
    });
});
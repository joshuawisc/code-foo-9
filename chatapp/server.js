const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const mongoose = require('mongoose');
const port = 3000;

server.listen(port, () => {
    console.log(`Running on port ${port}`);
});

app.use(express.static(__dirname + '/public/'));

app.get('/', (req,res) => {
    res.sendFile('index.js');
});



io.on('connection', function (socket) {
    console.log('connected');
    socket.emit('check', {message: 'cheking connection'});
    socket.on('user connected', function(data) {
        if (data.user == 1) {
            console.log('user 1');
        } else {
            console.log('user 2');
        }
    });
});

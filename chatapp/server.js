const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const mongoose = require('mongoose');
const mongoDB = 'mongodb://dbuser1:bluemarker1@ds163254.mlab.com:63254/chatappdb';
const port = 3000;

mongoose.connect(mongoDB, {useNewUrlParser: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'));

server.listen(port, () => {
    console.log(`Running on port ${port}`);
});

app.use(express.static(__dirname + '/public/'));

app.get('/', (req,res) => {
    res.sendFile('index.js');
});

let Message = require('./messageModel.js');
Message.findOne().sort({ date: -1}).limit(1).exec((err, data) => {
    if (!data) {
        console.log("No Record!");
        let message = new Message({
            from: "user1",
            to: "user2",
            message: ""
        });
        message.save(error => {
            if (error)
            console.log(error)
        });
    }
});
io.on('connection', function (socket) {
    //console.log('connected');
    socket.emit('check', {message: 'cheking connection'});
    socket.on('user connected', function(data) {
        if (data.user == 1) {
            console.log('user 1');
            socket.emit('username', {username: "user1"});
        } else {
            console.log('user 2');
        }
    });
});

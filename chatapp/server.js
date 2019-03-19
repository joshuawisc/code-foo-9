const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const mongoose = require('mongoose');
const mongoDB = 'mongodb://dbuser1:bluemarker1@ds163254.mlab.com:63254/chatappdb';
const port = 3000;

let username1, username2;

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
Message.findOne().sort({ time: 1}).limit(1).exec((err, data) => {
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
        username1 = "user1";
        username2 = "user2";
    } else {
        username1 = data.from;
        username2 = data.to;
    }
});
io.on('connection', function (socket) {
    //console.log('connected');
    socket.emit('check', {message: 'cheking connection'});

    // Client first connected
    socket.on('user connected', function(data) {
        if (data.user == 1) {
            console.log('user 1');
            socket.emit('ret username', {username: username1});
        } else {
            console.log('user 2');
            socket.emit('ret username', {username: username2});
        }
    });

    // Client sets username and hits start chatting
    socket.on('set username', data => {
        console.log('save username received');
        console.log(data);
        if (data.user == 1)
            username1 = data.username;
        else
            username2 = data.username;
        saveUsernames();
        Message.find().sort({ time: -1}).limit(20).exec((err, data) => {
            if (err)
                console.log(err); // TODO:

            // Reverse array so messages are in order of time sent
            data.reverse();
            console.log(data);
            // Send past few messages to new client
            data.forEach(message => {
                socket.emit('ret message', message);
            });

        });

    });

    // Client sends a message
    socket.on('send message', data => {
        console.log('message received');
        console.log(data);
        let message = new Message({
            from: data.from,
            to: data.to,
            text: data.text
        });
        message.save(error => {
            if (error)
            console.log(error)
        });
        io.emit('ret message', data);
    });
});

// Save username1 and username2 to first entry in DB
function saveUsernames() {
    console.log(`saving ${username1} and ${username2}`)
    Message.findOne().sort({ date: -1}).limit(1).exec((err, data) => {
        if (!data)
            console.log("Error finding first record");
        data.from = username1;
        data.to = username2;
        data.save(error => {
            if (error)
            console.log(error)
        });
    });
}

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

let Message = require('./models/messageModel.js');
let User = require('./models/userModel.js');

io.on('connection', function (socket) {

    // Client sets username and hits start chatting
    socket.on('sign in', data => {
        console.log(`${data.username} signed in`);
        User.findOne({username: data.username}).exec((err, docs) => {
            if (err)
                console.log(err);
            if (!docs) {
                let user = new User({
                    username: data.username,
                });
                user.save(error => {
                    if (error)
                    console.log(error)
                });
                docs = user;
            }
            socket.emit('ret user', {user: docs});
        });


    });

    //Called by client to get most recent messages after signing in
    socket.on('get messages', () => {
        Message.find().sort({ time: -1}).limit(20).exec((err, data) => {
            if (err)
                console.log(err); // TODO:

            // Reverse array so messages are in order of time sent
            data.reverse();

            // Send past few messages to new client
            data.forEach(message => {
                socket.emit('ret message', message);
            });

        });
    });

    // Client sends a message
    socket.on('send message', data => {
        let message = new Message({
            from: data.from,
            text: data.text,
        });
        message.save(error => {
            if (error)
            console.log(error)
        });
        data.time = message.time;
        io.emit('ret message', data);
    });

    // Get next 10 messages before data.time
    socket.on('get old messages', data => {
        Message.find({time: { $lt: data.time } }).sort({ time: -1 }).limit(10).exec((err,docs) => {
            if (err)
                console.log(err); // TODO:
            socket.emit('ret old messages', docs);
        });
    });

    socket.on('typing', data => {
        socket.broadcast.emit('user typing', data);
    });
});

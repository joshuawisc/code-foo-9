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
// Message.findOne().sort({ time: 1}).limit(1).exec((err, data) => {
//     if (!data) {
//         console.log("No Record!");
//         let message = new Message({
//             from: "user1",
//             to: "user2",
//             message: ""
//         });
//         message.save(error => {
//             if (error)
//             console.log(error)
//         });
//         username1 = "user1";
//         username2 = "user2";
//     } else {
//         //console.log(data);
//         username1 = data.from;
//         username2 = data.to;
//     }
// });
io.on('connection', function (socket) {
    // Client first connected
    // socket.on('user connected', function(data) {
    //     if (data.user == 1) {
    //         console.log('user 1');
    //         socket.emit('ret username', {username: username1, otherUsername: username2});
    //     } else {
    //         console.log('user 2');
    //         socket.emit('ret username', {username: username2, otherUsername: username1});
    //     }
    // });

    // Client sets username and hits start chatting
    socket.on('sign in', data => {
        console.log(`${data.username} signed in`);
        User.findOne({username: data.username}).exec((err, docs) => {
            console.log(docs);
            if (err)
                console.log(err);
            if (!docs) {
                console.log(`${data.username} not found`);
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

    socket.on('get messages', () => {
        Message.find().sort({ time: -1}).limit(20).exec((err, data) => {
            if (err)
                console.log(err); // TODO:

            // Reverse array so messages are in order of time sent
            data.reverse();
            //console.log(data);
            // Send past few messages to new client
            data.forEach(message => {
                socket.emit('ret message', message);
            });

        });
    });

    // Client sends a message
    socket.on('send message', data => {
        console.log('message received');
        //console.log(data);

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
            console.log(docs);
            // Reverse array so messages are in order of time sent
            // data.reverse();
            // //console.log(data);
            // // Send past few messages to new client
            // data.forEach(message => {
            //     socket.emit('ret message', message);
            // });
            socket.emit('ret old messages', docs);
        });
    });
});

// Save username1 and username2 to first entry in DB
// function saveUsernames() {
//     console.log(`saving ${username1} and ${username2}`)
//     Message.findOne().sort({ time: 1}).limit(1).exec((err, data) => {
//         if (!data)
//             console.log("Error finding first record");
//         //console.log(data);
//         data.from = username1;
//         data.to = username2;
//         data.save(error => {
//             if (error)
//             console.log(error)
//         });
//     });
// }

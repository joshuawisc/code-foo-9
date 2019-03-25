# Chat Application

## Installation
Install the dependencies using
```
npm install
```

then run the application using
```
npm run
```
and go to http://localhost:3000

Open http://localhost:3000 in another tab and type something to see the typing indicator

## Dependencies

This app was made using express, mongoose, and Socket.IO

## Features
+ Supports any number of users
+ Stores username of each user
+ Messages and users are stored in an mLab MongoDB database
+ Time of each message can be displayed by clicking on the message
+ Typing indicator pops up with the username of user thats typing
+ Older messages are loaded using pagination

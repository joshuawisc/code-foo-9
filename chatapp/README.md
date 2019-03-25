# Chat Application

I built this application using node.js for the backend, jQuery for the frontend and MongoDB to store the data. The database consists of 2 collection: *messages* and *users*. *users* just contains the username of each user and *messages* contains the content of the message, the sender (which is a user), and the time it was sent. More than 2 users can user the application but they all chat together. The app displays the username for the messages and positions the messages sent by the current user on the right side. The database is hosted on mLab and the authentication details are hardcoded into the server.js file.

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

Chatty App
=====================

A chat app where multiple users can send text messages and image files to one another in real time using React and Web Sockets.
Users are given a random color upon joining the chat. The server will broadcast the number of users in the chat, as well as notify users when there is a new member, and when a member has left.

### Usage

Install the dependencies and start the server.

For client:
```
npm install
npm start
open http://localhost:3000
```

For socket server:
```
Open a different terminal window
Go into chatty_server directory
npm install
node server.js
```

### Dependencies

* babel-core
* babel-loader
* babel-preset-es2015
* babel-preset-react
* css-loader
* node-sass
* sass-loader
* sockjs-client
* style-loader
* webpack
* webpack-dev-server
* react
* react-dom
* express
* ws
* uuid

## Screenshots

!["Chatty App in action!"](https://raw.github.com/brandonday7/react-simple-boilerplate/master/docs/chatty.png)


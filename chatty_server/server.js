const express = require('express');
const SocketServer = require('ws').Server;
const uuidv1 = require('uuid/v1');

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });
let usersOnline = 0;
let usersArr = [];
let stillHereArr = [];



wss.broadcast = function broadcast(message) {
  wss.clients.forEach(client => {
    message['key'] = uuidv1();
    client.send(JSON.stringify(message));
  })
}

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  console.log('Client connected');
  usersOnline++;
  let message = {type: 'updateOnlineUsers', usersOnline}; //update the online users value on connect
  ws.send(JSON.stringify({key: uuidv1(), type: 'connect'}));
  wss.broadcast(message);

  let newUser = {socketId: uuidv1(), socket: ws, username: 'Someone'}; //generate a new client in our usersArray, used for disconnect notifications
  ws.send(JSON.stringify({key: uuidv1(), type: 'setIdentifier', socketId: newUser.socketId}))
  usersArr.push(newUser);




  ws.on('message', function incoming(message) {
    const incomingMsg = JSON.parse(message);

    //normal messages and notifications
    if (incomingMsg['type'] === 'postMessage') {
      incomingMsg['type'] = 'incomingMessage';
      wss.broadcast(incomingMsg);

    } else if (incomingMsg['type'] === 'postNotification') {
      incomingMsg['type'] = 'incomingNotification';
      wss.broadcast(incomingMsg);


    //other protocols, name changes and seeing who left the chat
    } else if (incomingMsg['type'] === 'nameChange') {
      changeName(incomingMsg);
    } else if (incomingMsg['type'] === 'stillHere') {
      stillHereArr.push(incomingMsg.socketId);
      if (stillHereArr.length === usersArr.length -1) { //if this is the last repsonse to arrive (asynchronous), then find who left
        let leftMessage = identifyWhoLeft(); //if it's the last still here message, find who left
        stillHereArr.splice(0, stillHereArr.length); //empty the still here array for next time someone leaves
        wss.broadcast(leftMessage);
      }
    } else {
      throw new Error(`Unknown event type ${data.type}`);
    }
  })

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    usersOnline--;
    wss.broadcast({type: 'stillHere'});



    let message = {type: 'updateOnlineUsers', usersOnline};
    wss.broadcast(message);
    console.log('Client disconnected')
  });
});


function changeName(msg, currentSocket) {
  usersArr.forEach(user => {
    if (user.socketId === msg.socketId) {
      user.username = msg.username;
    }
  })
}


function identifyWhoLeft() { //this function compares the known user array to the array of responses from people still online
  let message = ''; //the 'difference between' these arrays is the user that left
  usersArr.forEach((user, index) => {
    let stillHereFlag = 0;
    stillHereArr.forEach(userStillHere => {
      if (user.socketId === userStillHere) {
        stillHereFlag = 1;
      }
    })
    if (!stillHereFlag) {
      message = {type: 'incomingNotification', content: `${user.username} has left the chat`};
      usersArr.splice(index, 1);
    }
  })
  return message;
}


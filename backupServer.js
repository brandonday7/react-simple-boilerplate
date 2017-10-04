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
  let message = {type: 'updateOnlineUsers', usersOnline};
  wss.broadcast(message);




  ws.on('message', function incoming(message) {
    const incomingMsg = JSON.parse(message);
    if (incomingMsg['type'] === 'postMessage') {
      incomingMsg['type'] = 'incomingMessage';
  } else if (incomingMsg['type'] === 'postNotification') {
    incomingMsg['type'] = 'incomingNotification';
  } else {
    throw new Error(`Unknown event type ${data.type}`);
  }
    wss.broadcast(incomingMsg);
  })

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    usersOnline--;
    let message = {type: 'updateOnlineUsers', usersOnline};
    wss.broadcast(message);
    console.log('Client disconnected')
  });
});




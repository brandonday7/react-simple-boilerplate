import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';
import Nav from './Nav.jsx';


function findImage(msg) { //finds the image part of every message sent, if any
  let splitMsg = msg.split(' ');
  let links = '';
  let regex = /\.png$|\.jpg$|\.gif$/;
  splitMsg.forEach((word, index) => {
    if (regex.test(word)) {
      links = word;
      splitMsg.splice(index, 1);
    }
  })

  let textMsg = splitMsg.join(' ');
  return {textMsg, links};
}

function randomColor() { //generates a random HEX colour for all users
  const list = '0123456789ABCDEF';
  let possibleChar = list.split('');
  let myColor = [];
  for (let i = 0; i < 6; i++) {
    let randomChar = Math.floor(Math.random()*15);
    myColor.push(possibleChar[randomChar]);
  }
  let color = `#${myColor.join('')}`
  return color;
}

class App extends Component {
  constructor(props) {
    let color = randomColor();
    super(props);
    this.state = {
      currentUser: {name: 'Someone', color: color},
      messages: [],
      numberOfUsers: 0,
      color: color
    };
    this.socket = new WebSocket('ws://localhost:3001');

  }

  userInput = (msg) => {
    let obj = findImage(msg); //these lines split the message into its text and image contents
    let message = obj.textMsg;
    let image = obj.links;

    const newMessage = {type: 'postMessage', username: this.state.currentUser.name, content: message, img: image, color: this.state.color};

    this.socket.send(JSON.stringify(newMessage));
  }

  changeUser = (name) => {
    const socketChangeName = {type: 'nameChange', socketId: this.state.socketId, username: name};
    this.socket.send(JSON.stringify(socketChangeName));

    const newNotification = {type: 'postNotification', content: `${this.state.currentUser.name} has changed their name to ${name}`};
    this.setState({currentUser: {name: name}});
    this.socket.send(JSON.stringify(newNotification)); //this send is to broadcast name change to all users
  }



  componentDidMount() {
    this.socket.onopen = () => {
      console.log('Connected to the server')
    }

    this.socket.onmessage = (event) => {
      const incomingMsg = JSON.parse(event.data);


      //the following are special case handlers for notifying the server of who joined, who left, name changes, and how many users
      if (incomingMsg.type === 'connect') {
        let message = {type: 'postNotification', content: `${this.state.currentUser.name} has joined the chat!`};
        this.socket.send(JSON.stringify(message));
      } else if (incomingMsg.type === 'stillHere') {
        incomingMsg.socketId = this.state.socketId;
        this.socket.send(JSON.stringify(incomingMsg));
      } else if (incomingMsg.type === 'updateOnlineUsers') {
        this.setState({numberOfUsers: incomingMsg.usersOnline})
      } else if (incomingMsg.type === 'setIdentifier') {
        this.setState({socketId: incomingMsg.socketId})
      }

      //if it is just a plain old message/notification, simply re-render the messages as normal
      const messages = this.state.messages.concat(incomingMsg);
      this.setState({messages});
    }

  }


  render() {
    return (
      <div>
        <Nav users={this.state.numberOfUsers}/>
        <MessageList messages={this.state.messages}/>

        <ChatBar currentUser={this.state.currentUser.name} userInput={this.userInput} changeUser={this.changeUser} />
      </div>
    );
  }
}
export default App;

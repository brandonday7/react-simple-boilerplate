import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';
import Nav from './Nav.jsx';


function randomColor() {
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
''

  userInput = (msg) => {
    const newMessage = {type: 'postMessage', username: this.state.currentUser.name, content: msg, color: this.state.color};
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


      //the following are special case handlers for notifying the server of name changes, who left, how many users, and who joined
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
    console.log("Rendering <App/>");
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

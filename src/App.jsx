import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {name: 'Bob'},
      messages: []
    };
    this.socket = new WebSocket('ws://localhost:3001');

  }


  userInput = (msg) => {
    const newMessage = {type: 'postMessage', username: this.state.currentUser.name, content: msg};
    this.socket.send(JSON.stringify(newMessage));
  }

  changeUser = (name) => {
    const newNotification = {type: 'postNotification', content: `${this.state.currentUser.name} has changed their name to ${name}`};
    this.setState({currentUser: {name: name}});
    this.socket.send(JSON.stringify(newNotification));
  }



  componentDidMount() {
    this.socket.onopen = () => {
      console.log('Connected to the server')
    }

    this.socket.onmessage = (event) => {
      const incomingMsg = JSON.parse(event.data);
      const messages = this.state.messages.concat(incomingMsg);
      this.setState({messages});
    }

}

  render() {
    console.log("Rendering <App/>");
    return (
      <div>
        <MessageList messages={this.state.messages}/>

        <ChatBar currentUser={this.state.currentUser.name} userInput={this.userInput} changeUser={this.changeUser} />
      </div>
    );
  }
}
export default App;

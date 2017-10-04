import React, {Component} from 'react';

class ChatBar extends Component {
    constructor(props) {
    super(props);
    this.state = {name: this.props.currentUser};
  }

  handleKeyPressText(event) {
      if (event.charCode === 13) {
        this.props.userInput(event.target.value);
        event.target.value = null;
      }
  }

  handleKeyPressUser(event) {
    this.setState({name: event.target.value})
    if (event.charCode === 13) {
      this.props.changeUser(event.target.value);
    }
  }
  render() {
    console.log("Rendering <ChatBar/>");
    return (
      <footer className="chatbar">
        <input className="chatbar-username" placeholder="Your Name (Optional)"
          defaultValue={this.props.currentUser} onKeyPress={this.handleKeyPressUser.bind(this)}/>
        <input className="chatbar-message" placeholder="Type a message and hit ENTER"
          onKeyPress={this.handleKeyPressText.bind(this)}/>
      </footer>

    );
  }
}
export default ChatBar;


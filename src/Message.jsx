
import React, {Component} from 'react';

class Message extends Component {
  render() {
    console.log("Rendering <Message/>");

    return (
      <div className="message">
        <span className="message-username">{this.props.user}</span>
        <span className="message-content">{this.props.text}</span>
      </div>


    );
  }
}
export default Message;


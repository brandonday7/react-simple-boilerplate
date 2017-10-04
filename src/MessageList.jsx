import React, {Component} from 'react';
import Message from './Message.jsx';


class MessageList extends Component {
  render() {
    console.log("Rendering <MessageList/>");

    return (
      <main className="messages">
        {renderMessageComponent(this.props.messages)}
      </main>
    );
  }
}
export default MessageList;


function renderMessageComponent(msgArray) {
  let messageComps = msgArray.map((msg) => {
    if (msg.type === 'incomingMessage') {
      return <Message key={msg.key} user={msg.username} text={msg.content} />
    } else {
      return <div key={msg.key} className="message system">{msg.content}</div>
    }
  })
  return messageComps;
}
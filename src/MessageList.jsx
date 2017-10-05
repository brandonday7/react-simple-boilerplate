import React, {Component} from 'react';
import Message from './Message.jsx';


class MessageList extends Component {
  render() {

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
      return <Message color={msg.color} key={msg.key} user={msg.username} text={msg.content} img={msg.img}/>
    } else {
      return <div key={msg.key} className="message system">{msg.content}</div>
    }
  })
  return messageComps;
}
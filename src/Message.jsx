
import React, {Component} from 'react';


class Message extends Component {
  render() {

    return (
      <div className="message">
        <span style={{color: this.props.color}} className="message-username">{this.props.user}</span>
        <span className="message-content">{this.props.text}<br />
          <img className='image-message' src={this.props.img} />
        </span>

      </div>


    );
  }
}
export default Message;


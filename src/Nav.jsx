import React, {Component} from 'react';


class Message extends Component {
  render() {

    return (
      <nav className="navbar">
        <a href="/" className="navbar-brand">Chatty</a>
        <p className='number-of-users'>Online users: {this.props.users}</p>
      </nav>
    );
  }
}
export default Message;

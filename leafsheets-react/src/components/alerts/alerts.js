// Imports

import React, { Component, Fragment } from 'react';
import { withAlert } from 'react-alert';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Alerts

export class Alerts extends Component {
  static propTypes = {
    error: PropTypes.object.isRequired,
    message: PropTypes.object.isRequired,
  };

  componentDidUpdate(prevProps) {
    const {error, message, alert} = this.props;
    // Errors
    if (error !== prevProps.error && error.msg) {
      // if (typeof error.msg === 'undefined') return;
      if (error.msg.name) alert.error(`Name: ${error.msg.name.join()}`);
      if (error.msg.email) alert.error(error.msg.email.join());
      if (error.msg.username) alert.error(error.msg.username.join());
      if (error.msg.non_field_errors) alert.error(error.msg.non_field_errors.join());
      if (error.msg.message) alert.error(error.msg.message)
    }
    // Message
    if (message !== prevProps.message) {
      if (message.deleteCompany) alert.success(message.deleteCompany);
      if (message.addCompany) alert.success(message.addCompany);
      if (message.passwordsNotMatch) alert.error(message.passwordsNotMatch);
      if (message.invalidUser) alert.error(message.invalidUser);  
      if (message.invalidCompany) alert.error(message.invalidCompany);  
    }
  }

  render() {
    return <Fragment />;
  }
}

const mapStateToProps = state => ({
  error: state.errorsReducer,
  message: state.messagesReducer,
});

export default connect(mapStateToProps)(withAlert()(Alerts));

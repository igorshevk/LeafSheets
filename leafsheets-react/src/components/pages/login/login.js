// Imports

import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {updateNavColor} from '../../../actions/ui';
import LoginForm from '../../forms/login-form';
import {Page, FlexRow} from '../../layouts';

// Login

export class LoginPage extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool,
    updateNavColor: PropTypes.func.isRequired,
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.updateNavColor('secondaryBg');
  }

  render() {
    if (this.props.isAuthenticated) {
      return <Redirect to="/" />;
    }
    return (
      <>
        <Page bg="white" alignItems="center" px="40px">
          <FlexRow
            flexBasis="50%"
            display={['none', 'flex']}
            alignItems="center"
            justifyContent="center"
          >
            <img
              alt="Login"
              src="/login.jpg"
              style={{height: 'auto', maxWidth: '600px', width: '100%'}}
            />
          </FlexRow>
          <LoginForm maxWidth="500px" flexBasis={['100%', '50%']} />
        </Page>
      </>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.authReducer.isAuthenticated,
});

export default connect(
  mapStateToProps,
  {updateNavColor}
)(LoginPage);

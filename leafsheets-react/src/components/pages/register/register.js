// Imports

import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {updateNavColor} from '../../../actions/ui';
import RegisterForm from '../../forms/register-form';
import {Page, FlexRow} from '../../layouts';

// Register

export class RegisterPage extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool,
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
              alt="Sign Up"
              src="/sign-up.jpg"
              style={{height: 'auto', maxWidth: '700px', width: '100%'}}
            />
          </FlexRow>
          <RegisterForm maxWidth="500px" flexBasis={['100%', '50%']} />
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
)(RegisterPage);

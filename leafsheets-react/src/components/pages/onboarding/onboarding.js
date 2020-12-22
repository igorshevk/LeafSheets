// Imports

import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

import OnboardingForm from '../../forms/onboarding-form';
import {updateNavColor} from '../../../actions/ui';
import {FlexRow} from '../../layouts';

// Index

class OnboardingPage extends React.Component {
  static propTypes = {
    updateNavColor: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
  };

  componentWillMount() {
    this.props.updateNavColor('primaryBg');
  }

  render() {
    if (!this.props.isAuthenticated) {
      return <Redirect to="/login" />;
    }
    return (
      <FlexRow bg="primaryBg" minHeight={700} justifyContent="center" alignItems="center">
        <OnboardingForm />
      </FlexRow>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.authReducer.isAuthenticated,
});

export default connect(
  mapStateToProps,
  {updateNavColor}
)(OnboardingPage);

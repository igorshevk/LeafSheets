// Imports

import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

import {updateNavColor} from '../../../actions/ui';
import Confetti from './sections/confetti';
import Pricing from './sections/pricing';
import SignUp from './sections/sign-up';
import WhatIs from './sections/what-is';
import Sheets from '../../sheets.js';
import Hero from './sections/hero';

// Index

class IndexPage extends React.Component {
  static propTypes = {
    updateNavColor: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
  };

  componentWillMount() {
    this.props.updateNavColor('primaryBg');
  }

  render() {
    if (this.props.isAuthenticated) {
      return <Redirect to="/dashboard" />;
    }
    return (
      <>
        <Hero />
        <WhatIs />
        <Confetti />
        <Sheets />
        <Pricing />
        <SignUp />
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
)(IndexPage);

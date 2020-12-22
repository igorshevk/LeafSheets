// Imports

import React, { Component } from 'react';
import styled, { keyframes } from 'styled-components';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { closeSidebar } from '../../actions/ui';

// Sub Component

const fadeInFromNone = keyframes`
    0% {display: none;opacity: 0;}
    1% {display: block;opacity: 0;}
    100% {display: block; opacity: 0.5;}
`

export const BackgroundDim = styled.div`
  {
    background-color: black;
    height: 100vh;
    left: 0;
    opacity: 0;
    position: fixed;
    top: 0;
    width: 100vw;
    z-index: 19;
    animation: ${fadeInFromNone} 0.5s ease-out forwards;
`

// Header

class BackgroundDimmer extends Component {

  static propTypes = {
    closeSidebar: PropTypes.func.isRequired
  }

  render() {
    const { dimApplied } = this.props;
    if (dimApplied === true) {
        return (
            <BackgroundDim onClick={this.props.closeSidebar}>
            </BackgroundDim>
          );
    } else {
        return null;
    }
  }
}

const mapStateToProps = state => ({
  dimApplied: state.uiReducer.dimApplied
})


export default connect(
  mapStateToProps,
  { closeSidebar }
)(BackgroundDimmer);

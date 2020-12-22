// Imports

import React, {Component} from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {lightColors} from '../../styles/colors';
import {FlexRow} from '../layouts';

// Styles

const FooterLink = styled(Link)`
  color: ${lightColors.lightGray};
  cursor: pointer;  
  font-family: Roboto;
  font-size: 18px;
  flex-grow: 0;
  margin-bottom: 10px;
  margin-right 36px;
  margin-top: 10px;
  &:hover {
    color: ${lightColors.accent} !important,
  }
`;

const FooterStaticLink = styled.a`
  color: ${lightColors.lightGray};
  cursor: pointer;  
  font-family: Roboto;
  font-size: 18px;
  flex-grow: 0;
  height: 30px;
  line-height: 30px;
  margin-bottom: 10px;
  margin-right 36px;
  margin-top: 10px;
  &:hover {
    color: ${lightColors.accent} !important,
  }
`;

const DSPLink = styled.a`
  color: ${lightColors.lightGray};
  cursor: pointer;
  font-family: Roboto;
  font-size: 18px;
  flex-grow: 0;
  line-height: 24px;
  margin-bottom: 10px;
  margin-top: 10px;
  &:hover {
    color: ${lightColors.accent} !important;
  }
`;

// Footer

export class Footer extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
  };

  render() {
    return (
      <FlexRow
        px={['20px', '80px']}
        pb={["44px", "0"]}
        as="nav"
        bg="secondaryBg"
        flexDirection="row"
        minHeight={100}
      >
        <FlexRow
          width={['100%', 'auto']}
          alignItems={['flex-start', 'center']}
          justifyContent="flex-start"
          flexDirection={['column', 'row']}
          flexGrow="1"
          mb={["10px", "0"]}
        >
          <FooterLink to="/">© 2020 Leafsheets</FooterLink>
          <FooterStaticLink href="/terms-of-use.html">Terms of Use</FooterStaticLink>
          <FooterStaticLink href="/privacy-policy.html">Privacy Policy</FooterStaticLink>
          <FooterStaticLink href="mailto:high@leafsheets.com">Email Us</FooterStaticLink>
        </FlexRow>
        <DSPLink href="https://www.deepspaceprogram.com" target="_blank">
          Created by Deep Space Program
        </DSPLink>
      </FlexRow>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.authReducer,
});

export default connect(mapStateToProps)(Footer);

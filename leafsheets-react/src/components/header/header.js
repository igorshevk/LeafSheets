// Imports

import React, {Component} from 'react';
import {FaBars} from 'react-icons/fa';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {openSidebar} from '../../actions/ui';
import {logout} from '../../actions/auth';
import {FlexRow} from '../layouts';
import {Button} from '../buttons';
import {LinkTo} from '../links';
import {Icon} from '../icons';

// Sub Components

const Count = styled.div`
   {
    background-color: white;
    border: 1px solid rgba(0, 0, 0, 0.05);
    border-radius: 10px;
    font-family: Helvetica, sans-serif;
    font-size: 14px;
    font-weight: 500;
    position: absolute;
    right: -10px;
    width: 22px;
    height: 22px;
    line-height: 20px;
    z-index: 4;
  }
`;

const ItemsCounter = ({itemsCount}) => {
  if (itemsCount > 0) {
    return <Count>{itemsCount}</Count>;
  } else {
    return null;
  }
};

// Header

export class Header extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,
    openSidebar: PropTypes.func.isRequired,
    navColor: PropTypes.string,
  };

  render() {
    const {items, auth} = this.props;
    const isAuthenticated = auth.isAuthenticated;
    const itemsCount = items.length;
    let {navColor} = this.props;
    if (!navColor) {
      navColor = 'primaryBg';
    }
    const authLinks = (
      <FlexRow flexBasis={['50%', '50%']} justifyContent="flex-end" zIndex="12">
        <Button variant="plain" as={Link} position="relative" to="/checkout" mr={12}>
          <Icon
            icon={[
              <img
                alt="Shopping Cart"
                src="/button-cart-active.png"
                style={{height: '24px', width: 'auto'}}
              />,
            ]}
            color="accent"
          />
          <ItemsCounter itemsCount={itemsCount} />
        </Button>
        <Button variant="plain" onClick={this.props.openSidebar} mr={0} pr={0}>
          <Icon variant="medium" icon={[<FaBars />]} px={0} color="accent" />
        </Button>
      </FlexRow>
    );
    const guestLinks = (
      <FlexRow justifyContent="flex-end" flexBasis={['50%', '50%']} zIndex="12">
        <Button display={['none', 'flex']} variant="plain" as={Link} to="/sheets" mr={12}>
          Sheets
        </Button>
        <Button display={['none', 'flex']} variant="plain" as={Link} to="/login" mr={12}>
          Log In
        </Button>
        <Button display={['none', 'flex']} variant="box" as={Link} to="/register" mr={0}>
          Register
        </Button>
        <Button
          display={['block', 'none']}
          variant="plain"
          onClick={this.props.openSidebar}
          mr={0}
          pr={0}
        >
          <Icon variant="medium" icon={[<FaBars />]} color="accent" />
        </Button>
      </FlexRow>
    );
    return (
      <FlexRow
        as="nav"
        position="sticky"
        top="0"
        bg={navColor}
        color="accent"
        fontSize={[0, 2]}
        height={80}
        justifyContent="space-between"
        px={['20px', '60px']}
        zIndex="11"
      >
        <FlexRow justifyContent="flex-start" flexBasis={['50%', '50%']}>
          <LinkTo to="/" px={0} zIndex="12">
            <img
              alt="Leafsheets Logo"
              src="/logo-header.png"
              style={{height: '32px', width: 'auto'}}
            />
          </LinkTo>
        </FlexRow>
        {isAuthenticated ? authLinks : guestLinks}
      </FlexRow>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.authReducer,
  items: state.cartReducer.items,
  navColor: state.uiReducer.navColor,
});

Header.defaultProps = {
  items: [],
  navColor: null,
};

export default connect(
  mapStateToProps,
  {logout, openSidebar}
)(Header);

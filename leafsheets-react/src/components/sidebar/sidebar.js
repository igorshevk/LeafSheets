// Imports

import {
  FaHome,
  FaBook,
  FaUser,
  FaSignOutAlt,
  FaClipboardList,
  FaUserLock,
  FaKey,
  FaPlus,
  FaFile,
} from 'react-icons/fa';
import {border, color, space, layout, position} from 'styled-system';
import {withRouter} from 'react-router';
import React, {Component} from 'react';
import {FaTimes} from 'react-icons/fa';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {openSidebar, closeSidebar} from '../../actions/ui';
import {FlexRow, FlexColumn} from '../layouts';
import {ClickableIcon, Icon} from '../icons';
import {logout} from '../../actions/auth';
import {Paragraph} from '../paragraph';
import {Title} from '../headers';

// Sub Components

const Bar = styled(FlexColumn)(
  {
    borderLeft: '1px solid rgba(0,0,0,0.06)',
    height: '100vh',
    overflowY: 'scroll',
    position: 'fixed',
    right: '-100vh',
    top: '0',
    transition: 'right 0.3s ease-in-out',
    zIndex: '20',
  },
  border,
  space,
  color,
  position
);

const Row = styled(FlexRow)(
  {
    alignItems: 'center',
    cursor: 'pointer',
    flexWrap: 'wrap',
    height: '44px',
    justifyContent: 'flex-start',
    textDecoration: 'none',
    '&:hover': {
      backgroundColor: 'white',
    },
  },
  color,
  space,
  layout
);

const SidebarRow = props => {
  const {icon, title, active = false, ...otherProps} = props;
  let iconColor = 'normalGrey';
  let titleWeight = '400';
  let bg = 'primaryBg';
  if (active === true) {
    bg = 'secondaryBg';
    iconColor = 'accent';
    titleWeight = '500';
  }
  return (
    <Row {...otherProps} bg={bg} px={['20px', '30px']}>
      <Icon variant="small" icon={icon} color={iconColor} />
      <Paragraph
        color="black"
        variant="menu"
        fontWeight={`${titleWeight} !important`}
        ml="20px"
        mb="0"
        mt="2px"
      >
        {title}
      </Paragraph>
    </Row>
  );
};

const Divider = () => {
  return (
    <hr
      style={{
        marginTop: '12px',
        marginBottom: '12px',
        borderTop: '1px solid #f4f6f8',
        borderLeft: 'none',
        width: '100%',
      }}
    />
  );
};

// Sidebar

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = this.initialState();
    this.assignActiveRow = this.assignActiveRow.bind(this);
    this.signOut = this.signOut.bind(this);
  }

  initialState() {
    return {
      activeRow: null,
    };
  }

  static propTypes = {
    auth: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
    sidebarOpen: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    this.assignActiveRow(this.props.location.pathname);
    this.unlisten = this.props.history.listen((location, action) => {
      this.assignActiveRow(location.pathname);
    });
  }

  componentWillUnmount() {
    this.unlisten();
  }

  assignActiveRow(pathname) {
    let activeRow = null;
    switch (pathname) {
      case '/':
      case '/dashboard':
        activeRow = 'dashboard';
        break;
      case '/sheets':
        activeRow = 'sheets';
        break;
      case '/checkout':
        activeRow = 'checkout';
        break;
      case '/account':
        activeRow = 'account';
        break;
      case '/company':
        activeRow = 'company';
        break;
      case '/login':
        activeRow = 'login';
        break;
      case '/payments':
        activeRow = 'payments';
        break;
      case '/orders':
        activeRow = 'orders';
        break;
      case '/locations':
        activeRow = 'locations';
        break;
      case '/register':
        activeRow = 'register';
        break;
      case '/terms':
        activeRow = 'terms';
        break;
      case '/privacy':
        activeRow = 'privacy';
        break;
      default:
        break;
    }
    this.setState({activeRow: activeRow});
  }

  signOut() {
    this.props.closeSidebar();
    this.props.logout();
  }

  render() {
    const right = this.props.sidebarOpen === true ? '0' : '-100vw';
    const checkoutActive = this.state.activeRow === 'checkout';
    let checkoutIcon = (
      <img
        alt="Shopping Cart"
        src="/button-cart-inactive.png"
        style={{height: '24px', width: 'auto'}}
      />
    );
    if (checkoutActive === true) {
      checkoutIcon = (
        <img
          alt="Shopping Cart"
          src="/button-cart-active.png"
          style={{height: '24px', width: 'auto'}}
        />
      );
    } else {
      checkoutIcon = (
        <img
          alt="Shopping Cart"
          src="/button-cart-inactive.png"
          style={{height: '24px', width: 'auto'}}
        />
      );
    }
    if (this.props.auth.isAuthenticated !== true) {
      return (
        <Bar bg="primaryBg" right={right} width={['100%', '240px']}>
          <FlexRow px={['20px', '30px']} justifyContent="space-between" height="80px">
            <Title mb={0} variant="large">
              Menu
            </Title>
            <ClickableIcon
              onClick={this.props.closeSidebar}
              variant="medium"
              icon={[<FaTimes />]}
              color="accent"
            />
          </FlexRow>
          <SidebarRow
            onClick={this.props.closeSidebar}
            as={Link}
            to="/sheets"
            icon={[<FaFile />]}
            title="Sheets"
            active={this.state.activeRow === 'sheets'}
          />
          <SidebarRow
            onClick={this.props.closeSidebar}
            as={Link}
            to="/login"
            icon={[<FaKey />]}
            title="Login"
            active={this.state.activeRow === 'login'}
          />
          <SidebarRow
            onClick={this.props.closeSidebar}
            as={Link}
            to="/register"
            icon={[<FaPlus />]}
            title="Register"
            active={this.state.activeRow === 'register'}
          />
          <Divider />
          <SidebarRow
            onClick={this.props.closeSidebar}
            as={'a'}
            href="/terms-of-use.html"
            icon={[<FaBook />]}
            title="Terms of Service"
            active={this.state.activeRow === 'terms'}
          />
          <SidebarRow
            onClick={this.props.closeSidebar}
            as={'a'}
            href="/privacy-policy.html"
            icon={[<FaUserLock />]}
            title="Privacy Policy"
            active={this.state.activeRow === 'privacy'}
          />
          <Divider />
        </Bar>
      );
    }
    return (
      <Bar bg="primaryBg" right={right} width={['100%', '240px']}>
        <FlexRow px={['20px', '30px']} justifyContent="space-between" height="80px">
          <Title mb={0} variant="large">
            Menu
          </Title>
          <ClickableIcon
            onClick={this.props.closeSidebar}
            variant="medium"
            icon={[<FaTimes />]}
            color="accent"
          />
        </FlexRow>
        <SidebarRow
          onClick={this.props.closeSidebar}
          as={Link}
          to="/"
          icon={[<FaHome />]}
          title="Dashboard"
          active={this.state.activeRow === 'dashboard'}
        />
        <SidebarRow
          onClick={this.props.closeSidebar}
          as={Link}
          to="/sheets"
          icon={[<FaFile />]}
          title="Sheets"
          active={this.state.activeRow === 'sheets'}
        />
        <SidebarRow
          onClick={this.props.closeSidebar}
          as={Link}
          to="/checkout"
          icon={[checkoutIcon]}
          title="Cart"
          active={this.state.activeRow === 'checkout'}
        />
        <Divider />
        <SidebarRow
          onClick={this.props.closeSidebar}
          as={Link}
          to="/account"
          icon={[<FaUser />]}
          title="Account"
          active={this.state.activeRow === 'account'}
        />
        <SidebarRow
          onClick={this.props.closeSidebar}
          as={Link}
          to="/orders"
          icon={[<FaClipboardList />]}
          title="Order History"
          active={this.state.activeRow === 'orders'}
        />
        <Divider />
        <SidebarRow
          onClick={this.signOut}
          icon={[<FaSignOutAlt />]}
          title="Log Out"
          active={this.state.activeRow === 'exit'}
        />
        <Divider />
      </Bar>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.authReducer,
  sidebarOpen: state.uiReducer.sidebarOpen,
});

Sidebar.defaultProps = {
  sidebarOpen: false,
};

export default connect(
  mapStateToProps,
  {
    logout,
    openSidebar,
    closeSidebar,
  }
)(withRouter(Sidebar));

// Imports

import {buttonStyle, color, layout, space, typography, variant} from 'styled-system';
import React, {Component, Fragment} from 'react';
import {Redirect} from 'react-router-dom';
import styled from 'styled-components';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {isSheetInCartItems, isSheetInUserSheets} from '../../utils/sheets';
import {deleteFromCart, addToCart} from '../../actions/cart';

// Variants

const styledSheetButtonVariants = {
  pill: {
    color: 'primary',
    backgroundColor: 'transparent',
    border: 'solid',
    borderColor: 'primary',
    borderRadius: 42,
    borderWidth: 1,
    '&:hover': {
      borderColor: 'accent',
      color: 'accent',
    },
  },
  standard: {
    color: 'primary',
    backgroundColor: 'lightGray',
    border: 'solid',
    borderColor: 'transparent',
    borderRadius: 8,
    borderWidth: 1,
    '&:hover': {
      backgroundColor: 'primaryBg',
      borderColor: 'primary',
      color: 'primary',
    },
  },
  purchase: {
    color: 'secondary',
    backgroundColor: 'accent',
    border: 'solid',
    borderColor: 'transparent',
    borderRadius: 8,
    borderWidth: 1,
    '&:hover': {
      backgroundColor: 'secondary',
      borderColor: 'primary',
      color: 'primary',
    },
  },
};

// Styling

const StyledSheetButton = styled.button(
  {
    alignItems: 'center',
    backgroundColor: 'primaryBg',
    border: 0,
    boxSizing: 'border-box',
    cursor: 'pointer',
    display: 'flex',
    fontFamily: 'Barlow',
    fontSize: 14,
    fontWeight: '500',
    height: 40,
    justifyContent: 'center',
    lineHeight: '28px',
    outline: 0,
    padding: '6px 16px 6px 16px',
    textAlign: 'center',
    textDecoration: 'none',
    transition: 'color 0.05s linear, border 0.05s linear',
  },
  buttonStyle,
  color,
  layout,
  space,
  typography,
  variant({
    scale: 'sheetButtons',
    variants: styledSheetButtonVariants,
  })
);

StyledSheetButton.defaultProps = {
  variant: 'pill',
};

// Button

class SheetButton extends Component {
  constructor(props) {
    super(props);
    const inCart = isSheetInCartItems(this.props.sheet, this.props.cartItems);
    const inUserSheets = isSheetInUserSheets(this.props.sheet, this.props.userSheets);
    this.state = {
      redirectToLogin: false,
      isSheetInCartItems: inCart,
      isSheetInUserSheets: inUserSheets,
    };
  }

  static propTypes = {
    sheet: PropTypes.object.isRequired,
    addToCart: PropTypes.func.isRequired,
  };

  componentDidUpdate(prevProps) {
    const inCart = isSheetInCartItems(this.props.sheet, this.props.cartItems);
    const inUserSheets = isSheetInUserSheets(this.props.sheet, this.props.userSheets);
    if (prevProps.cartItems.length !== this.props.cartItems.length) {
      if (prevProps.isSheetInCartItems !== inCart) {
        this.setState({isSheetInCartItems: inCart});
      }
    }  
    if (prevProps.activeSheet !== this.props.activeSheet) {
      if (prevProps.isSheetInUserSheets !== inUserSheets) {
        this.setState({isSheetInUserSheets: inUserSheets});
      }
    } 
  }

  componentDidMount() {
    const inCart = isSheetInCartItems(this.props.sheet, this.props.cartItems);
    const inUserSheets = isSheetInUserSheets(this.props.sheet, this.props.userSheets);
    this.setState({isSheetInCartItems: inCart});
    this.setState({isSheetInUserSheets: inUserSheets});
  }

  handleButtonClick = () => {
    if (this.props.isAuthenticated === false) {
      // Redirect to Login
      this.setState({redirectToLogin: true});
    } else if (this.state.isSheetInCartItems) {
      // Remove from Cart
      this.props.deleteFromCart(this.props.sheet, 1);
    } else if (this.state.isSheetInUserSheets === true) {
      this.setState({redirectToLogin: true})
    } else {
      this.props.addToCart(this.props.sheet, 1);
    }
  };

  render() {
    if (this.state.redirectToLogin) {
      return <Redirect to="/login" />;
    }
    let variant = 'purchase';
    let title = 'ADD TO CART';
    if (this.props.isAuthenticated === false) {
      variant = 'standard';
      title = 'SIGN IN & PURCHASE';
    } else if (this.state.isSheetInCartItems) {
      variant = 'standard';
      title = 'REMOVE';
    } else if (this.state.isSheetInUserSheets) {
      variant = 'standard';
      title = 'VIEW SHEET';
    }
    return (
      <Fragment>
        <StyledSheetButton
          variant={variant}
          mb="8px"
          height="50px"
          onClick={this.handleButtonClick}
        >
          {title}
        </StyledSheetButton>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.authReducer.isAuthenticated,
  activeSheet: state.sheetsAndItemsReducer.activeSheet,
  userSheets: state.sheetsAndItemsReducer.userSheets,
  cart: state.cartReducer.cart,
  cartItems: state.cartReducer.items,
});

export default connect(
  mapStateToProps,
  {
    addToCart,
    deleteFromCart
  }
)(SheetButton);

// Imports

import React, { Component } from "react";
import styled from 'styled-components';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { deleteFromCart, getCart, getCartItems } from '../../../../actions/cart';
import { FlexColumn, FlexRow } from '../../../layouts';
import { Paragraph } from '../../../paragraph';
import CartItem from './cart-item';

// Sub Components

const HiddenScrollFlexColumn = styled(FlexColumn)`
  *::-webkit-scrollbar {
    display: none;
  }
`
// Hero

export class MiniCart extends Component {

  static propTypes = {
    cart: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,
    getCart: PropTypes.func.isRequired,
    deleteFromCart: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.getCart();
    this.props.getCartItems();
  }

  componentWillUnmount() {
    this.props.getCart();
    this.props.getCartItems();
  }

  render() {
    const { items } = this.props;
    const hours_saved = items.reduce((acc, item) => acc + item.item.sheet.hours_saved, 0)
    return (
      <HiddenScrollFlexColumn>
        <HiddenScrollFlexColumn maxHeight="345px" overflowY="scroll" overflowX="hidden"> 
          {this.props.items.map((orderItem, index) => {
            return <CartItem orderItem={orderItem} index={index} key={orderItem.item.sheet.id} />
          })}
        </HiddenScrollFlexColumn>
        <FlexColumn bg="primaryBg" justifyContent="space-between" mt="32px" width="100%">
          <hr style={{borderTop: "1px solid #151515", width: "100%", margin: "0"}} /> 
          <FlexRow alignItems="center" justifyContent="space-between" width="100%">
            <Paragraph height="52px" lineHeight="52px !important" p="0" m="0" variant="large">
              Time Savings
            </Paragraph>
            <Paragraph height="52px" lineHeight="52px !important" p="0" m="0" variant="large">
              {hours_saved} Hours
            </Paragraph>
          </FlexRow>
          <hr style={{borderTop: "1px solid #151515", width: "100%", margin: "0"}}/>
        </FlexColumn>
      </HiddenScrollFlexColumn>
    );
  }
}

const mapStateToProps = state => ({
  cart: state.cartReducer.cart,
  items: state.cartReducer.items,
});

export default connect(
  mapStateToProps,
  { deleteFromCart, getCart, getCartItems }
)(MiniCart)
// Imports

import React, { Component } from "react";
import { FaTimesCircle } from 'react-icons/fa';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { deleteFromCart } from '../../../../actions/cart';
import { FlexColumn, FlexRow } from '../../../layouts';
import { Paragraph } from '../../../paragraph';
import { Title } from '../../../headers';
import { LinkTo } from '../../../links';
import { Icon } from '../../../icons';

// Hero

class CartItem extends Component {

  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
  }

  static propTypes = {
    deleteFromCart: PropTypes.func.isRequired,
    cart: PropTypes.object.isRequired,
  }

  handleDelete() {
    const { orderItem } = this.props;
    this.props.deleteFromCart(orderItem.item, 1);
  }

  render() {
    const { orderItem, index } = this.props;
    const mt = index === 0 ? "0px" : "24px";
    const sheet = orderItem.item.sheet;
    const price = (Math.round(orderItem.item.price / 100)).toFixed(2);
    return (
      <>
        <FlexRow alignItems="flex-start" flexWrap="nowrap" maxWidth={["100%", "600px"]} width="100%" mt={mt}>
          <FlexColumn alignItems="flex-start" flexBasis="80%" flexGrow="0" flexShrink="0">
            <LinkTo to={`/sheets/${sheet.id}`}>
              <Title variant="xSmall" color="primary" textAlign="center">
                {sheet.title}
              </Title>
            </LinkTo>
            <Paragraph fontWeight="300 !important">
              <b>{sheet.hours_saved} Hours Saved</b> — {sheet.short_description}
            </Paragraph>
          </FlexColumn>
          <FlexColumn alignItems="flex-end" flexBasis="20%" flexGrow="0" flexShrink="0">
            <Title variant="xSmall" color="primary" textAlign="right">
              ${price}
            </Title>
            <Icon onClick={this.handleDelete} variant='button' color="normalGrey" icon={[<FaTimesCircle />]} mb={16} />
          </FlexColumn>
        </FlexRow>
      </>
    );
  }
}

const mapStateToProps = state => ({
  cart: state.cartReducer.cart,
});

export default connect(
  mapStateToProps,
  {deleteFromCart}
)(CartItem)
// Imports

import { space, flexbox, position } from 'styled-system';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Page, Section, FlexRow, FlexColumn, Divider } from '../../layouts';
import { updateNavColor } from '../../../actions/ui';
import ChargeForm from './charge/charge-form';
import { Paragraph } from '../../paragraph';
import MiniCart from './cart/mini-cart';
import { Link } from 'react-router-dom';
import { Button } from '../../buttons';
import { Title } from '../../headers';

const TotalDiv = styled(FlexColumn) (
  {
    backgroundColor: "#fafafa !important",
    borderBottom: "2px solid rgba(0,0,0,0.02)",
    justifyContent: "center",
    position: "sticky",
    top: "80px",
    transition: "height 0.25s linear",
    zIndex: "10 !important"
  },
  space,
  flexbox,
  position,
)

// Index

class CheckoutPage extends Component {

  constructor(props) {
    super(props);
    this.state = this.initialState();
    this.totalDivRef = React.createRef();
    this.handleScroll = this.handleScroll.bind(this);
  }

  static propTypes = {
    updateNavColor: PropTypes.func.isRequired,
    cart: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired
  }

  initialState() {
    return {
      style: {
        totalDivHeight: "110px",
      }
    };
  }

  componentDidMount() {
    this.props.updateNavColor("primaryBg");
		window.addEventListener('scroll', this.handleScroll);
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll);
  }
  
  handleScroll(event) {
    if (this.totalDivRef.current !== null) {
      let rect = this.totalDivRef.current.getBoundingClientRect();
      if (rect.y <= 80 && this.state.style.totalDivHeight !== "56px") {
        this.setState({
          style: {
            totalDivHeight: "56px"
          }
        });
      }
      if (rect.y > 80 && this.state.style.totalDivHeight !== "110px") {
        this.setState({
          style: {
            totalDivHeight: "110px"
          }
        });
      }	
    }
	}

  render() {
    const { isAuthenticated, items } = this.props;
    const total = items.reduce((acc, item) => acc + item.item.price, 0)
    const formattedTotal = (Math.round(total / 100)).toFixed(2);
    if (!isAuthenticated) {
      return <Redirect to="/login" />;
    }
    if (items.length > 0) {
      return (
        <>
          <Section alignItems="center" bg='primaryBg' flexDirection="column" minHeight={"100%"}>
            <FlexColumn alignItems="center" maxWidth="600px" px={["40px", "0px"]} minHeight={200} maxHeight="none" flexBasis={['100%', '34%']}>
              <Divider mt="24px">Your Cart</Divider>
              <MiniCart />
            </FlexColumn>
          </Section>
          <Section alignItems="center" bg='secondaryBg' flexDirection="column" minHeight={"100%"}>
            <div ref={this.totalDivRef}></div>
            <TotalDiv height={this.state.style.totalDivHeight} width="100%">
              <FlexRow maxWidth="600px" px={["40px", "0px"]} mx="auto" justifyContent="space-between" width="100%">
                <Title zIndex="13" mb="0" variant="small">
                  Total
                </Title>
                <Title zIndex="13" mb="0" variant="medium">
                  ${formattedTotal}
                </Title>
              </FlexRow>
            </TotalDiv>
            <FlexColumn alignItems="center" maxWidth="600px" px={["40px", "0px"]} bg='white' flexBasis={['100%', '66%']} pb="24px">
              <Divider mt="48px">Checkout</Divider>
              <ChargeForm />
            </FlexColumn>
            <FlexRow justifyContent="flex-start" maxWidth="600px" px={["40px", "0px"]} bg='white' pb="96px">
              <Paragraph variant="legal">
                By confirming this purchase, I agree to the Terms of Use, Refund Policy, and Privacy Policy.
              </Paragraph>
            </FlexRow>
          </Section>
        </>
      );
    } else {
      return (
        <Page justifyContent="center" bg='primaryBg' flexDirection="column">
          <img alt="Empty Cart" src="/empty-cart.png" style={{height: "180px", marginBottom: "40px", width: "auto"}} />
          <Title variant="medium">Your Cart Is Empty</Title>
          <Paragraph variant="large" color="primary" mb={32}>Please add sheets to your cart before checking out.</Paragraph>
          <Button as={Link} variant="box" to="/sheets">View All Sheets</Button>
        </Page>
      )
    }
  }
}

const mapStateToProps = state => ({
  cart: state.cartReducer.cart,
  items: state.cartReducer.items,
  isAuthenticated: state.authReducer.isAuthenticated,
});

export default connect(
  mapStateToProps,
  { updateNavColor }
)(CheckoutPage)



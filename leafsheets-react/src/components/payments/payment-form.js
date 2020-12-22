// Imports

import {
  Elements,
  StripeProvider,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement, 
  injectStripe 
  } from 'react-stripe-elements';
import React, { Component, Fragment } from 'react';
import { space, flexbox } from 'styled-system';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { beginLoading, endLoading, clearForm } from '../../actions/ui';
import { addPaymentMethod } from '../../actions/payment-methods';
import { FlexRow } from '../layouts';
import { Paragraph } from '../paragraph';
import { Input } from '../inputs';
import './stripe.css';

// Options

const cardStyle = { 
  height: "auto", 
  width: "48px", 
  marginRight: "4px", 
  borderRadius: "4px", 
  border: "1px solid rgba(0,0,0,0.06)"
}

const fonts = [{
    cssSrc: 'https://fonts.googleapis.com/css?family=Barlow:400'
}]

const stripeElementStyle = {
  base: {
    backgroundColor: '#fff',
    color: '#151515',
    fontSize: '18px',
    fontFamily: '"Barlow", sans-serif',
    fontWeight: '300',
    "::placeholder": {
      fontSize: '18px',
      fontFamily: '"Barlow", sans-serif',
      fontWeight: '300',
      color: '#b2bfc4'
    }
  }
}

// Helpers

const Checkmark = styled.span(space, flexbox);

// Payment Form

class UninjectedForm extends Component {

  constructor(props) {
    super(props);
    this.cvcRef = React.createRef();
    this.expiryRef = React.createRef();
    this.numberRef = React.createRef();
    this.resetForm = this.resetForm.bind(this);
    this.props.handleChange({target: {name: "stripe", value: this.props.stripe}});
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      if (this.props.formToClear === 'addPayment') {
        this.resetForm();
        this.props.clearForm(null);
      }
    }
  }

  resetForm() {
    this.cvcRef.current._element.clear();
    this.expiryRef.current._element.clear();
    this.numberRef.current._element.clear();
  }
  
  render() {
    this.props.clearForm(null);
    const { validateCardElement } = this.props;
    return (
      <Fragment>
        <div className="StripeInputWrapper">
          <CardNumberElement 
            style={stripeElementStyle}
            onChange={validateCardElement}
            ref={this.numberRef}/>
        </div>
        <div className="StripeInputWrapper StripeInputWrapper--half">
          <CardExpiryElement 
            style={stripeElementStyle} 
            onChange={validateCardElement}
            ref={this.expiryRef}/>
        </div>
        <div className="StripeInputWrapper StripeInputWrapper--half">
          <CardCvcElement 
            style={stripeElementStyle} 
            onChange={validateCardElement}
            ref={this.cvcRef}/>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  formToClear: state.uiReducer.clearForm,
});

const InjectedForm = injectStripe(connect(
  mapStateToProps,
  { clearForm },
  null,
  { forwardRef: true }
)(UninjectedForm))

class PaymentForm extends React.Component {

  constructor(props) {
    super(props);
    this.uninjectedRef = React.createRef();
    this.state = this.initialState();
    this.clearForm = this.clearForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCheckbox = this.handleCheckbox.bind(this);
    this.addPaymentMethod = this.addPaymentMethod.bind(this);
    this.validateCardElement = this.validateCardElement.bind(this);
  }

  initialState() {
    return {
      make_default_card: true,
      stripe: null,
      cardNumberValid: false,
      cardExpiryValid: false,
      cardCvcValid: false,
    }
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  handleCheckbox(event) {
    this.setState({[event.target.name]: event.target.checked});
  }

  validateCardElement(event) {
    const targetName = event.elementType;
    const valid = event.error === undefined;
    this.setState({[`${targetName}Valid`]: valid}, () => {
      this.props.saveEnabled && this.props.saveEnabled(this.state.cardNumberValid, this.state.cardExpiryValid, this.state.cardCvcValid);
    });
  }

  async addPaymentMethod(address_zip=null) {
    if (this.props.sendActions === true) {
      const titles = {
        title: 'Adding Payment Method',
        subtitle: "We're saving your payment method. Thanks for your patience.",
      }
      this.props.beginLoading(titles);
    }
    let options = {}
    if (address_zip !== null) {
      options = { address_zip }
    }
    let { token } = await this.state.stripe.createToken(options);
    const { make_default_card } = this.state ;
    let paymentMethods = await this.props.addPaymentMethod({ 
      token: token.id,
      makeDefaultCard: make_default_card
    })
    paymentMethods.sort((a,b) => b.id - a.id);
    if (this.props.sendActions === true && paymentMethods[0] !== undefined) {
      this.props.endLoading();
    }
    this.clearForm();
    return paymentMethods[0];
  }

  clearForm() {
    this.props.clearForm("addPayment");
    this.setState({ cardNumberValid: false, cardCvcValid: false, cardExpiryValid: false});
  }

  render() {
    const { make_default_card } = this.state;
    this.props.saveEnabled && this.props.saveEnabled(this.state.cardNumberValid, this.state.cardExpiryValid, this.state.cardCvcValid);
    return (
      <>
        <StripeProvider apiKey="pk_test_t8F0qDY2yd84wSI6K2jgg1Gl">
          <div style={{width: "100%"}} className="example">
            <Elements fonts={fonts}>
              <div style={{width: "100%"}} className="checkout">
                  <InjectedForm 
                    handleChange={this.handleChange} 
                    validateCardElement={this.validateCardElement}/>
              </div>
            </Elements>
          </div>
        </StripeProvider>
        <FlexRow mt={this.props.mt} justifyContent="space-between" width="100%">
          <FlexRow as="label" className="checkbox-container" flexWrap="nowrap" flexBasis={["100%", "30%"]}>
            <Input checked={make_default_card} type="checkbox" name={"make_default_card"} onChange={this.handleCheckbox} />
            <Checkmark flexBasis="15%" height={["90px", "48px"]}  mr="10px" className="checkbox-checkmark" />
            <Paragraph mb="0px" height="30px" lineHeight="30px !important" variant="small">
                Save as default
            </Paragraph>
          </FlexRow>
          <FlexRow mt={["24px", "0"]} justifyContent={["flex-start", "flex-end"]} flexBasis={["100%", "70%"]}>
            <img alt="Visa" src="/cards/visa.png" style={cardStyle} />
            <img alt="Mastercard" src="/cards/mastercard.png" style={cardStyle} />
            <img alt="American Express" src="/cards/americanexpress.png" style={cardStyle} />
            <img alt="Diners Club" src="/cards/dinersclub.png" style={cardStyle} />
            <img alt="JSC" src="/cards/jcb.png" style={cardStyle} />
            <img alt="Discover" src="/cards/discover.png" style={cardStyle} />
          </FlexRow>
        </FlexRow>
      </>
    )
  }
}

PaymentForm.defaultProps = {
  sendActions: false,
}

export default connect(
  null,
  { addPaymentMethod,
    beginLoading,
    endLoading,
    clearForm
  },
  null,
  { forwardRef: true }
)(PaymentForm);
// Imports

import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {addPaymentMethod, getPaymentMethods} from '../../../../actions/payment-methods';
import {beginLoading, endLoading, redirectTo} from '../../../../actions/ui';
import ExistingAddressForm from '../../../addresses/existing-address-form';
import ExistingPaymentForm from '../../../payments/existing-payment-form';
import {getAddresses} from '../../../../actions/addresses';
import {createMessage} from '../../../../actions/messages';
import AddressForm from '../../../addresses/address-form';
import PaymentForm from '../../../payments/payment-form';
import {addCharge} from '../../../../actions/charges';
import Analytics from '../../../../clients/analytics';
import {FlexColumn, FlexRow} from '../../../layouts';
import Switch from '../../../switch/switch';
import {Button} from '../../../buttons';
import {Title} from '../../../headers';

import './charge.css';
import './google-places.css';

// Payment Form

class ChargeForm extends Component {
  constructor(props) {
    super(props);
    this.state = this.initialState();
    this.addressRef = React.createRef();
    this.paymentRef = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCheckbox = this.handleCheckbox.bind(this);
    this.addressToggled = this.addressToggled.bind(this);
    this.paymentToggled = this.paymentToggled.bind(this);
    this.paymentValid = this.paymentValid.bind(this);
    this.addressValid = this.addressValid.bind(this);
    this.validateForms = this.validateForms.bind(this);
  }

  componentDidUpdate(prevProps) {
    // Set the activeAddressId default if necessary.
    if (this.state.activeAddressID === null || prevProps.billingAddresses.length === 0) {
      const activeAddress = this.props.billingAddresses.filter(address => {
        return address.default === true;
      })[0];
      if (activeAddress) {
        this.setState({activeAddressID: activeAddress.id});
        this.forceUpdate();
      }
    }
    if (
      this.state.activePaymentMethodID === null ||
      prevProps.paymentMethods.length === 0
    ) {
      const activePaymentMethod = this.props.paymentMethods.filter(paymentMethod => {
        return paymentMethod.default === true;
      })[0];
      if (activePaymentMethod) {
        this.setState({activePaymentMethodID: activePaymentMethod.id});
        this.forceUpdate();
      }
    }
    // If Billing Addresses are present default to using the default address.
    if (
      prevProps.billingAddresses !== this.props.billingAddresses &&
      this.props.billingAddresses.length > 0
    ) {
      this.setState({useExistingAddress: true, addressValid: true});
    }
    // If Payment Methods are present default to using the defauly payment method.
    if (
      prevProps.paymentMethods !== this.props.paymentMethods &&
      this.props.paymentMethods.length > 0
    ) {
      this.setState({useExistingPaymentMethod: true, paymentValid: true});
    }
  }

  componentDidMount() {
    // End the loading, if nec.
    this.props.endLoading();
    // Load our payment & billing info.
    this.props.getPaymentMethods();
    this.props.getAddresses();
  }

  static propTypes = {
    addPaymentMethod: PropTypes.func.isRequired,
    billingAddresses: PropTypes.array.isRequired,
    paymentMethods: PropTypes.array.isRequired,
    getPaymentMethods: PropTypes.func.isRequired,
    getAddresses: PropTypes.func.isRequired,
    beginLoading: PropTypes.func.isRequired,
    endLoading: PropTypes.func.isRequired,
    createMessage: PropTypes.func.isRequired,
    redirectTo: PropTypes.func.isRequired,
    orderItems: PropTypes.array.isRequired,
  };

  initialState() {
    return {
      useExistingAddress: false,
      activeAddressID: null,
      useExistingPaymentMethod: false,
      activePaymentMethodID: null,
      paymentValid: false,
      addressValid: false,
    };
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  handleCheckbox(event) {
    this.setState({[event.target.name]: event.target.checked});
  }

  addressToggled(shouldUseExistingAddress) {
    this.setState({
      useExistingAddress: shouldUseExistingAddress,
      addressValid: shouldUseExistingAddress,
    });
  }

  paymentToggled(shouldUseExistingPaymentMethod) {
    this.setState({
      useExistingPaymentMethod: shouldUseExistingPaymentMethod,
      paymentValid: shouldUseExistingPaymentMethod,
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    if (this.validateForms() === false) {
      return;
    }
    const options = {
      title: 'Processing Payment',
      subtitle: 'Please be patient while we confirm your purchase.',
    };
    this.props.beginLoading(options);
    // Address!
    const {useExistingAddress} = this.state;
    let billingAddress = null;
    if (useExistingAddress !== true) {
      // Create the address if the default card is not selected.
      billingAddress = await this.addressRef.current.addAddress();
    } else {
      // Otherwise, grab the default from the existing.
      billingAddress = this.props.billingAddresses.sort((a, b) => b.id - a.id)[0];
    }
    // Payment Method!
    const {useExistingPaymentMethod} = this.state;
    let paymentMethod = null;
    if (useExistingPaymentMethod !== true) {
      paymentMethod = await this.paymentRef.current.addPaymentMethod(
        billingAddress.postal
      );
    } else {
      paymentMethod = this.props.paymentMethods.sort((a, b) => b.id - a.id)[0];
    }
    // Charge it!
    if (!paymentMethod || !billingAddress) {
      this.props.endLoading();
      return;
    }
    let charges = await this.props.addCharge({
      paymentMethodID: paymentMethod.id,
      billingAddressID: billingAddress.id,
    });
    let charge = charges.sort((a, b) => b.id - a.id)[0];
    // If the charge was a success, redirect. Otherwise, notify the user.
    if (charge && charge.outcome_type === 'authorized') {
      this.props.orderItems.forEach(orderItem => {
        Analytics.logSheetAction('sheet__purchase', orderItem.item.sheet)
      })
      this.props.redirectTo({
        endpoint: `/receipts/${charge.id}/`,
        title: 'Success!',
        subtitle: "Your purchase was confirmed. We'll now redirect you.",
      });
    } else {
      // Display the error.
      this.props.endLoading();
    }
  }

  paymentValid(cardNumberValid, cardExpiryValid, cardCvcValid) {
    this.setState({
      paymentValid:
        (cardNumberValid && cardExpiryValid && cardCvcValid) ||
        this.state.useExistingPaymentMethod === true,
    });
  }

  addressValid(props) {
    let newAddressValid = false;
    if (props) {
      const {user_address} = props;
      const {first_name, last_name, street_1, city, state, postal} = user_address;
      if (
        first_name.length > 0 &&
        last_name.length > 0 &&
        street_1.length > 0 &&
        city.length > 0 &&
        state.length > 0 &&
        postal.length === 5
      ) {
        newAddressValid = true;
      }
    }
    this.setState({
      addressValid: newAddressValid || this.state.useExistingAddress === true,
    });
  }

  validateForms() {
    let validated = true;
    if (this.state.paymentValid === false || this.state.addressValid === false) {
      validated = false;
    }
    return validated;
  }

  render() {
    const enableButton = this.validateForms();
    return (
      <Fragment>
        <form onSubmit={this.handleSubmit}>
          <FlexColumn>
            <FlexRow
              mb="16px"
              justifyContent="space-between"
              alignItems="center"
              minHeight="50px"
              zIndex="9"
            >
              <Title variant="xSmall" flexBasis="50%" mb={['20px', '0']}>
                Billing Address
              </Title>
              {this.props.billingAddresses && this.props.billingAddresses.length > 0 ? (
                <Switch
                  isOn={this.state.useExistingAddress}
                  handleToggle={() => this.addressToggled(!this.state.useExistingAddress)}
                  id={'addressSwitch'}
                  checkedTitle="New"
                  uncheckedTitle="Saved"
                />
              ) : null}
            </FlexRow>
            {this.state.useExistingAddress && (
              <ExistingAddressForm
                state="selecting"
                activeAddressID={this.state.activeAddressID}
                handleChange={this.handleChange}
              />
            )}
            {!this.state.useExistingAddress && (
              <AddressForm ref={this.addressRef} saveEnabled={this.addressValid} />
            )}
          </FlexColumn>
          <FlexColumn>
            <FlexRow
              mb="16px"
              mt="32px"
              justifyContent="space-between"
              alignItems="center"
              minHeight="50px"
            >
              <Title variant="xSmall" flexBasis="50%" mb={['20px', '0']}>
                Payment Method
              </Title>
              {this.props.paymentMethods && this.props.paymentMethods.length > 0 ? (
                <Switch
                  isOn={this.state.useExistingPaymentMethod}
                  handleToggle={() =>
                    this.paymentToggled(!this.state.useExistingPaymentMethod)
                  }
                  id={'paymentMethodSwitch'}
                  checkedTitle="New"
                  uncheckedTitle="Saved"
                />
              ) : null}
            </FlexRow>
            {this.state.useExistingPaymentMethod && (
              <ExistingPaymentForm
                state="selecting"
                activePaymentMethodID={this.state.activePaymentMethodID}
                handleChange={this.handleChange}
              />
            )}
            {!this.state.useExistingPaymentMethod && (
              <PaymentForm ref={this.paymentRef} saveEnabled={this.paymentValid} />
            )}
          </FlexColumn>
          <FlexColumn alignItems="flex-start" mt="48px">
            <Button
              disabled={!enableButton}
              variant="purchase"
              onSubmit={this.handleSubmit}
            >
              PLACE ORDER
            </Button>
          </FlexColumn>
        </form>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  billingAddresses: state.addressesReducer.billingAddresses,
  paymentMethods: state.paymentMethodsReducer.paymentMethods,
  orderItems: state.cartReducer.items,
});

ChargeForm.defaultProps = {
  billingAddresses: [],
  paymentMethods: [],
};

export default connect(
  mapStateToProps,
  {
    addCharge,
    getAddresses,
    addPaymentMethod,
    getPaymentMethods,
    beginLoading,
    endLoading,
    createMessage,
    redirectTo,
  }
)(ChargeForm);

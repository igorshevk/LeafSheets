// Imports

import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import EditPaymentMethodsForm from '../../forms/edit-payment-methods-form';
import { getPaymentMethods } from '../../../actions/payment-methods';
import EditAddressesForm from '../../forms/edit-addresses-form';
import EditAccountForm from '../../forms/edit-account-form';
import EditCompanyForm from '../../forms/edit-company-form';
import { updateNavColor } from '../../../actions/ui';
import { FlexRow, FlexColumn } from '../../layouts';

// Account

class AccountPage extends Component {

  constructor(props) {
    super(props);
    this.state = this.initialState();
  }

  initialState() {
    return {};
  }

  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    updateNavColor: PropTypes.func.isRequired,
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.updateNavColor("secondaryBg");
    this.props.getPaymentMethods();
  }

  render() {
    const { isAuthenticated } = this.props;
    if (!isAuthenticated) {
      return <Redirect to="/login" />;
    }
    return (
        <FlexRow bg="white" alignItems="flex-start" justifyContent="center" flexWrap="nowrap">
          {/* <AccountNav display={["none", "flex"]} bg="white" flexBasis={["0", "20%"]} minWidth="200px"/> */}
          <FlexColumn alignItems="center" bg="white" flexBasis={["100%", "60%"]} px={["40px", "0"]}>
            <EditAccountForm mt="16px" zIndex="10"/>
            <EditCompanyForm mt="100px" zIndex="9"/>
            <EditAddressesForm mt="100px" zIndex="8"/>
            <EditPaymentMethodsForm mt="100px" zIndex="7"/>
          </FlexColumn>
        </FlexRow>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.authReducer.isAuthenticated,
});

export default connect(
  mapStateToProps,
  { getPaymentMethods,
    updateNavColor }
)(AccountPage)



// Imports

import React, {Component, Fragment} from 'react';
import {Link, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import ReceiptCard from '../../cards/receipt-card/receipt-card';
import {getUserSheets} from '../../../actions/sheets';
import {getCharges} from '../../../actions/charges';
import {updateNavColor} from '../../../actions/ui';
import {Section, FlexRow} from '../../layouts';
import {Charge} from '../charges/charge';
import {Button} from '../../buttons';
import {Title} from '../../headers';

// Receipt

class ReceiptPage extends Component {
  static propTypes = {
    updateNavColor: PropTypes.func.isRequired,
    getUserSheets: PropTypes.func.isRequired,
    getCharges: PropTypes.func.isRequired,
    charges: PropTypes.array.isRequired,
  };

  componentWillMount() {
    this.props.updateNavColor('primaryBg');
  }

  componentDidMount() {
      window.scrollTo(0, 0);
      this.props.getCharges();
      this.props.getUserSheets();
  }

  render() {
    const {isAuthenticated, charges} = this.props;
    const { match: { params: {chargeId} } } = this.props;
    let charge = null;
    try {
        charge = charges.filter(charge => parseInt(charge.id) === parseInt(chargeId))[0];
    } catch {}
    if (!isAuthenticated) {
      return <Redirect to="/login" />;
    }
    if (charge === undefined) {
        return <Redirect to="/" />;
    }
    return (
      <Fragment>
        <Section
          alignItems="center"
          bg="primaryBg"
          flexDirection="column"
          justifyContent="flex-start"
          minHeight={500}
          px={['20px', '60px']}
          pt="40px"
        >
          <img
            alt="Order Confirmation"
            src="/order-confirmation.png"
            style={{height: '200px', marginTop: '48px', width: '200px'}}
          />
          <Title mt="40px" mb="0" variant="xLarge">
            Thank You!
          </Title>
          <Title mt="16px" mb="0" fontWeight="400 !important" variant="small">
            Your order has been confirmed.
          </Title>
          <FlexRow justifyContent={["center", "space-between"]} flexWrap="wrap" mt="84px">
              <ReceiptCard order="1" title='Go to Dashboard' img="/order-conf-dashboard.png" description="Reserve your brain power. We'll guide you through each step of the process with clear questions and directions." />
              <ReceiptCard order="2" title='Locate Purchased Sheet' img="/order-conf-edit.png" description="Reserve your brain power. We'll guide you through each step of the process with clear questions and directions." />
              <ReceiptCard order="3" title='Complete Sheet' img="/order-conf-locate.png" description="Reserve your brain power. We'll guide you through each step of the process with clear questions and directions." />
          </FlexRow>
          <Button as={Link} variant="box" to="/" mt="48px" mb="112px" width="160px">
            Go to Dashboard
          </Button>
          <Charge charge={charge}/>
          <Button as={Link} variant="box" to="/orders" mt="52px" mb="64px" width="160px">
            View Order History
          </Button>
        </Section>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.authReducer.isAuthenticated,
  charges: state.chargeReducer.charges,
});

ReceiptPage.defaultProps = {
    charges: [],
}

export default connect(
  mapStateToProps,
  {
    updateNavColor,
    getCharges,
    getUserSheets,
  }
)(ReceiptPage);

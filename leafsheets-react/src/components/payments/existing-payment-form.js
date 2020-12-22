// Imports

import { FaRegTrashAlt, FaRegCheckCircle } from 'react-icons/fa';
import { MdRadioButtonUnchecked } from 'react-icons/md';
import { space, flexbox } from 'styled-system';
import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react'
import _ from 'lodash';

import { updatePaymentMethod, deletePaymentMethod } from '../../actions/payment-methods';
import { beginLoading, endLoading } from '../../actions/ui';
import { imagePathForCardBrand } from '../../utils/stripe';
import { FlexColumn, FlexRow } from '../layouts';
import { Paragraph } from '../paragraph';
import { ClickableIcon } from '../icons';
import { Input } from '../inputs';


// Helpers

const Checkmark = styled.span(space, flexbox);

// Form

class ExistingPaymentForm extends React.Component {

  constructor(props) {
    super(props);
    this.autocomplete = null;
    this.updatePaymentMethod = this.updatePaymentMethod.bind(this);
    this.deletePaymentMethod = this.deletePaymentMethod.bind(this);
  }

  static propTypes = {
    paymentMethods: PropTypes.array.isRequired,
    beginLoading: PropTypes.func.isRequired,
    endLoading: PropTypes.func.isRequired,
    updatePaymentMethod: PropTypes.func.isRequired,
    deletePaymentMethod: PropTypes.func.isRequired,
  }

  async updatePaymentMethod(paymentMethodId) {
    this.props.beginLoading({
      title: "Updating Payment Method",
      subtitle: "Please wait while we set your new default payment method."
    });
    await this.props.updatePaymentMethod(paymentMethodId, true);
    this.props.endLoading();
  }

  async deletePaymentMethod(paymentMethodId) {
    this.props.beginLoading({
      title: "Deleting Payment Method",
      subtitle: "Please wait while we delete your payment method."
    });
    await this.props.deletePaymentMethod(paymentMethodId);
    this.props.endLoading();
  }

  render() {
    const { paymentMethods, activePaymentMethodID, editing=false, ...styleProps } = this.props;
    const minWidth = editing ? "none" : "600px";
    let py = "8px";
    if (paymentMethods.length === 1) { py = "0px" }
    return (
      <FlexColumn {...styleProps} maxWidth={["100%", "600px"]} minWidth={["none", minWidth]} width="100%">
        <FlexRow px="20px" py={py} borderRadius="4px" bg="white" border="1px solid #b2bfc4" justifyContent="space-between">
          {_.sortBy(paymentMethods, ['id']).map((paymentMethod, index) => {
              let borderBottom = "1px solid #b2bfc4";
              const isDefault = paymentMethod.default;
              const checked = (parseInt(activePaymentMethodID) === parseInt(paymentMethod.id))
              if (paymentMethods.length === 1 || index === (paymentMethods.length - 1)) { borderBottom = "none"; }
              return (
                <FlexRow py="8px" flexWrap="nowrap" width="100%" alignItems="center" as="label" className="radio-container" key={paymentMethod.id} borderBottom={borderBottom}>
                    { !editing && checked === true && <Input checked type="radio" variant="self" name="activePaymentMethodID" value={paymentMethod.id}  onChange={this.props.handleChange} /> }
                    { !editing && checked === false && <Input type="radio" variant="self" name="activePaymentMethodID" value={paymentMethod.id}  onChange={this.props.handleChange} /> }
                    { !editing && <Checkmark flexBasis="15%" height={["90px", "48px"]}  mr="20px" className="radio-checkmark" /> }
                    <FlexRow height={["90px", "48px"]} my="0" flexWrap="wrap" alignItems="center" justifyContent="space-between">
                        <FlexRow justifyContent="flex-start" flexGrow={1} width="auto">
                          <img alt="Credit Card" src={imagePathForCardBrand(paymentMethod.brand)} 
                            style={{ height: "30px", width: "auto", marginRight: "8px", borderRadius: "4px", border: "1px solid rgba(0,0,0,0.06)"}} />
                          <Paragraph display={["none", "block"]} mb="0px" height="30px" lineHeight="30px !important" variant="medium">
                             ends in <b>{ paymentMethod.last_4 }</b>
                          </Paragraph>
                          <Paragraph display={["block", "none"]} mb="0px" height="30px" lineHeight="30px !important" variant="medium">
                             <b>{ paymentMethod.last_4 }</b>
                          </Paragraph>
                        </FlexRow>
                        <Paragraph mb="0px" flexBasis="auto" height="30px" lineHeight="30px !important" variant="medium">
                          Exp <b>{ paymentMethod.exp_month }/{ paymentMethod.exp_year - 2000 }</b>
                        </Paragraph>
                        { editing && isDefault && <ClickableIcon data-tip="Default Payment Method" data-for='default' ml="6px" icon={[<FaRegCheckCircle color="#30E1A5" style={{height: "16px", width: "16px"}} variant="button" />]} />}
                        { editing && !isDefault && 
                          <ClickableIcon 
                            onClick={(e) => { this.updatePaymentMethod(paymentMethod.id) }}
                            data-tip="Make Default Payment Method"
                            data-for='make-default' ml="6px" 
                            icon={[<MdRadioButtonUnchecked color="#b2bfc4" style={{height: "18px", width: "18px"}} 
                            variant="button" />]} />}
                        { editing && 
                          <ClickableIcon 
                            onClick={(e) => { this.deletePaymentMethod(paymentMethod.id) }}
                            data-tip="Delete Payment Method" 
                            data-for='delete' ml="6px" 
                            icon={[<FaRegTrashAlt  color="red" style={{height: "16px", width: "16px"}} 
                            variant="button" />]} />}
                        <ReactTooltip id="default" />
                        <ReactTooltip id="make-default" />
                        <ReactTooltip id="delete" />
                    </FlexRow>
                </FlexRow> 
              )
          })}
          {paymentMethods.length === 0 && <>No Payment Methods</>}
        </FlexRow>
      </FlexColumn>
    )
  }
}

const mapStateToProps = state => ({
  paymentMethods: state.paymentMethodsReducer.paymentMethods,
})

ExistingPaymentForm.defaultProps = {
  paymentMethods: [],
}

export default connect(
  mapStateToProps,
  { 
    beginLoading,
    endLoading,
    deletePaymentMethod,
    updatePaymentMethod
  }
)(ExistingPaymentForm);
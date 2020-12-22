// Imports

import { FaRegTrashAlt, FaRegCheckCircle } from 'react-icons/fa';
import { MdRadioButtonUnchecked } from 'react-icons/md';
import { space, flexbox } from 'styled-system';
import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';

import { updateAddress, deleteAddress } from '../../actions/addresses';
import { beginLoading, endLoading } from '../../actions/ui';
import { FlexColumn, FlexRow } from '../layouts';
import { Paragraph } from '../paragraph';
import { ClickableIcon } from '../icons';
import { Input } from '../inputs';

// Helpers

const Checkmark = styled.span(space, flexbox);

// Form

class ExistingAddressForm extends React.Component {

  constructor(props) {
    super(props);
    this.autocomplete = null;
  }

  static propTypes = {
    billingAddresses: PropTypes.array.isRequired,
    shippingAddresses: PropTypes.array.isRequired,
    beginLoading: PropTypes.func.isRequired,
    endLoading: PropTypes.func.isRequired,
    deleteAddress: PropTypes.func.isRequired,
    updateAddress: PropTypes.func.isRequired,
  }

  async updateAddress(addressId) {
    this.props.beginLoading({
      title: "Updating Address",
      subtitle: "Please wait while we set your new default address."
    });
    await this.props.updateAddress(addressId, true);
    this.props.endLoading();
  }

  async deleteAddress(addressId) {
    this.props.beginLoading({
      title: "Deleting Address",
      subtitle: "Please wait while we delete your address."
    });
    await this.props.deleteAddress(addressId);
    this.props.endLoading();
  }

  render() {
    const { addressType, activeAddressID, editing=false, ...styleProps } = this.props;
    const minWidth = editing ? "none" : "600px";
    let addresses = []
    if (addressType && addressType === 'shipping') {
        addresses = this.props.shippingAddresses;
    } else {
        addresses = this.props.billingAddresses;
    }
    let py = "8px"
    if (addresses.length === 1) { py = "0px" }
    return (
      <FlexColumn {...styleProps} maxWidth={["100%", "600px"]} minWidth={["none", minWidth]} width="100%">
        <FlexRow px="20px" py={py} borderRadius="4px" bg="white" border="1px solid #b2bfc4" justifyContent="space-between">
            {_.sortBy(addresses, ['id']).map((address, index) => {
                let borderBottom = "1px solid #b2bfc4";
                const isDefault = address.default;
                const checked = (parseInt(activeAddressID) === parseInt(address.id))
                if (addresses.length === 1 || index === (addresses.length - 1)) { borderBottom = "none"; }
                return (
                    <FlexRow py="8px" flexWrap="nowrap" width="100%" alignItems="center" as="label" className="radio-container" key={address.id} borderBottom={borderBottom}>
                        { !editing && checked === true && <Input checked type="radio" variant="self" name="activeAddressID" value={address.id}  onChange={this.props.handleChange} /> }
                        { !editing && checked === false && <Input type="radio" variant="self" name="activeAddressID" value={address.id}  onChange={this.props.handleChange} /> }
                        { !editing && <Checkmark flexBasis="15%" height={["90px", "48px"]}  mr="20px" className="radio-checkmark" />}
                        <FlexRow height={["90px", "48px"]} my="0" flexWrap="wrap" alignItems="center" justifyContent="flex-start">
                            <Paragraph mb="0px" flexBasis={["100%", "auto"]} height="30px" lineHeight="30px !important" variant="medium">
                                <b>{address.first_name} {address.last_name} &nbsp;</b>
                            </Paragraph>
                            <Paragraph mb="0px" flexBasis={["100%", "auto"]} height="30px" lineHeight="30px !important" variant="medium">
                                {address.street_2} {address.street_1} &nbsp;
                            </Paragraph>
                            <Paragraph mb="0px" flexBasis={["100%", "auto"]} height="30px" lineHeight="30px !important" variant="medium">
                                {address.city}, {address.state} {address.postal}  
                            </Paragraph>
                        </FlexRow>
                        { editing && isDefault && <ClickableIcon data-tip="Default Address" data-for="default" ml="6px" icon={[<FaRegCheckCircle color="#30E1A5" style={{height: "16px", width: "16px"}} variant="button" />]} />}
                        { editing && !isDefault && 
                          <ClickableIcon 
                            onClick={(e) => { this.updateAddress(address.id) }}
                            data-tip="Make Default Address"
                            data-for='make-default' ml="6px" 
                            icon={[<MdRadioButtonUnchecked color="#b2bfc4" style={{height: "18px", width: "18px"}} 
                            variant="button" />]} />}
                        { editing && 
                          <ClickableIcon 
                            onClick={(e) => { this.deleteAddress(address.id) }}
                            data-tip="Delete address" 
                            data-for='delete' ml="6px" 
                            icon={[<FaRegTrashAlt  color="red" style={{height: "16px", width: "16px"}} 
                            variant="button" />]} />}
                        <ReactTooltip id="default" />
                        <ReactTooltip id="make-default" />
                        <ReactTooltip id="delete" />
                    </FlexRow>
                )
            })}
            {addresses.length === 0 && <>No Addresses</>}
        </FlexRow>
      </FlexColumn>
    )
  }
}

const mapStateToProps = state => ({
    billingAddresses: state.addressesReducer.billingAddresses,
    shippingAddresses: state.addressesReducer.shippingAddresses,
  });
  
ExistingAddressForm.defaultProps = {
  billingAddresses: [],
  shippingAddresses: [],
}
  
export default connect(
  mapStateToProps,
  { 
    endLoading,
    beginLoading,
    deleteAddress,
    updateAddress
  }
)(ExistingAddressForm)
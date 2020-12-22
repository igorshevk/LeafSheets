// Imports

import {space, flexbox} from 'styled-system';
import styled from 'styled-components';
import {connect} from 'react-redux';
import React from 'react';

import {beginLoading, endLoading} from '../../actions/ui';
import {addAddress} from '../../actions/addresses';
import {FlexColumn, FlexRow} from '../layouts';
import {Paragraph} from '../paragraph';
import {Input} from '../inputs';

// Helpers

const Checkmark = styled.span(space, flexbox);

// Form

class AddressForm extends React.Component {
  constructor(props) {
    super(props);
    this.autocomplete = null;
    this.state = this.initialState();
    this.handleChange = this.handleChange.bind(this);
    this.handleCheckbox = this.handleCheckbox.bind(this);
    this.handlePlaceSelect = this.handlePlaceSelect.bind(this);
    this.addAddress = this.addAddress.bind(this);
    this.validate = this.validate.bind(this);
  }

  initialState() {
    return {
      activeAddressID: null,
      google_place: null,
      formatted_address: '',
      first_name: '',
      last_name: '',
      street_address_1: '',
      street_address_2: '',
      city: '',
      state: '',
      zip_code: '',
      google_map_link: '',
      kind: 'B',
      make_default_address: true,
    };
  }

  componentDidMount() {
    const google = window.google;
    this.autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('autocomplete'),
      {}
    );
    this.autocomplete.addListener('place_changed', this.handlePlaceSelect);
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value}, () => {
      this.validate();
    });
  }

  handleCheckbox(event) {
    this.setState({[event.target.name]: event.target.checked});
  }

  handlePlaceSelect() {
    let addressObject = this.autocomplete.getPlace();
    let address = addressObject.address_components;
    if (address && address[0] && address[1] && address[3] && address[5] && address[7]) {
      this.setState(
        {
          google_place: addressObject,
          formatted_address: addressObject.formatted_address,
          name: addressObject.name,
          street_address_1:
            address[0] && address[1] && `${address[0].long_name} ${address[1].long_name}`,
          city: address[3] && address[3].long_name,
          state: address[5] && address[5].short_name,
          zip_code: address[7] && address[7].short_name,
          google_map_link: addressObject.url,
        },
        () => {
          document.getElementById('autocomplete').value = this.state.street_address_1;
          this.validate();
        }
      );
    }
  }

  validate() {
    const {
      google_place,
      first_name,
      last_name,
      street_address_1,
      street_address_2,
      city,
      state,
      zip_code,
    } = this.state;
    const user_address = {
      first_name,
      last_name,
      street_1: street_address_1,
      street_2: street_address_2,
      city,
      state,
      postal: zip_code,
    };
    this.props.saveEnabled && this.props.saveEnabled({google_place, user_address});
  }

  async addAddress() {
    if (this.props.sendActions === true) {
      const titles = {
        title: 'Adding Address',
        subtitle: "We're saving your address. Thanks for your patience.",
      };
      this.props.beginLoading(titles);
    }
    const {
      google_place,
      kind,
      make_default_address,
      first_name,
      last_name,
      street_address_1,
      street_address_2,
      city,
      state,
      zip_code,
    } = this.state;
    const user_address = {
      first_name,
      last_name,
      street_1: street_address_1,
      street_2: street_address_2,
      city,
      state,
      postal: zip_code,
    };
    let addresses = await this.props.addAddress({
      google_place,
      user_address,
      kind,
      makeDefaultAddress: make_default_address,
    });
    addresses.sort((a, b) => b.id - a.id);
    if (this.props.sendActions === true && addresses[0] !== undefined) {
      this.props.endLoading();
    }
    this.clearForm();
    return addresses[0];
  }

  clearForm() {
    const initialState = this.initialState();
    this.setState(initialState);
    const autocompleteField = document.getElementById('autocomplete');
    if (autocompleteField !== null) {
      autocompleteField.value = '';
    }
    this.props.saveEnabled && this.props.saveEnabled();
  }

  render() {
    this.validate();
    return (
      <FlexColumn maxWidth="600px">
        <FlexRow justifyContent="space-between">
          <Input
            variant="half"
            name={'first_name'}
            value={this.state.first_name}
            placeholder={'First'}
            onChange={this.handleChange}
          />
          <Input
            variant="half"
            name={'last_name'}
            value={this.state.last_name}
            placeholder={'Last'}
            onChange={this.handleChange}
          />
          <Input
            id="autocomplete"
            variant="twoThird"
            className="input-field"
            ref="input"
            type="text"
            name={'street_address_1'}
            placeholder={'Street Address'}
            value={this.street_address_1}
            onChange={e => {
              this.handleChange(e);
              if (this.props.handleChange) {
                this.props.handleChange(e);
              }
            }}
          />
          <Input
            variant="third"
            name={'street_address_2'}
            value={this.state.street_address_2}
            placeholder={'Apt, Suite, Etc.'}
            onChange={this.handleChange}
          />
          <Input
            variant="third"
            name={'city'}
            value={this.state.city}
            placeholder={'City'}
            onChange={this.handleChange}
          />
          <Input
            variant="third"
            name={'state'}
            value={this.state.state}
            placeholder={'State'}
            onChange={this.handleChange}
          />
          <Input
            variant="third"
            name={'zip_code'}
            value={this.state.zip_code}
            placeholder={'Zipcode'}
            onChange={this.handleChange}
          />
          <FlexRow as="label" className="checkbox-container" flexWrap="nowrap">
            {this.state.make_default_address === true && (
              <Input
                checked
                type="checkbox"
                name={'make_default_address'}
                onChange={this.handleCheckbox}
              />
            )}
            {this.state.make_default_address === false && (
              <Input
                type="checkbox"
                name={'make_default_address'}
                onChange={this.handleCheckbox}
              />
            )}
            <Checkmark
              flexBasis="15%"
              height={['90px', '48px']}
              mr="10px"
              className="checkbox-checkmark"
            />
            <Paragraph
              mb="0px"
              height="30px"
              lineHeight="30px !important"
              variant="small"
            >
              Save as default
            </Paragraph>
          </FlexRow>
        </FlexRow>
      </FlexColumn>
    );
  }
}

export default connect(
  null,
  {
    addAddress,
    beginLoading,
    endLoading,
  },
  null,
  {forwardRef: true}
)(AddressForm);

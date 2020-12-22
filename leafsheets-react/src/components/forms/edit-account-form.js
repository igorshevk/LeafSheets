// Imports

import NumericInput from 'react-numeric-input';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Select from 'react-select';
import _ from 'lodash';

import {beginLoading, endLoading} from '../../actions/ui';
import {loadUser, updateUser} from '../../actions/auth';
import {selectStyles} from '../inputs/styles/select';
import {numericStyles} from '../inputs/numeric';
import {FlexColumn, FlexRow} from '../layouts';
import {FillForm} from './form-extras';
import {Paragraph} from '../paragraph';
import {userOptions} from './options';
import {Button} from '../buttons';
import {Title} from '../headers';
import {Input} from '../inputs';

// Helpers

const userOptionForValue = value => {
  const option = userOptions.filter(dict => dict.value === value)[0];
  if (option !== undefined) {
    return option.label;
  } else {
    return null;
  }
};

// Edit Account Form

class EditAccountForm extends Component {
  
  constructor(props) {
    super(props);
    this.state = this.initialState();
    this.saveEnabled = this.saveEnabled.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateUserState = this.updateUserState.bind(this);
    this.handleNumericChange = this.handleNumericChange.bind(this);
    this.handlePositionChange = this.handlePositionChange.bind(this);
  }

  static propTypes = {
    loadUser: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    updateUser: PropTypes.func.isRequired,
    beginLoading: PropTypes.func.isRequired,
    endLoading: PropTypes.func.isRequired,
  };

  initialState() {
    return {
      existingUser: null,
      pendingUser: {
        full_name: '',
        email: '',
        phone: '',
        position: '',
        ownership: '',
      },
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.user !== this.props.user) {
      this.updateUserState(this.props.user);
    }
  }

  componentDidMount() {
    if (this.state.existingUser === null && this.props.user !== null) {
      this.updateUserState(this.props.user);
    }
  }

  handleChange(event) {
    this.setState({
      pendingUser: {...this.state.pendingUser, [event.target.name]: event.target.value},
    });
  }

  handleNumericChange(event) {
    this.setState({
      pendingUser: {...this.state.pendingUser, ownership: event},
    });
  }

  handlePositionChange(event) {
    this.setState({
      pendingUser: {...this.state.pendingUser, position: event.value},
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const user = this.state.pendingUser;
    const filteredUser = Object.fromEntries(
      Object.entries(user).filter(([k, v]) => v !== this.state.existingUser[k])
    );
    this.props.beginLoading({
      title: 'Updating Account',
      subtitle: 'Please wait while we update your account information.',
    });
    this.props.updateUser(filteredUser);
    this.props.endLoading();
  }

  updateUserState(user) {
    this.setState({
      existingUser: {
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        position: user.position,
        ownership: user.ownership,
      },
      pendingUser: {
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        position: user.position,
        ownership: user.ownership,
      },
    });
  }

  saveEnabled() {
    return !_.isEqual(this.state.existingUser, this.state.pendingUser);
  }

  render() {
    const saveEnabled = this.saveEnabled();
    if (this.state.existingUser === null) {
      return null;
    }
    const pendingUserPosition = this.state.pendingUser.position;
    let defaultUserPosition = null;
    if (pendingUserPosition && pendingUserPosition !== undefined) {
      defaultUserPosition = {
        label: userOptionForValue(pendingUserPosition),
        value: pendingUserPosition,
      };
    }
    return (
      <>
        <FlexRow
          mt={this.props.mt}
          zIndex={this.props.zIndex}
          width="100%"
          justifyContent="flex-start"
          alignItems="flex-start"
          flexWrap="wrap"
        >
          <FillForm onSubmit={this.handleSubmit}>
            <FlexColumn alignItems="flex-start">
              <FlexRow
                mb="24px"
                justifyContent="space-between"
                alignItems="center"
                height="40px"
                zIndex="9"
                flexWrap="nowrap"
              >
                <FlexRow
                  flexBasis={['100%', '75%']}
                  maxWidth={['100%', '600px']}
                  minWidth={['0', '540px']}
                  justifyContent="space-between"
                >
                  <Title mb="0" variant="medium">
                    Account
                  </Title>
                  <Button
                    disabled={!saveEnabled}
                    bg={saveEnabled ? 'accent !important' : 'lightGrey !important'}
                    variant="save"
                    onSubmit={this.handleSubmit}
                  >
                    Save
                  </Button>
                </FlexRow>
                <FlexColumn
                  height="0px"
                  maxWidth="400px"
                  flexBasis={['0%', '25%']}
                  minWidth="0"
                  width="100%"
                  justifyContent="flex-start"
                ></FlexColumn>
              </FlexRow>
              <FlexRow justifyContent="flex-start" alignItems="flex-start">
                <FlexRow
                  flexBasis={['100%', '75%']}
                  maxWidth="600px"
                  minWidth={['0', '540px']}
                  justifyContent="space-between"
                  mr={['0', '40px']}
                >
                  <Input
                    variant="full"
                    name={'full_name'}
                    value={this.state.pendingUser.full_name}
                    placeholder="Name"
                    onChange={this.handleChange}
                  />
                  <Input
                    variant="full"
                    name={'email'}
                    value={this.state.pendingUser.email}
                    placeholder="Email"
                    onChange={this.handleChange}
                  />
                  <Input
                    variant="full"
                    name={'phone'}
                    value={this.state.pendingUser.phone}
                    placeholder={'Phone'}
                    onChange={this.handleChange}
                  />
                  <FlexRow flexBasis={['48%', '48%']}>
                    <Select
                      styles={selectStyles}
                      placeholder="Position"
                      options={userOptions}
                      name={'position'}
                      value={defaultUserPosition}
                      onChange={this.handlePositionChange}
                    />
                  </FlexRow>
                  <FlexRow flexBasis={['48%', '48%']}>
                    <NumericInput
                      strict
                      min={0}
                      max={100}
                      name={'ownership'}
                      value={this.state.pendingUser.ownership}
                      onChange={this.handleNumericChange}
                      style={numericStyles}
                      placeholder="% Ownership"
                      format={num => {
                        return num + ' %';
                      }}
                    />
                  </FlexRow>
                </FlexRow>
                <FlexColumn
                  maxWidth="400px"
                  flexBasis={['100%', '25%']}
                  flexGrow="1"
                  minWidth="none"
                  width="100%"
                  justifyContent="flex-start"
                  mt={['8px', '0']}
                  pr="40px"
                >
                  <Paragraph>
                    <b>Tips:</b> Fusce vehicula dolor arcu, sit amet blandit dolor mollis
                    nec. Donec viverra eleifend lacus, vitae ullamcorper metus.
                  </Paragraph>
                  <Paragraph>
                    <b>Use Case:</b> Sed sollicitudin ipsum quis nunc sollicitudin
                    ultrices. Donec euismod scelerisque ligula. Maecenas eu va.
                  </Paragraph>
                </FlexColumn>
              </FlexRow>
            </FlexColumn>
          </FillForm>
        </FlexRow>
      </>
    );
  }
}

const mapStateToProps = state => ({
  user: state.authReducer.user,
});

EditAccountForm.defaultProps = {
  user: null,
};

export default connect(
  mapStateToProps,
  {
    loadUser,
    updateUser,
    beginLoading,
    endLoading,
  }
)(EditAccountForm);

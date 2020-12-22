// Imports

import { space, flexbox } from 'styled-system';
import React, {Component} from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {beginLoading, endLoading} from '../../actions/ui';
import {createMessage} from '../../actions/messages';
import {FlexColumn, FlexRow} from '../layouts';
import { colors } from '../../styles/colors';
import {register} from '../../actions/auth';
import {Paragraph} from '../paragraph';
import {FillForm} from './form-extras';
import {Button} from '../buttons';
import {Title} from '../headers';
import {Input} from '../inputs';
import {LinkTo} from '../links';

// Styles

const InlineLink = styled(LinkTo)`
  & *,
  & *:visited {
    background-color: transparent;
    font-family: Barlow;
    font-weight: 400;
    line-height: 20px;
    color: ${colors.grey};
  }  
  & *:hover {
    color: ${colors.accent};
  }
`

// Helpers

const Checkmark = styled.span(space, flexbox);

// Login Form

class RegisterForm extends Component {
  constructor(props) {
    super(props);
    this.state = this.initialState();
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.handleCheckbox = this.handleCheckbox.bind(this);
  }

  static propTypes = {
    register: PropTypes.func.isRequired,
  };

  initialState() {
      return {
          email: "",
          password1: "",
          password2: "",
          registerEnabled: false,
          agreeToTermAndConditions: false,
      };
  }

  handleSubmit(e) {
      e.preventDefault();
      const {email, password1, password2, agreeToTermAndConditions} = this.state;
      this.props.beginLoading({
          title: "Creating Account",
          subtitle: "Please be partient while we create your new account."
      });
      if (password1 !== password2) { 
          this.props.createMessage({passwordsNotMatch: 'Your passwords do not match'});
      };
      if (agreeToTermAndConditions !== true) {
        this.props.createMessage({passwordsNotMatch: 'You have not aggree to the Term and Conditions'});
      }
      const newUser = {email: email, password: password1}
      this.props.register(newUser);
      this.props.endLoading();
  };

  handleChange(e) {
      this.setState({[e.target.name]: e.target.value}, () => {
          this.validateForm();
      });
  }

  handleCheckbox(event) {
    this.setState({[event.target.name]: event.target.checked}, () => {
        this.validateForm();
    });
  }
  
  validateForm() {
      let enabled = true;
      if ( this.state.email.length < 1) { enabled = false };
      if ( this.state.password1.length < 1) { enabled = false };
      if ( this.state.password2.length < 1) { enabled = false };
      if ( this.state.password1 !== this.state.password2 ) { enabled = false };
      if ( this.state.agreeToTermAndConditions !== true) { enabled = false};
      this.setState({ registerEnabled : enabled });
  }
  
  render() {
    return (
        <>
            <FillForm {...this.props} onSubmit={this.handleSubmit}>
                <FlexColumn alignItems="flex-start" pl={["none","60px"]}>
                    <Title mb="16px" variant="large">Register</Title>
                    <FlexRow alignItems="center" justifyContent="flex-start">
                        <InlineLink to="/login" mb="24px" fontSize="13px" lineHeight="20px">
                            Already have an account?
                        </InlineLink>
                    </FlexRow>
                    <FlexRow>
                        <Input
                            type="email"
                            variant="full"
                            name={'email'}
                            value={this.state.email}
                            placeholder={'Email'}
                            autoComplete="email"
                            onChange={this.handleChange}
                        />
                        <Input
                            type="password"
                            variant="full"
                            name={'password1'}
                            value={this.state.password1}
                            placeholder={'Password'}
                            autoComplete="current-password"
                            onChange={this.handleChange}
                        />
                        <Input
                            type="password"
                            variant="full"
                            name={'password2'}
                            value={this.state.password2}
                            placeholder={'Repeat Password'}
                            autoComplete="current-password"
                            onChange={this.handleChange}
                        />
                        <FlexRow as="label" className="checkbox-container" flexWrap="nowrap" flexBasis="100%">
                            <Input checked={this.state.agreeToTermAndConditions} type="checkbox" name="agreeToTermAndConditions" onChange={this.handleCheckbox} />
                            <Checkmark flexBasis="15%" height={["90px", "48px"]}  mr="10px" className="checkbox-checkmark" />
                            <Paragraph mb="0px" height="30px" lineHeight="30px !important" variant="small">
                                I agree to the Term and Conditions
                            </Paragraph>
                        </FlexRow>
                        <Button
                            disabled={!this.state.registerEnabled}
                            variant="purchase"
                            onSubmit={this.handleSubmit}
                            mt="48px"
                        >
                            SIGN UP
                        </Button>
                    </FlexRow>
                </FlexColumn>
            </FillForm>
        </>
    )
  }
}

export default connect(
  null,
  {
      register,
      createMessage,
      beginLoading,
      endLoading
  }
)(RegisterForm);

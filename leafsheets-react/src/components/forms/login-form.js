// Imports

import React, {Component} from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import { beginLoading, endLoading } from '../../actions/ui';
import {FlexColumn, FlexRow} from '../layouts';
import { colors } from '../../styles/colors';
import {login} from '../../actions/auth';
import {FillForm} from './form-extras';
import {Paragraph} from '../paragraph';
import {Button} from '../buttons';
import {Title} from '../headers';
import {LinkTo} from '../links';
import {Input} from '../inputs';

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

// Login Form

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = this.initialState();
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateForm = this.validateForm.bind(this);
  }

  static propTypes = {
    login: PropTypes.func.isRequired,
  };

  initialState() {
    return {
      email: "",
      password: "",
      loginEnabled: false,
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.beginLoading({
        title: "Logging In",
        subtitle: "Please be patient while we log you in."
    });
    this.props.login(this.state.email, this.state.password);
    this.props.endLoading();
  };

  handleChange(e) {
    this.setState({[e.target.name]: e.target.value}, () => {
        this.validateForm();
    });
  };

  validateForm() {
    const enabled = (this.state.email.length > 0 && this.state.password.length > 0)
    this.setState({ loginEnabled : enabled });
  }

  render() {
    return (
      <>
        <FillForm {...this.props} onSubmit={this.handleSubmit}>
          <FlexColumn alignItems="flex-start" pl={["none","60px"]}>
            <Title mb="16px" variant="large">Login</Title>
            <FlexRow alignItems="center" justifyContent="flex-start">
              <Paragraph mr="4px" mb="24px" variant="small">
                Not a member yet?
              </Paragraph>
              <InlineLink to="/register" mb="24px" fontSize="13px" lineHeight="20px">
                  Sign up here!
              </InlineLink>
            </FlexRow>
            <FlexRow>
              <Input
                type="text"
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
                name={'password'}
                value={this.state.password}
                placeholder={'Password'}
                autoComplete="current-password"
                onChange={this.handleChange}
              />
            </FlexRow>
            {/* <InlineLink 
                to="/register"
                fontSize="13px"
                lineHeight="20px"
            >
                Forgot Password?
            </InlineLink> */}
            <Button
                disabled={!this.state.loginEnabled}
                variant="purchase"
                onSubmit={this.handleSubmit}
                mt="48px"
            >
                LOGIN
            </Button>
          </FlexColumn>
        </FillForm>
      </>
    );
  }
}

export default connect(
  null,
  { 
      login,
      beginLoading,
      endLoading
  }
)(LoginForm);

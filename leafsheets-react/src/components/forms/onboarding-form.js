// Imports

import NumericInput from 'react-numeric-input';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Select from 'react-select';

import {
  userOptions,
  incOptions,
  newOptions,
  categoryOptions,
  useCaseOptions,
} from './options';
import {updateCompany, updateCompanyIcon, getCompanies} from '../../actions/companies';
import {beginLoading, endLoading, redirectTo} from '../../actions/ui';
import {loadUser, updateUser} from '../../actions/auth';
import {createMessage} from '../../actions/messages';
import {returnErrors} from '../../actions/errors';
import {selectStyles} from '../inputs/styles/select';
import {stateOptions} from '../../utils/us-states';
import {numericStyles} from '../inputs/numeric';
import {FlexColumn, FlexRow} from '../layouts';
import Dropzone from '../inputs/drag-n-drop';
import {FillForm} from './form-extras';
import {Paragraph} from '../paragraph';
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

const optionForValue = (options, value) => {
  const option = options.filter(dict => dict.value === value)[0];
  if (option !== undefined) {
    return option.label;
  } else {
    return null;
  }
};

// Edit Account Form

class OnboardingForm extends Component {
  constructor(props) {
    super(props);
    this.state = this.initialState();
    this.saveIcon = this.saveIcon.bind(this);
    this.saveEnabled = this.saveEnabled.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateUser = this.validateUser.bind(this);
    this.validateCompany = this.validateCompany.bind(this);
    this.updateUserState = this.updateUserState.bind(this);
    this.updateCompanyState = this.updateCompanyState.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleCompanyChange = this.handleCompanyChange.bind(this);
    this.handleNumericChange = this.handleNumericChange.bind(this);
    this.handleContinueButton = this.handleContinueButton.bind(this);
    this.handleUserSelectChange = this.handleUserSelectChange.bind(this);
    this.handleCompanySelectChange = this.handleCompanySelectChange.bind(this);
  }

  static propTypes = {
    //  User
    loadUser: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    updateUser: PropTypes.func.isRequired,
    // Company
    company: PropTypes.object,
    updateCompany: PropTypes.func.isRequired,
    // UI
    beginLoading: PropTypes.func.isRequired,
    endLoading: PropTypes.func.isRequired,
    // Messages & Errors
    createMessage: PropTypes.func.isRequired,
    returnErrors: PropTypes.func.isRequired,
    // Redirection
    redirectTo: PropTypes.func.isRequired,
  };

  initialState() {
    return {
      position: 'welcome',
      user: {
        full_name: '',
        position: '',
        ownership: '',
      },
      company: {
        state: '',
        name: '',
        type_of_inc: '',
        category: '',
        new_status: '',
        use_case: '',
        icon_url: '',
      },
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.company !== this.props.company) {
      this.updateCompanyState(this.props.company);
    }
    if (prevProps.user !== this.props.user) {
      this.updateUserState(this.props.user);
    }
  }

  componentDidMount() {
    this.props.loadUser();
    this.props.getCompanies();
  }

  handleCompanyChange(target, event) {
    this.setState({company: {...this.state.company, [target]: event.target.value}});
  }

  handleUserChange(target, event) {
    this.setState({user: {...this.state.user, [target]: event.target.value}});
  }

  handleCompanySelectChange(target, event) {
    this.setState({company: {...this.state.company, [target]: event.value}});
  }

  handleUserSelectChange(target, event) {
    this.setState({user: {...this.state.user, [target]: event.value}});
  }

  handleNumericChange(event) {
    this.setState({user: {...this.state.user, ownership: event}});
  }

  handleContinueButton(event, position) {
    this.setState({position: position});
  }

  updateUserState(user) {
    let userUpdateDict = {};
    for (let [key, value] of Object.entries(this.props.user)) {
      if (value !== '' && value !== null) {
        userUpdateDict[key] = value;
      }
    }
    this.setState({
      user: {
        ...this.state.user,
        ...userUpdateDict,
      },
    });
  }

  updateCompanyState(company) {
    let companyUpdateDict = {};
    for (let [key, value] of Object.entries(this.props.company)) {
      if (value !== '' && value !== null) {
        companyUpdateDict[key] = value;
      }
    }
    this.setState({
      company: {
        ...this.state.company,
        ...companyUpdateDict,
      },
    });
  }

  validateUser() {
    let isValid = true;
    for (let [key, value] of Object.entries(this.state.user)) {
      if (key === 'full_name') {
        if (value === '') {
          this.props.createMessage({
            invalidUser: `Please provide a value for the '${key}' field.`,
          });
          isValid = false;
        }
      }
      if (key === 'position') {
        if (value === '') {
          this.props.createMessage({
            invalidUser: `Please provide a value for the '${key}' field.`,
          });
          isValid = false;
        }
      }
      if (this.state.user.position === 'O' && key === 'ownership') {
        if (value === '') {
          this.props.createMessage({
            invalidUser: "Please provide an 'ownership' percentage.",
          });
          isValid = false;
        }
      }
    }
    return isValid;
  }

  validateCompany() {
    let isValid = true;
    for (let [key, value] of Object.entries(this.state.company)) {
      if (value === '' && key !== 'icon_url') {
        this.props.createMessage({
          invalidCompany: `Please provide a value for the '${key}' field.`,
        });
        isValid = false;
      }
    }
    return isValid;
  }

  async saveIcon(file) {
    this.props.beginLoading({
      title: 'Saving Logo',
      subtitle: 'Please wait while we save the image.',
    });
    await this.props.updateCompanyIcon(this.props.company.id, file);
    this.props.endLoading();
  }

  async handleSubmit(event) {
    this.props.beginLoading({
      title: 'Finalizing Your Account',
      subtitle: 'Please wait while we finalize your accout information.',
    });
    let valid = this.validateUser();
    if (!valid) {
      this.props.endLoading();
      return;
    }
    const userUpdateDict = {};
    for (let [key, value] of Object.entries(this.state.user)) {
      if (value !== '') {
        userUpdateDict[key] = value;
      }
    }
    await this.props.updateUser(userUpdateDict);
    const companyUpdateDict = {};
    valid = this.validateCompany();
    if (!valid) {
      this.props.endLoading();
      return;
    }
    for (let [key, value] of Object.entries(this.state.company)) {
      if (value !== '') {
        companyUpdateDict[key] = value;
      }
    }
    const companies = await this.props.updateCompany(
      this.props.company.id,
      companyUpdateDict
    );
    if (companies) {
      this.props.redirectTo({
        endpoint: `/dashboard/`,
        title: 'Success!',
        subtitle: "Your account was created. We'll redirect you to your dashboard.",
      });
    } else {
      this.props.endLoading();
    }
  }

  saveEnabled() {}

  render() {
    const {position} = this.state;
    // const saveEnabled = this.saveEnabled();
    if (!this.props.company) {
      return null;
    }
    const pendingIconURL = this.props.company.icon_url;
    const pendingState = this.state.company.state;
    const pendingTypeOfInc = this.state.company.type_of_inc;
    const pendingCategory = this.state.company.category;
    const pendingUseCase = this.state.company.use_case;
    const pendingNewStatus = this.state.company.new_status;
    const pendingUserPosition = this.state.user.position;
    const defaultIconURL =
      this.props.company && pendingIconURL ? pendingIconURL : undefined;
    const defaultState =
      pendingState && pendingState.length > 0
        ? {label: optionForValue(stateOptions, pendingState), value: pendingState}
        : undefined;
    const defaultTypeOfInc =
      pendingTypeOfInc && pendingTypeOfInc.length > 0
        ? {label: optionForValue(incOptions, pendingTypeOfInc), value: pendingTypeOfInc}
        : undefined;
    const defaultCategory =
      pendingCategory && pendingCategory.length > 0
        ? {
            label: optionForValue(categoryOptions, pendingCategory),
            value: pendingCategory,
          }
        : undefined;
    const defaultUseCase =
      pendingUseCase && pendingUseCase.length > 0
        ? {label: optionForValue(useCaseOptions, pendingUseCase), value: pendingUseCase}
        : undefined;
    const defaultNewStatus =
      pendingNewStatus && pendingNewStatus.length > 0
        ? {label: optionForValue(newOptions, pendingNewStatus), value: pendingNewStatus}
        : undefined;
    const defaultUserPosition =
      pendingUserPosition && pendingUserPosition.length > 0
        ? {label: userOptionForValue(pendingUserPosition), value: pendingUserPosition}
        : undefined;
    return (
      <>
        <FlexColumn
          mt="-80px"
          maxWidth="800px"
          width={['75%', '100%']}
          justifyContent="center"
          alignItems="center"
          flexWrap="wrap"
        >
          {position === 'welcome' && (
            <>
              <img
                alt="Onboarding"
                src="/index-signup.png"
                style={{width: '200px', height: '200px'}}
              />
              <Title variant="xLarge" textAlign="center" mt="48px">
                You're almost there!
              </Title>
              <Paragraph textAlign="center" maxWidth="400px">
                We just need a few pieces of information before you get started. Don't
                worry, this information is private and never shared with third-parties.
              </Paragraph>
              <Button
                mt="32px"
                width="200px"
                onClick={e => this.handleContinueButton(e, 'userPersonalDetails')}
              >
                Okay! Let's Do It
              </Button>
            </>
          )}
          {position === 'userPersonalDetails' && (
            <>
              <FillForm>
                <FlexColumn
                  height="100%"
                  flexBasis="100%"
                  alignItems="center"
                  justifyContent="flex-start"
                >
                  <Title variant="xLarge" textAlign="center" mt="48px">
                    Tell us about yourself
                  </Title>
                  <Paragraph mb="48px" maxWidth="400px" textAlign="center">
                    What is your full name?
                  </Paragraph>
                  <FlexRow justifyContent="center" maxWidth="300px">
                    <Input
                      minHeight="48px"
                      mb="30px"
                      variant="full"
                      name={'full_name'}
                      value={this.state.user.full_name}
                      placeholder={'Full Name'}
                      onChange={e => this.handleUserChange('full_name', e)}
                    />
                  </FlexRow>
                  <FlexRow justifyContent="center">
                    <Button
                      type="button"
                      mt="32px"
                      mx="8px"
                      minWidth="100px"
                      maxWidth="48%"
                      onClick={e => this.handleContinueButton(e, 'welcome')}
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      mt="32px"
                      mx="8px"
                      minWidth="100px"
                      maxWidth="48%"
                      onClick={e => this.handleContinueButton(e, 'userCompanyDetails')}
                    >
                      Continue
                    </Button>
                  </FlexRow>
                </FlexColumn>
              </FillForm>
            </>
          )}
          {position === 'userCompanyDetails' && (
            <>
              <FillForm>
                <FlexColumn
                  height="100%"
                  flexBasis="100%"
                  alignItems="center"
                  justifyContent="flex-start"
                >
                  <Title variant="xLarge" textAlign="center" mt="48px">
                    Tell us what you do
                  </Title>
                  <Paragraph mb="48px" maxWidth="400px" textAlign="center">
                    What is your role within this company? Are you part owner?
                  </Paragraph>
                  <FlexRow justifyContent="center" maxWidth="300px">
                    <Select
                      styles={selectStyles}
                      placeholder="Position"
                      options={userOptions}
                      name={'position'}
                      value={defaultUserPosition}
                      onChange={e => this.handleUserSelectChange('position', e)}
                    />
                    <NumericInput
                      strict
                      min={0}
                      max={100}
                      name={'ownership'}
                      value={this.state.user.ownership}
                      onChange={this.handleNumericChange}
                      style={numericStyles}
                      placeholder="% Ownership"
                      format={num => {
                        return num + ' %';
                      }}
                    />
                  </FlexRow>
                  <FlexRow justifyContent="center">
                    <Button
                      type="button"
                      mt="32px"
                      mx="8px"
                      minWidth="100px"
                      maxWidth="48%"
                      onClick={e => this.handleContinueButton(e, 'userPersonalDetails')}
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      mt="32px"
                      mx="8px"
                      minWidth="100px"
                      maxWidth="48%"
                      onClick={e => this.handleContinueButton(e, 'companyName')}
                    >
                      Continue
                    </Button>
                  </FlexRow>
                </FlexColumn>
              </FillForm>
            </>
          )}
          {position === 'companyName' && (
            <>
              <FillForm>
                <FlexColumn
                  height="100%"
                  flexBasis="100%"
                  alignItems="center"
                  justifyContent="flex-start"
                >
                  <Title variant="xLarge" textAlign="center" mt="48px">
                    What is your company's name?
                  </Title>
                  <Paragraph mb="48px" maxWidth="400px" textAlign="center">
                    What is the legal name of the business for which you are creating
                    paperwork?
                  </Paragraph>
                  <FlexRow justifyContent="center" maxWidth="300px">
                    <Input
                      minHeight="48px"
                      mb="30px"
                      variant="full"
                      name={'name'}
                      value={this.state.company.name}
                      placeholder={'Name'}
                      onChange={e => this.handleCompanyChange('name', e)}
                    />
                  </FlexRow>
                  <FlexRow justifyContent="center">
                    <Button
                      type="button"
                      mt="32px"
                      mx="8px"
                      minWidth="100px"
                      maxWidth="48%"
                      onClick={e => this.handleContinueButton(e, 'userDetails')}
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      mt="32px"
                      mx="8px"
                      minWidth="100px"
                      maxWidth="48%"
                      onClick={e => this.handleContinueButton(e, 'companyState')}
                    >
                      Continue
                    </Button>
                  </FlexRow>
                </FlexColumn>
              </FillForm>
            </>
          )}
          {position === 'companyState' && (
            <>
              <FillForm>
                <FlexColumn
                  height="100%"
                  flexBasis="100%"
                  alignItems="center"
                  justifyContent="flex-start"
                >
                  <Title variant="xLarge" textAlign="center" mt="48px">
                    Where is your company?
                  </Title>
                  <Paragraph mb="48px" maxWidth="400px" textAlign="center">
                    What is the primary state in which the company does business?
                  </Paragraph>
                  <FlexRow justifyContent="center" alignItems="center" maxWidth="300px">
                    <Select
                      styles={selectStyles}
                      placeholder="State"
                      options={stateOptions}
                      name={'state'}
                      value={defaultState}
                      onChange={e => this.handleCompanySelectChange('state', e)}
                    />
                  </FlexRow>
                  <FlexRow justifyContent="center">
                    <Button
                      type="button"
                      mt="32px"
                      mr="12px"
                      minWidth="100px"
                      maxWidth="48%"
                      onClick={e => this.handleContinueButton(e, 'companyName')}
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      mt="32px"
                      mx="8px"
                      minWidth="100px"
                      maxWidth="48%"
                      onClick={e => this.handleContinueButton(e, 'companyDetails')}
                    >
                      Continue
                    </Button>
                  </FlexRow>
                </FlexColumn>
              </FillForm>
            </>
          )}
          {position === 'companyDetails' && (
            <>
              <FillForm>
                <FlexColumn
                  height="100%"
                  flexBasis="100%"
                  alignItems="center"
                  justifyContent="flex-start"
                >
                  <Title variant="xLarge" textAlign="center" mt="48px">
                    Provide some company details
                  </Title>
                  <Paragraph mb="48px" maxWidth="400px" textAlign="center">
                    We use this information to pesonalize your experience and improve
                    Leafsheets.
                  </Paragraph>
                  <FlexRow justifyContent="center" maxWidth="300px">
                    <Select
                      styles={selectStyles}
                      placeholder="Organization"
                      options={incOptions}
                      name={'type_of_inc'}
                      value={defaultTypeOfInc}
                      onChange={e => this.handleCompanySelectChange('type_of_inc', e)}
                    />
                    <Select
                      styles={selectStyles}
                      placeholder="Designation"
                      options={categoryOptions}
                      name={'category'}
                      value={defaultCategory}
                      onChange={e => this.handleCompanySelectChange('category', e)}
                    />
                    <Select
                      styles={selectStyles}
                      placeholder="Type"
                      options={useCaseOptions}
                      name={'use_case'}
                      value={defaultUseCase}
                      onChange={e => this.handleCompanySelectChange('use_case', e)}
                    />
                    <Select
                      styles={selectStyles}
                      placeholder="Status"
                      options={newOptions}
                      name={'new_status'}
                      value={defaultNewStatus}
                      onChange={e => this.handleCompanySelectChange('new_status', e)}
                    />
                  </FlexRow>
                  <FlexRow justifyContent="center">
                    <Button
                      type="button"
                      mt="32px"
                      mx="8px"
                      minWidth="100px"
                      maxWidth="48%"
                      onClick={e => this.handleContinueButton(e, 'companyState')}
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      mt="32px"
                      mx="8px"
                      minWidth="100px"
                      maxWidth="48%"
                      onClick={e => this.handleContinueButton(e, 'image')}
                    >
                      Continue
                    </Button>
                  </FlexRow>
                </FlexColumn>
              </FillForm>
            </>
          )}
          {position === 'image' && (
            <>
              <FillForm>
                <FlexColumn
                  height="100%"
                  flexBasis="100%"
                  alignItems="center"
                  justifyContent="flex-start"
                >
                  <Title variant="xLarge" textAlign="center" mt="48px">
                    Add your company logo
                  </Title>
                  <Paragraph mb="48px" maxWidth="400px" textAlign="center">
                    Some documents have the option to include a company logo. Add yours
                    here if you'd like to have it displayed.
                  </Paragraph>
                  <FlexRow justifyContent="center" maxWidth="300px">
                    <Dropzone
                      height={150}
                      width={150}
                      minHeight="150px"
                      minWidth="150px"
                      mb="20px"
                      border="none"
                      minSize={0}
                      maxSize={5242880}
                      saveImage={this.saveIcon}
                      returnErrors={this.props.returnErrors}
                      createMessage={this.props.createMessage}
                      image={defaultIconURL}
                    />
                  </FlexRow>
                  <FlexRow justifyContent="center">
                    <Button
                      type="button"
                      mt="32px"
                      mx="8px"
                      minWidth="100px"
                      maxWidth="48%"
                      onClick={e => this.handleContinueButton(e, 'companyDetails')}
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      mt="32px"
                      mx="8px"
                      minWidth="100px"
                      maxWidth="48%"
                      onClick={this.handleSubmit}
                    >
                      Submit
                    </Button>
                  </FlexRow>
                </FlexColumn>
              </FillForm>
            </>
          )}
        </FlexColumn>
      </>
    );
  }
}

const mapStateToProps = state => ({
  user: state.authReducer.user,
  company: state.companiesReducer.companies[0],
});

OnboardingForm.defaultProps = {
  user: null,
  company: null,
};

export default connect(
  mapStateToProps,
  {
    loadUser,
    updateUser,
    getCompanies,
    updateCompany,
    updateCompanyIcon,
    beginLoading,
    endLoading,
    createMessage,
    returnErrors,
    redirectTo,
  }
)(OnboardingForm);

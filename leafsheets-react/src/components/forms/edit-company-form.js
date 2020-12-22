// Imports

import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Select from 'react-select';
import _ from 'lodash';

import { getCompanies, updateCompany, updateCompanyIcon } from '../../actions/companies';
import {incOptions, newOptions, categoryOptions, useCaseOptions} from './options';
import { beginLoading, endLoading } from '../../actions/ui';
import { createMessage } from '../../actions/messages';
import { selectStyles } from '../inputs/styles/select';
import { stateOptions } from '../../utils/us-states';
import { returnErrors } from '../../actions/errors';
import { FlexColumn, FlexRow } from '../layouts';
import Dropzone from '../inputs/drag-n-drop';
import { FillForm } from './form-extras';
import { Paragraph } from '../paragraph';
import { Button } from '../buttons';
import { Title } from '../headers';
import { Input } from '../inputs';

// Helpers

const optionForValue = (options, value) => {
  const option = options.filter(dict => dict.value === value)[0];
  if (option !== undefined) {
    return option.label;
  } else {
    return null;
  }
};

// Edit Company Form

class EditCompanyForm extends Component {
  constructor(props) {
    super(props);
    this.state = this.initialState();
    this.saveIcon = this.saveIcon.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.updateCompanyState = this.updateCompanyState.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  static propTypes = {
    getCompanies: PropTypes.func.isRequired,
    companies: PropTypes.array.isRequired,
    createMessage: PropTypes.func.isRequired,
    returnErrors: PropTypes.func.isRequired,
    updateCompany: PropTypes.func.isRequired,
    updateCompanyIcon: PropTypes.func.isRequired,
    beginLoading: PropTypes.func.isRequired,
    endLoading: PropTypes.func.isRequired
  };

  initialState() {
    return {
      existingCompany: null,
      pendingCompany: {
        name: '',
        type_of_inc: '',
        category: '',
        new_status: '',
        use_case: '',
        state: '',
        icon_url: '',
      },
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.companies[0] !== this.props.companies[0]) {
      this.updateCompanyState(this.props.companies[0]);
    }
  }

  componentDidMount() {
    this.props.getCompanies();
    if (this.state.existingCompany === null && this.props.companies.length > 0) {
      this.updateCompanyState(this.props.companies[0]);
    }
  }

  handleChange(event) {
    this.setState({
      pendingCompany: {
        ...this.state.pendingCompany,
        [event.target.name]: event.target.value,
      },
    });
  }

  handleSelectChange(target, event) {
    this.setState({ pendingCompany: {...this.state.pendingCompany, [target]: event.value }});
  }

  async handleSubmit(event) {
    event.preventDefault();
    const company = this.state.pendingCompany;
    const filteredCompany = Object.fromEntries(
      Object.entries(company).filter(([k,v]) => v !== this.state.existingCompany[k])
    );
    this.props.beginLoading({
      title: 'Updating Company',
      subtitle: 'Please wait while we update your company information.'
    });
    this.props.updateCompany(this.state.existingCompany.id, filteredCompany);
    this.props.endLoading();
  }

  async saveIcon(file) {
    this.props.beginLoading({
      title: 'Updating Image',
      subtitle: 'Please wait while we save the image.'
    });
    this.props.updateCompanyIcon(this.state.existingCompany.id, file);
    this.props.endLoading();
  }

  updateCompanyState(company) {
    this.setState({
      existingCompany: {
        id: company.id,
        name: company.name,
        type_of_inc: company.type_of_inc,
        category: company.category,
        new_status: company.new_status,
        use_case: company.use_case,
        state: company.state,
        icon_url: company.icon_url,
      },
      pendingCompany: {
        id: company.id,
        name: company.name,
        type_of_inc: company.type_of_inc,
        category: company.category,
        new_status: company.new_status,
        use_case: company.use_case,
        state: company.state,
        icon_url: company.icon_url,
      },
    });
  }

  saveEnabled() {
    return !_.isEqual(this.state.existingCompany, this.state.pendingCompany);
  }

  render() {
    this.props.endLoading();
    const saveEnabled = this.saveEnabled();
    if (this.state.existingCompany === null) {
      return null;
    }
    const pendingState = this.state.pendingCompany.state;
    const pendingTypeOfInc = this.state.pendingCompany.type_of_inc;
    const pendingCategory = this.state.pendingCompany.category;
    const pendingUseCase = this.state.pendingCompany.use_case;
    const pendingNewStatus = this.state.pendingCompany.new_status;
    const defaultState = pendingState && pendingState.length > 0 ? { label: optionForValue(stateOptions, pendingState), value: pendingState } : undefined;
    const defaultTypeOfInc = pendingTypeOfInc && pendingTypeOfInc.length > 0 ? { label: optionForValue(incOptions, pendingTypeOfInc), value: pendingTypeOfInc } : undefined;
    const defaultCategory = pendingCategory && pendingCategory.length > 0 ? { label: optionForValue(categoryOptions, pendingCategory), value: pendingCategory } : undefined;
    const defaultUseCase = pendingUseCase && pendingUseCase.length > 0 ? { label: optionForValue(useCaseOptions, pendingUseCase), value: pendingUseCase } : undefined;
    const defaultNewStatus = pendingNewStatus && pendingNewStatus.length > 0 ? { label: optionForValue(newOptions, pendingNewStatus), value: pendingNewStatus } : undefined;
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
                    Company
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
                  alignItems="flex-start"
                  mr={['0', '40px']}
                >
                  <Dropzone 
                    height={150}
                    width={150}
                    minHeight="150px"
                    minWidth="150px"
                    mr="20px"
                    mb="20px"
                    border="none"
                    minSize={0}
                    maxSize={5242880}
                    saveImage={this.saveIcon}
                    returnErrors={this.props.returnErrors}
                    createMessage={this.props.createMessage}
                    image={this.state.existingCompany.icon_url}
                  />
                  <FlexRow
                    flexBasis={['100%', '65%']}
                    flexGrow="1"
                    justifyContent="space-between"
                  >
                    <Input
                      variant="full"
                      name={'name'}
                      value={this.state.pendingCompany.name}
                      placeholder={'Name'}
                      onChange={this.handleChange}
                    />
                    <FlexRow flexBasis={['100%', '100%']}>
                      <Select
                        styles={selectStyles}
                        placeholder="State"
                        options={stateOptions}
                        name={'state'}
                        value={defaultState}
                        onChange={e => this.handleSelectChange('state', e)}
                      />
                    </FlexRow>
                    <FlexRow flexBasis={['48%', '48%']}>
                      <Select
                        styles={selectStyles}
                        placeholder="Organization"
                        options={incOptions}
                        name={'type_of_inc'}
                        value={defaultTypeOfInc}
                        onChange={e => this.handleSelectChange('type_of_inc', e)}
                      />
                    </FlexRow>
                    <FlexRow flexBasis={['48%', '48%']}>
                      <Select
                        styles={selectStyles}
                        placeholder="Designation"
                        options={categoryOptions}
                        name={'category'}
                        value={defaultCategory}
                        onChange={e => this.handleSelectChange('category', e)}
                      />
                    </FlexRow>
                    <FlexRow flexBasis={['48%', '48%']}>
                      <Select
                        styles={selectStyles}
                        placeholder="Type"
                        options={useCaseOptions}
                        name={'use_case'}
                        value={defaultUseCase}
                        onChange={e => this.handleSelectChange('use_case', e)}
                      />
                    </FlexRow>
                    <FlexRow flexBasis={['48%', '48%']}>
                      <Select
                        styles={selectStyles}
                        placeholder="Status"
                        options={newOptions}
                        name={'new_status'}
                        value={defaultNewStatus}
                        onChange={e => this.handleSelectChange('new_status', e)}
                      />
                    </FlexRow>
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
  companies: state.companiesReducer.companies,
});

EditCompanyForm.defaultProps = {
  companies: [],
};

export default connect(
  mapStateToProps,
  {
    getCompanies,
    updateCompany,
    updateCompanyIcon,
    createMessage,
    returnErrors,
    beginLoading,
    endLoading
  }
)(EditCompanyForm);

// Imports

import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';

import {
  convertVariablesToInputs,
  extractNameValuePairsFromVariabels,
} from '../../utils/converters';
import {updateUserVariableDict, setActiveUserSheet} from '../../actions/sheets';
import {beginLoading, endLoading} from '../../actions/ui';
import {FlexColumn, FlexRow} from '../layouts';
import {Paragraph} from '../paragraph';
import {FillForm} from './form-extras';
import {Title} from '../headers';
import {Input} from '../inputs';

const DynamicInput = ({input, state, handleChange}) => {
  const placeholder = input.required === true ? `${input.name} (Required)` : input.name;
  return (
    <FlexRow flexBasis="100%" justifyContent="space-between" width="100%" mb="24px">
      <Input
        type={input.kind}
        variant="full"
        name={input.find}
        value={state.pendingUserSheet[input.find]}
        placeholder={placeholder}
        onChange={handleChange}
        mb="12px"
      />
      <FlexColumn alignItems="flex-start">
        <Paragraph>
          <b>Note:</b> {input.prompt}
        </Paragraph>
        {input.default && (
          <Paragraph>
            <b>Default:</b> {input.default}
          </Paragraph>
        )}
      </FlexColumn>
    </FlexRow>
  );
};

const DynamicInputGroup = ({group, state, handleChange}) => {
  const {inputs} = group;
  return (
    <FlexColumn mb="80px" width="100%">
      <FlexRow
        alignItems="center"
        borderBottom="1px solid"
        borderColor="normalGrey"
        justifyContent="space-between"
        mb="24px"
      >
        <Title variant="xSmall">{group.name}</Title>
      </FlexRow>
      {inputs.map(input => {
        return (
          <DynamicInput
            input={input}
            key={input.find}
            state={state}
            handleChange={handleChange}
          />
        );
      })}
    </FlexColumn>
  );
};

// Edit User Sheet Form

class EditUserSheetForm extends Component {
  constructor(props) {
    super(props);
    this.state = this.initialState();
    this.saveEnabled = this.saveEnabled.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.updateUserSheetState = this.updateUserSheetState.bind(this);
  }

  static propTypes = {
    updateUserVariableDict: PropTypes.func.isRequired,
    setActiveUserSheet: PropTypes.func.isRequired,
    beginLoading: PropTypes.func.isRequired,
    endLoading: PropTypes.func.isRequired,
  };

  initialState() {
    return {
      existingUserSheet: {},
      pendingUserSheet: {},
    };
  }

  componentDidUpdate(prevProps) {
    const {userSheet} = this.props;
    if (prevProps.userSheet !== userSheet) {
      this.updateUserSheetState('existingUserSheet', userSheet);
      this.updateUserSheetState('pendingUserSheet', userSheet);
    }
  }

  componentDidMount() {
    const {userSheet, endLoading} = this.props;
    endLoading();
    this.updateUserSheetState('existingUserSheet', userSheet);
    this.updateUserSheetState('pendingUserSheet', userSheet);
  }

  updateUserSheetState(sheetString, newSheet) {
    let result = {};
    const variables = newSheet.user_variable_dict.context;
    const pairs = extractNameValuePairsFromVariabels(variables);
    if (pairs) {
      result = pairs.reduce(function(r, o) {
        Object.keys(o).forEach(function(k) {
          r[k] = o[k];
        });
        return r;
      }, {});
      this.setState(
        {
          [sheetString]: result,
        },
        () => {
          this.saveEnabled();
        }
      );
    }
  }

  async handleSubmit(event) {
    this.props.beginLoading({
      title: 'Saving Document',
      subtitle: 'Please wait while we save update document.',
    });
    const userSheets = await this.props.updateUserVariableDict(
      this.props.userSheet,
      this.state.pendingUserSheet
    );
    const updatedUserSheet = userSheets.filter(sheet => {
      return sheet.id === this.props.userSheet.id;
    })[0];
    await this.props.setActiveUserSheet(updatedUserSheet);
    this.props.endLoading();
  }

  handleChange(event) {
    const value = event.target.value.length === 0 ? null : event.target.value;
    this.setState(
      {
        pendingUserSheet: {...this.state.pendingUserSheet, [event.target.name]: value},
      },
      () => {
        this.saveEnabled();
      }
    );
  }

  saveEnabled() {
    const saveEnabled = !_.isEqual(
      this.state.existingUserSheet,
      this.state.pendingUserSheet
    );
    this.props.handleSaveEnabled(saveEnabled);
  }

  render() {
    const {userSheet, maxWidth} = this.props;
    const variables = userSheet.user_variable_dict.context;
    const inputGroups = convertVariablesToInputs(variables);
    return (
      <FlexColumn justifyContent="flex-start" width="100%" maxWidth={maxWidth} pt="64px">
        <FillForm alignItems="flex-start" width="100%" onSubmit={this.handleSubmit}>
          {inputGroups.length > 0 &&
            inputGroups.map(group => {
              return (
                <DynamicInputGroup
                  group={group}
                  key={group.name}
                  state={this.state}
                  handleChange={this.handleChange}
                />
              );
            })}
        </FillForm>
      </FlexColumn>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  {
    updateUserVariableDict,
    setActiveUserSheet,
    beginLoading,
    endLoading,
  },
  null,
  {forwardRef: true}
)(EditUserSheetForm);

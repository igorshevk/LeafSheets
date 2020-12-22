// Imports

import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';

import {generateUserSheet, previewUserSheet} from '../../../actions/sheets';
import {beginLoading, endLoading} from '../../../actions/ui';
import {FlexColumn, FlexRow} from '../../layouts';
import {Paragraph} from '../../paragraph';
import {Button} from '../../buttons';

// Progress Control

class ProgressControl extends Component {

  constructor(props) {
    super(props);
    this.state = this.initialState();
    this.handlePreview = this.handlePreview.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
    this.updateProgress = this.updateProgress.bind(this);
  }

  initialState() {
    return {
      progress: 0,
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.userSheet !== this.props.userSheet) {
      this.updateProgress(this.props.userSheet);
    }
  }

  componentDidMount() {
    this.updateProgress(this.props.userSheet);
  }

  async handlePreview() {
    const {beginLoading, endLoading, userSheet, generateUserSheet, previewUserSheet} = this.props;
    beginLoading({
      title: 'Loading Preview',
      subtitle: 'Please wait while we load your document preview.',
    })
    const newUserSheet = await generateUserSheet(userSheet);
    endLoading(null, 0);
    previewUserSheet(true, newUserSheet);
  }

  async handleDownload() {
    const {beginLoading, endLoading, userSheet, generateUserSheet} = this.props;
    beginLoading({
      title: 'Downloading Document',
      subtitle: 'Please wait while we process you download.',
    }, 1010);
    const newUserSheet = await generateUserSheet(userSheet);
    window.open(newUserSheet.user_variable_pdf);
    endLoading();
  }

  updateProgress(userSheet) {
    let newProgress = this.state.progress;
    newProgress = (parseInt(userSheet.completed_required_input_count) / parseInt(userSheet.required_input_count)) * 100;
    this.setState({
      progress: newProgress,
    })
  }

  render() {
    const { userSheet }= this.props;
    const { progress } = this.state;
    const is100PercentComplete = (progress === 100 || progress >= 100);
    const oppositeOfProgress = (100 - progress);
    // If it's not editable, don't show the edit button.
    if (userSheet.sheet.editable === false) {
      return (
        <FlexColumn justifyContent="flex-end" width="100%">
          <FlexRow justifyContent="space-between">
            <Button onClick={this.handleDownload} variant="userSheetPrimary" width="48% !important">Download</Button>
            <Button onClick={this.handlePreview} variant="userSheetPrimary" width="48% !important">Preview</Button>
          </FlexRow>
        </FlexColumn>
      )
    }
    // IF it's 100% complete, show different controls.
    if (is100PercentComplete === true) {
      return (
        <FlexColumn justifyContent="space-between" width="100%">
          <FlexRow justifyContent="space-between" mb="10px">
            <Button as={Link} to={`/dashboard/sheets/${userSheet.id}`} variant="userSheetSecondary" width="48% !important">Edit</Button>
            <Button onClick={this.handlePreview} variant="userSheetSecondary" width="48% !important">Preview</Button>
          </FlexRow>
          <Button onClick={this.handleDownload} variant="userSheetPrimary">Download</Button>
        </FlexColumn>
      )
    } else {
      return (
        <FlexColumn alignItems="flex-start" justifyContent="space-between" width="100%">
          <FlexColumn alignItems="flex-start" width="100%">
            <Paragraph variant="xSmall" color="primary">{Math.floor(progress)}% complete</Paragraph>
            <FlexRow mb="20px" width="100%">
                <FlexRow borderTopLeftRadius="2px" borderBottomLeftRadius="2px" height="4px" backgroundColor="accent" flexBasis={`${progress}%`} width="auto" />
                <FlexRow borderTopRightRadius="2px" borderBottomRightRadius="2px" height="4px" backgroundColor="lightGrey" flexBasis={`${oppositeOfProgress}%`} width="auto" />
            </FlexRow>
          </FlexColumn>
          <Button as={Link} to={`/dashboard/sheets/${userSheet.id}`} variant="userSheetPrimary">Continue Editing</Button>
        </FlexColumn>
      )
    }
  }
}

export default connect(
  null,
  {
    beginLoading,
    endLoading,
    generateUserSheet,
    previewUserSheet
  }
)(ProgressControl);

// Imports

import {FaEye, FaSave, FaFileDownload} from 'react-icons/fa';
import React, {Component} from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Media from 'react-media';

import {generateUserSheet, previewUserSheet} from '../../../actions/sheets';
import ProgressIndicator from '../../progress-indicator/progress-indicator';
import {beginLoading, endLoading} from '../../../actions/ui';
import {breakpoints} from '../../../styles/themes';
import {colors} from '../../../styles/colors';
import {FlexRow} from '../../layouts';
import {Button} from '../../buttons';
import {Title} from '../../headers';
import {Icon} from '../../icons';

// Panel

const Panel = styled.div`
  {
    background-color: white;
    border-bottom: 1px solid rgba(0,0,0,0.06);
    height: 64px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: space-between;
    position: fixed;
    left: 0
    top: 80px;
    width: 100%;
  }
`;

// Control Panel

class ControlPanel extends Component {
  constructor(props) {
    super(props);
    this.handlePreview = this.handlePreview.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
  }

  static propTypes = {
    activeUserSheet: PropTypes.object.isRequired,
    beginLoading: PropTypes.func.isRequired,
    endLoading: PropTypes.func.isRequired,
  };

  async handlePreview() {
    const {
      beginLoading,
      endLoading,
      activeUserSheet,
      generateUserSheet,
      previewUserSheet,
    } = this.props;
    beginLoading({
      title: 'Loading Preview',
      subtitle: 'Please wait while we load your document preview.',
    });
    const newUserSheet = await generateUserSheet(activeUserSheet);
    endLoading(null, 0);
    previewUserSheet(true, newUserSheet);
  }

  async handleDownload() {
    const {
      handleSubmit,
      beginLoading,
      endLoading,
      activeUserSheet,
      generateUserSheet,
    } = this.props;
    await handleSubmit();
    beginLoading(
      {
        title: 'Downloading Document',
        subtitle: 'Please wait while we process your download.',
      },
      1010
    );
    const newUserSheet = await generateUserSheet(activeUserSheet);
    window.open(newUserSheet.user_variable_pdf);
    endLoading();
  }

  render() {
    const {userSheet, saveEnabled, handleSubmit} = this.props;
    return (
      <Panel style={{alignItems: 'space-between'}}>
        <FlexRow px={['20px', '60px']} justifyContent="space-between" width="100%">
          <Title mb="0px" variant="small" style={{textOverflow: 'ellipsis'}}>
            {userSheet && userSheet.sheet.title}
            {!userSheet && <span style={{ color: `${colors.lightGrey}`}}>Loading...</span>}
          </Title>
          <FlexRow justifyContent="flex-end" width="auto">
            <Media
              queries={{
                mobile: `(max-width: ${breakpoints[0]})`,
                desktop: `(min-width: ${breakpoints[0]})`,
              }}
            >
              {matches => (
                <>
                  {matches.mobile && (
                    <>
                      <Button
                        disabled={!saveEnabled}
                        bg={saveEnabled ? 'accent !important' : 'lightGrey !important'}
                        variant="save"
                        onClick={handleSubmit}
                        type="submit"
                        mr="20px"
                      >
                        <Icon variant="save" icon={[<FaSave />]} />
                      </Button>
                      <Button
                        variant="controlPanel"
                        onClick={this.handleDownload}
                        type="submit"
                        mr="20px"
                      >
                        <Icon variant="controlPanel" icon={[<FaFileDownload />]} />
                      </Button>
                      <Button
                        variant="controlPanel"
                        onClick={this.handlePreview}
                        type="submit"
                      >
                        <Icon variant="controlPanel" icon={[<FaEye />]} />
                      </Button>
                    </>
                  )}
                  {matches.desktop && (
                    <>
                      <Button
                        disabled={!saveEnabled}
                        bg={saveEnabled ? 'accent !important' : 'lightGrey !important'}
                        variant="save"
                        onClick={handleSubmit}
                        type="submit"
                        mr="20px"
                      >
                        Save
                      </Button>
                      <Button
                        variant="controlPanel"
                        onClick={this.handleDownload}
                        type="submit"
                        mr="20px"
                      >
                        Download
                      </Button>
                      <Button
                        variant="controlPanel"
                        onClick={this.handlePreview}
                        type="submit"
                      >
                        Preview
                      </Button>
                    </>
                  )}
                </>
              )}
            </Media>
          </FlexRow>
        </FlexRow>
        <ProgressIndicator />
      </Panel>
    );
  }
}

const mapStateToProps = state => ({
  activeUserSheet: state.sheetsAndItemsReducer.activeUserSheet,
});

export default connect(
  mapStateToProps,
  {
    beginLoading,
    endLoading,
    generateUserSheet,
    previewUserSheet,
  }
)(ControlPanel);

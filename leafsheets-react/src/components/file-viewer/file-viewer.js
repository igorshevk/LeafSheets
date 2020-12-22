// Imports

import {Document, Page, pdfjs} from 'react-pdf';
import Loader from 'react-loader-spinner';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Lottie from 'react-lottie';

import {getPreviewBool, getPreviewSheet} from '../../reducers/sheets-and-items';
import {previewUserSheet} from '../../actions/sheets';
import {FlexRow, FlexColumn} from '../layouts';
import animationData from '../loaders/icon-loader.json';
import {Paragraph} from '../paragraph';
import {Button} from '../buttons';
import {Title} from '../headers';

// Helpers

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// File Viewer

export class FileViewer extends Component {
  constructor(props) {
    super(props);
    this.state = this.initialState();
    this.onError = this.onError.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.onButtonClick = this.onButtonClick.bind(this);
    this.renderLoading = this.renderLoading.bind(this);
  }

  static propTypes = {
    userSheet: PropTypes.object,
    preview: PropTypes.bool.isRequired,
    previewUserSheet: PropTypes.func.isRequired,
  };

  initialState() {
    return {
      width: window.innerWidth,
    };
  }

  handleResize() {
    this.setState({
      width: window.innerWidth,
    });
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  onButtonClick() {
    this.props.previewUserSheet(false, null);
  }

  onError(e) {
    console.log(e);
  }

  renderLoading() {
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
      },
    };
    return (
      <FlexColumn minHeight="0px !important" height="25vh !important" justifyContent="center" position="absolute" width="300px" top="30%" left="calc(50% - 150px)">
        <Loader
            type="TailSpin"
            color="#30E1A5"
            height={90}
            width={90}
            visible={true} />
        <FlexRow minHeight="0px !important" height="60px !important" position="absolute" top="15px">
            <Lottie options={defaultOptions}
                height={60}
                width={60}/>
        </FlexRow>
        <Title className="animatedEllipsis" mb="8px" mt="30px" color="accent">Rendering PDF</Title>
        <Paragraph variant="overlay" color="accent">Please wait while we render your PDF</Paragraph>
      </FlexColumn>
    );
  }

  render() {
    const {userSheet, preview} = this.props;
    const {width} = this.state;
    const docWidth = Math.min(width * 0.9, 768);
    if (preview === false) {
      return null;
    } else {
      return (
        <FlexRow
          bg="rgba(0,0,0,0.92)"
          height="100vh"
          width="100vw"
          justifyContent="center"
          overflow="scroll"
          position="fixed"
          py="80px"
          top="0"
          left="0"
          zIndex="23"
        >
          <Button
            variant="exit"
            onClick={this.onButtonClick}
            position="fixed"
            top="20px"
            right="20px"
          >
            Exit
          </Button>
          <FlexRow
            justifyContent="center"
            bg="transparent"
            minWidth="0px"
            maxWidth={[`${docWidth}px`, '768px']}
            px={['15%', '80px']}
          >
            {userSheet !== null && (
              <Document
                file={userSheet.user_variable_pdf}
                onLoadError={e => console.log(e)}
                loading={this.renderLoading}
              >
                <Page pageNumber={1} width={docWidth} renderMode="svg" />
              </Document>
            )}
          </FlexRow>
        </FlexRow>
      );
    }
  }
}

const mapStateToProps = state => ({
  userSheet: getPreviewSheet(state),
  preview: getPreviewBool(state),
});

export default connect(
  mapStateToProps,
  {previewUserSheet}
)(FileViewer);

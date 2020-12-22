// Imports

import styled from 'styled-components';
import React, {Component} from 'react';
import {connect} from 'react-redux';

import { FlexColumn, FlexRow } from '../../layouts';
import { colors } from '../../../styles/colors';
import { Paragraph } from '../../paragraph';
import { Title } from '../../headers';

// Sub Components

const InnerContent = styled.div`
  align-items: flex-start;
  bottom: 20px;
  justify-content: center;
  display: flex;
  height: calc(100% - 80px);
  left: 0;
  overflow: scroll;
  padding: 60px;
  padding-top: 20px;
  position: absolute;
  maxWidth: 280px;
  width: 90%;
  @media only screen and (max-width: 1315px) {
    width: 100%;
  }
`

const PreviewButton = styled.div`
  {
    background-color: ${colors.primaryBg};
    border-radius: 20px;
    color: ${colors.accent};
    cursor: pointer;
    height: 34px;
    font-family: Barlow;
    font-size: 14px;
    font-weight: 600;
    line-height: 34px;
    text-align: center;
    transition: background-color 0.25s ease, color 0.25s ease;
    width: 100px;
    &:hover {
      background-color: ${colors.accent};
      color: ${colors.white} !important;
      transition: background-color 0.25s ease, color 0.25s ease;
    }
  }
`;

const SelectedPreviewButtonStyle = {
    backgroundColor: `${colors.accent}`,
    color: `${colors.white}`,
}

const ButtonRow = styled.div`
   {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      width: 90%
      @media only screen and (max-width: 1315px) {
          width: 100%;
      }
    }
`;

const ButtonSubRow = styled.div`
   {
      background-color: ${colors.white};
      border: 1px solid ${colors.accent};
      border-radius: 28px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      height: 44px;
      align-items: center;
      width: 210px;
    }
`;

// Sheet Preview

class SheetPreview extends Component {
  constructor(props) {
    super(props);
    this.state = this.initialState();
    this.togglePreview = this.togglePreview.bind(this);
  }

  initialState() {
    return {
      preview: 'toc',
    };
  }

  togglePreview(attrToShow) {
    this.setState({
      preview: attrToShow,
    });
  }

  render() {
    const { mx, ...styleProps } = this.props
    const {preview} = this.state;
    return (
      <>
        <InnerContent>
          {preview === 'toc' &&
            <FlexColumn justifyContent="center" width="100%" maxWidth="280px">
              <Title>Table of Contents</Title>
              <FlexRow flexWrap="no-wrap" width="100%" maxWidth="280px">
                <Paragraph flexGrow="0">Introduction</Paragraph>
                <Paragraph style={{ marginTop: '8px', marginLeft: '1px', borderBottom: '1px dotted black', marginRight: '4px'}} flexGrow="1"></Paragraph>
                <Paragraph flexGrow="0">1</Paragraph>
              </FlexRow>
              <FlexRow flexWrap="no-wrap" width="100%" maxWidth="280px">
                <Paragraph flexGrow="0">Body</Paragraph>
                <Paragraph style={{ marginTop: '8px', marginLeft: '1px', borderBottom: '1px dotted black', marginRight: '4px'}} flexGrow="1"></Paragraph>
                <Paragraph flexGrow="0">2-9</Paragraph>
              </FlexRow>
              <FlexRow flexWrap="no-wrap" width="100%" maxWidth="280px">
                <Paragraph flexGrow="0">Conclusion</Paragraph>
                <Paragraph style={{ marginTop: '8px', marginLeft: '1px', borderBottom: '1px dotted black', marginRight: '4px'}} flexGrow="1"></Paragraph>
                <Paragraph flexGrow="0">10</Paragraph>
              </FlexRow>
            </FlexColumn>
          }
          {preview === 'excerpt' &&
            <FlexColumn justifyContent="space-between">
              <Title>Excerpt</Title>
              <Paragraph maxWidth="280px">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </Paragraph>
            </FlexColumn>
          }
        </InnerContent>
        <ButtonRow {...styleProps}>
          <ButtonSubRow>
            {this.state.preview === 'toc' && <PreviewButton style={SelectedPreviewButtonStyle} onClick={e => this.togglePreview('toc')}s>Contents</PreviewButton>}
            {this.state.preview === 'excerpt' && <PreviewButton onClick={e => this.togglePreview('toc')}s>Contents</PreviewButton>}
            {this.state.preview === 'toc' && <PreviewButton  onClick={e => this.togglePreview('excerpt')}>Sample</PreviewButton>}
            {this.state.preview === 'excerpt' && <PreviewButton style={SelectedPreviewButtonStyle} onClick={e => this.togglePreview('excerpt')}>Sample</PreviewButton>}
          </ButtonSubRow>
        </ButtonRow>
      </>
    );
  }
}

export default connect(
  null,
  {}
)(SheetPreview);

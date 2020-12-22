// Imports

import {FaArrowRight, FaClock, FaTag} from 'react-icons/fa';
import React, {Component, Fragment} from 'react';
import {IoIosPaper} from 'react-icons/io';
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Media from 'react-media';

import {Section, FlexRow, FlexColumn} from '../../layouts';
import SheetCard from '../../cards/sheet-card/sheet-card';
import {pageCountString} from '../../../utils/strings';
import SheetButton from '../../buttons/sheet-button';
import {updateNavColor} from '../../../actions/ui';
import {getSheet} from '../../../actions/sheets';
import {addToCart} from '../../../actions/cart';
import {getItem} from '../../../actions/items';
import {colors} from '../../../styles/colors';
import {isEmpty} from '../../../utils/empty';
import SheetPreview from './sheet-preview';
import {Paragraph} from '../../paragraph';
import {Title} from '../../headers';
import {Page} from '../../layouts';
import {Icon} from '../../icons';
import {Line} from '../../line';

// Styled

const ViewAllSheets = styled(FlexRow)`
  & *,
  & *:visited {
    color: ${colors.black};
  }
  &:hover * {
    color: ${colors.accent} !important;
  }
`;

// Sub Components

const PreviewRow = styled.div`
   {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: relative;
    flex-basis: 50%;
    @media only screen and (max-width: 1315px) {
      flex-basis: 100%;
      max-width: 100%;
    }
    max-width: 600px;
  }
`;

const Column = styled.div`
   {
    display: flex;
    flex-direction: column;
    justify-content: flex-start
    align-items: flex-start;
    position: relative;
    flex-basis: 50%;
    @media only screen and (max-width: 1315px) {
      flex-basis: 100%;
    }
  }
`;

// Sheet

export class SheetPage extends Component {
  static propTypes = {
    activeSheet: PropTypes.object.isRequired,
    allSheets: PropTypes.array.isRequired,
    getSheet: PropTypes.func.isRequired,
    getItem: PropTypes.func.isRequired,
    addToCart: PropTypes.func.isRequired,
    updateNavColor: PropTypes.func.isRequired,
  };

  componentDidUpdate(prevProps) {
    const {
      match: {
        params: {sheetId},
      },
    } = this.props;
    const prevsheetId = prevProps.match.params.sheetId;
    if (!isEmpty(this.props.activeSheet)) {
      if (typeof this.props.activeSheet.item !== 'object') {
        this.props.getItem(this.props.activeSheet.item);
      }
    }
    if (prevsheetId !== sheetId) {
      window.scrollTo(0, 0);
      this.props.getSheet(sheetId);
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.updateNavColor('primaryBg');
    const {
      match: {
        params: {sheetId},
      },
    } = this.props;
    this.props.getSheet(sheetId);
  }

  handleAddToCart = itemId => {
    this.props.addToCart(this.props.activeSheet);
  };

  render() {
    const {activeSheet} = this.props;
    if (isEmpty(activeSheet)) {
      return <Page bg="primaryBg" alignItems="center" px="40px"></Page>;
    }
    const relatedSheets = Array.from(this.props.allSheets).filter(
      recSheet =>
        recSheet.use_case === activeSheet.use_case && recSheet.id !== activeSheet.id
    );
    const price = activeSheet.item.price / 100;
    return (
      <Fragment>
        <Section
          bg="primaryBg"
          flexDirection="row"
          minHeight={700}
          px={['20px', '60px']}
          pt="40px"
        >
          <PreviewRow>
            <SheetPreview
              style={{position: 'absolute', left: '0', bottom: '20px'}}
              ml={['auto', 'auto']}
              mr={['auto', 'auto']}
              userSheet={activeSheet}
            />
            <Media
              queries={{
                mobile: `(max-width: 1315px)`,
                desktop: `(min-width: 1316px)`,
              }}
            >
              {matches => (
                <>
                  {matches.mobile && (
                    <img
                      alt="Phone/Tablet"
                      src="/sheet-iphone.png"
                      style={{
                        width: '90%',
                        maxWidth: '427px',
                        height: 'auto',
                        maxHeight: '700px',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                      }}
                    />
                  )}
                  {matches.desktop && (
                    <img
                      alt="Phone/Tablet"
                      src="/sheet-ipad.png"
                      style={{
                        width: '90%',
                        minWidth: '540px',
                        maxWidth: '600px',
                        height: 'auto',
                        maxHeight: '700px',
                        marginRight: 'auto',
                      }}
                    />
                  )}
                </>
              )}
            </Media>
          </PreviewRow>
          <Column>
            <Paragraph mt={['10px', '0px']}>
              {activeSheet.use_case.toUpperCase()}
            </Paragraph>
            <FlexRow justifyContent="space-between">
              <Title variant="large">{activeSheet.title}</Title>
              <SheetButton sheet={activeSheet} />
            </FlexRow>
            <FlexRow justifyContent="space-between" textAlign="right">
              <Title variant="large" color="accent" flexBasis="50%">
                ${price}
              </Title>
              <FlexRow flexBasis="50%" justifyContent="flex-end" alignItems="center">
                <Icon
                  icon={[<IoIosPaper />]}
                  color="accent"
                  variant="small"
                  mb={0}
                  mr="4px"
                />
                <Paragraph mb={0}>{pageCountString(activeSheet.page_count)}</Paragraph>
              </FlexRow>
            </FlexRow>
            <Line />
            <Paragraph
              style={{whiteSpace: 'pre-line'}}
              mt="32px"
              variant="medium"
              color="grey"
            >
              {activeSheet.long_description}
            </Paragraph>
            <FlexColumn mt={20} justifyContent="flex-start" width="100%">
              <FlexRow mr={[0, '10px']} alignItems="center" mb="20px">
                <Icon variant="small" icon={[<FaTag />]} color="accent" mr={10} />
                <Paragraph
                  variant="medium"
                  fontWeight="medium"
                  color="primary"
                  textAlign="left"
                  m={0}
                >
                  Traditionally Costs ${activeSheet.traditional_cost}
                </Paragraph>
              </FlexRow>
              <FlexRow mr={[0, '10px']} alignItems="center" mb="20px">
                <Icon variant="small" icon={[<FaClock />]} color="accent" mr={10} />
                <Paragraph
                  variant="medium"
                  fontWeight="medium"
                  color="primary"
                  textAlign="left"
                  m={0}
                >
                  {activeSheet.hours_saved} Hours Saved
                </Paragraph>
              </FlexRow>
            </FlexColumn>
          </Column>
        </Section>
        {relatedSheets.length > 0 && (
          <Section
            bg="primaryBg"
            flexDirection="column"
            minHeight={450}
            px={['20px', '60px']}
          >
            <FlexRow width="100%" justifyContent="space-between" mt="20px" mb="20px">
              <Title as="h1" variant="small" mb={0}>
                Related Sheets
              </Title>
              <Link to="/sheets">
                <ViewAllSheets alignItems="center">
                  <Paragraph mb={0}>View All Sheets</Paragraph>
                  <Icon icon={[<FaArrowRight />]} variant="small" ml={10} mt={'2px'} />
                </ViewAllSheets>
              </Link>
            </FlexRow>
            <FlexRow justifyContent={['center', 'flex-start']} flexBasis="50%" mt={80}>
              {relatedSheets.slice(0, 4).map(recSheet => (
                <SheetCard
                  icon={[<img alt="Sheet" src={recSheet.icon} />]}
                  title={recSheet.title}
                  paragraph={recSheet.short_description}
                  link={`/sheets/${recSheet.id}`}
                  key={recSheet.id}
                />
              ))}
            </FlexRow>
          </Section>
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  activeSheet: state.sheetsAndItemsReducer.activeSheet,
  allSheets: state.sheetsAndItemsReducer.allSheets,
});

export default connect(
  mapStateToProps,
  {
    getSheet,
    getItem,
    addToCart,
    updateNavColor,
  }
)(SheetPage);

// Imports

import React, { Component } from "react";
import { FaHeart } from 'react-icons/fa';
import { loremIpsum } from "lorem-ipsum";
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import SheetCard from '../../../cards/sheet-card/sheet-card';
import { Section, FlexRow } from '../../../layouts';
import { Title } from '../../../headers';
// import Tabs from '../../../tabs/tabs'

import 'rc-tabs/assets/index.css';
import Tabs, { TabPane } from "rc-tabs";
import TabContent from "rc-tabs/lib/TabContent";
import ScrollableInkTabBar from "rc-tabs/lib/ScrollableInkTabBar";

const styles = {
  display: "flex",
  flexDirection: "row",
  fontFamily: "sans-serif",
  justifyContent: "center",
  marginLeft: "auto",
  marginRight: "auto",
  textAlign: "center",
  width: "auto",
};

const sampPara = () => {return loremIpsum({units: "paragraphs", count: 1, sentenceUpperBound: 7, paragraphLowerBound: 3, paragraphUpperBound: 3})}
const sampTitle = () => {return loremIpsum({units: "sentences", count: 1, sentenceLowerBound: 2, sentenceUpperBound: 2})}

// Sheets

class Sheets extends Component {

  constructor(props) {
    super(props);
    this.state = this.initialState();
    this.onChange = this.onChange.bind(this);
  }

  static propTypes = {
    sheets: PropTypes.array.isRequired,
  }

  initialState() {
    return {
      activeKey: 1,
    }
  }

  onChange = (activeKey) => {
    this.setState({
      activeKey,
    });
  }

  render() {
    const { sheets } = this.props;
    return (
      <Section bg="primaryBg" flexDirection="column" minHeight={700} maxWidth={"1440px"}>
        <Title as="h1" variant="large" mt='40px' mb='30px' width="100%" textAlign="center">
          Our Sheets
        </Title>
        <div style={styles}>
          <Tabs
            renderTabBar={() => <ScrollableInkTabBar onTabClick={this.onChange}/>}
            renderTabContent={() => <TabContent animated={false} />}
            defaultActiveKey={'1'}
          >
              <TabPane tab="Dispense" key="1">
                <FlexRow width="100vw" mt={40} px={"20px"}>
                  {sheets.filter(sheet => { return sheet.use_case === 'Dispensary'}).map(sheet => {
                    return <SheetCard mx={"15px"} icon={[<img src={sheet.icon}/>]} title={sheet.title} paragraph={sheet.short_description} link={`/sheets/${sheet.id}`} />
                  })}
                </FlexRow>
              </TabPane>
              <TabPane tab="Product" key="2">
                <FlexRow width="100vw" mt={40} px={"20px"}>
                  {sheets.filter(sheet => { return sheet.use_case === 'Dispensary'}).map(sheet => {
                    return <SheetCard mx={"15px"} icon={[<img src={sheet.icon}/>]} title={sheet.title} paragraph={sheet.short_description} link={`/sheets/${sheet.id}`} />
                  })}
                </FlexRow>
              </TabPane>
              <TabPane tab="Cultivate" key="3">
                <FlexRow width="100vw" mt={40} px={"20px"}>
                  {sheets.filter(sheet => { return sheet.use_case === 'Dispensary'}).map(sheet => {
                    return <SheetCard mx={"15px"} icon={[<img src={sheet.icon}/>]} title={sheet.title} paragraph={sheet.short_description} link={`/sheets/${sheet.id}`} />
                  })}
                </FlexRow>
              </TabPane>
          </Tabs>
        </div>
      </Section>
    )
  }
};

const mapStateToProps = state => ({
  sheets: state.sheetsAndItemsReducer.allSheets,
});

Sheets.defaultProps = {
  sheets: [],
}

export default connect(
  mapStateToProps,
  {}
)(Sheets);
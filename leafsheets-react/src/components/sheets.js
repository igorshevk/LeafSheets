// Imports

import React, {Component} from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {Section, FlexRow, Container} from './layouts';
import SheetCard from './cards/sheet-card/sheet-card';
import {lightColors} from '../styles/colors';
import {Title} from './headers';
import Tabs from './tabs/tabs';

// Vars

const styles = {
  fontFamily: 'sans-serif',
  textAlign: 'center',
};

const ViewAllLink = styled(Link)`
  color: ${lightColors.primary};
  cursor: pointer;
  font-family: 'Roboto';  
  font-size: 20px;
  line-height: 24px;
  margin-bottom: 70px;
  margin-top: 80px;
  text-align: center;
  marginLeft: auto;
  marginRight: auto
  width: 100%;
  &:hover {
    color: ${lightColors.accent} !important,
  }
`;

// Sheets

class Sheets extends Component {
  static propTypes = {
    allSheets: PropTypes.array.isRequired,
  };

  render() {
    if (!this.props.allSheets || this.props.allSheets.length < 1) {
      return null;
    }
    return (
      <Section justifyContent={["center", "center"]} bg="primaryBg">
        <Container flexDirection="column" alignItems={["center", "center"]} minHeight={700} mx={0}>
          <Title
            as="h1"
            variant="large"
            mt="60px"
            mb="48px"
            width="100%"
            textAlign="center"
          >
            Our Sheets
          </Title>
          <div style={styles}>
            <Tabs activeTab={{id: 'tab2'}}>
              <Tabs.Tab id="tab1" title="Produce">
                <FlexRow justifyContent={["center", "flex-start"]} flexBasis="50%" px={['20px', '60px']} mt={80}>
                  {Array.from(this.props.allSheets)
                    .filter(sheet => sheet.use_case === 'Dispensary')
                    .slice(0, 4)
                    .map(sheet => (
                      <SheetCard
                        icon={[<img alt={`${sheet.title}`} src={sheet.icon} />]}
                        title={sheet.title}
                        paragraph={sheet.long_description}
                        link={`/sheets/${sheet.id}`}
                        key={sheet.id}
                      />
                    ))}
                </FlexRow>
              </Tabs.Tab>
              <Tabs.Tab id="tab2" title="Dispense">
                <FlexRow justifyContent={["center", "flex-start"]} flexBasis="50%" px={['20px', '60px']} mt={80}>
                  {Array.from(this.props.allSheets)
                    .filter(sheet => sheet.use_case === 'Dispensary')
                    .slice(0, 4)
                    .map(sheet => (
                      <SheetCard
                        icon={[<img alt={`${sheet.title}`} src={sheet.icon} />]}
                        title={sheet.title}
                        paragraph={sheet.long_description}
                        link={`/sheets/${sheet.id}`}
                        key={sheet.id}
                      />
                    ))}
                </FlexRow>
              </Tabs.Tab>
              <Tabs.Tab justifyContent={["center", "flex-start"]} id="tab3" title="Cultivate">
                <FlexRow flexBasis="50%" px={['20px', '60px']} mt={80}>
                  {Array.from(this.props.allSheets)
                    .filter(sheet => sheet.use_case === 'Dispensary')
                    .slice(0, 4)
                    .map(sheet => (
                      <SheetCard
                        icon={[<img alt={`${sheet.title}`} src={sheet.icon} />]}
                        title={sheet.title}
                        paragraph={sheet.long_description}
                        link={`/sheets/${sheet.id}`}
                        key={sheet.id}
                      />
                    ))}
                </FlexRow>
              </Tabs.Tab>
            </Tabs>
          </div>
          <ViewAllLink to="/sheets">
              View All Sheets
          </ViewAllLink>
        </Container>
      </Section>
    );
  }
}

const mapStateToProps = state => ({
  allSheets: state.sheetsAndItemsReducer.allSheets,
});

Sheets.defaultProps = {
    allSheets: [],
}

export default connect(mapStateToProps)(Sheets);

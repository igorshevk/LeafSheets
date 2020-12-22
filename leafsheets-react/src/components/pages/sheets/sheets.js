// Imports

import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Select from 'react-select';
import Media from 'react-media';

import {Page, Section, FlexRow, Container} from '../../layouts';
import SheetCard from '../../cards/sheet-card/sheet-card';
import {selectStyles} from '../../inputs/styles/select';
import {updateNavColor} from '../../../actions/ui';
import {breakpoints} from '../../../styles/themes';
import {Paragraph} from '../../paragraph';
import {Title} from '../../headers';
import Tabs from '../../tabs/tabs';

// Vars

export const filterOptions = [
  {value: 'N', label: 'Name'},
  {value: 'P', label: 'Price'},
  {value: 'D', label: 'Newest'},
];

const optionForValue = (options, value) => {
  const option = options.filter(dict => dict.value === value)[0];
  if (option !== undefined) {
    return option.label;
  } else {
    return null;
  }
};

// Sheets

class SheetsPage extends Component {
  constructor(props) {
    super(props);
    this.state = this.initialState();
    this.resize = this.resize.bind(this);
    this.sortByFilter = this.sortByFilter.bind(this);
    this.handleFilterChange = this.handleSelectChange.bind(this);
  }

  initialState() {
    return {
      filter: 'N',
      mobile: false,
    };
  }

  static propTypes = {
    allSheets: PropTypes.array.isRequired,
  };

  resize() {
    this.setState({mobile: window.innerWidth <= 768});
  }

  componentWillMount() {
    this.props.updateNavColor('primaryBg');
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.updateNavColor('primaryBg');
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  handleSelectChange(target, event) {
    this.setState({[target]: event.value});
  }

  sortByFilter(sheets, filter) {
    if (filter === 'N') {
      return sheets.sort((a, b) => {
        return a.title.localeCompare(b.title);
      });
    } else if (filter === 'P') {
      return sheets.sort((a, b) => {
        return a.price - b.price;
      });
    } else if (filter === 'D') {
      return sheets.sort((a, b) => {
        return b.id - a.id;
      });
    }
  }

  render() {
    const defaultFilter = {
      label: optionForValue(filterOptions, this.state.filter),
      value: this.state.filter,
    };
    if (!this.props.allSheets || this.props.allSheets.length < 1) {
      return (
        <Page justifyContent="center" bg="primaryBg" flexDirection="column">
          <img
            alt="No Sheets"
            src="/empty-cart.png"
            style={{height: '180px', marginBottom: '40px', width: 'auto'}}
          />
          <Title variant="medium">No Available Sheets.</Title>
          <Paragraph variant="large" color="primary" mb={32}>
            There are currently no sheets available.
          </Paragraph>
        </Page>
      );
    }
    return (
      <Section
        justifyContent={['center', 'space-between']}
        bg="primaryBg"
        pt={40}
        position="relative"
      >
        <Media
          queries={{
            desktop: `(min-width: ${breakpoints[0]})`,
          }}
        >
          {matches => (
            <>
              {matches.desktop && (
                <FlexRow
                  maxWidth="140px"
                  position="absolute"
                  right={['20px', '60px']}
                  top="39px"
                  zIndex="10"
                >
                  <Select
                    styles={selectStyles}
                    placeholder="State..."
                    options={filterOptions}
                    name={'filter'}
                    value={defaultFilter}
                    onChange={e => this.handleSelectChange('filter', e)}
                  />
                </FlexRow>
              )}
            </>
          )}
        </Media>
        <Container flexDirection="column" minHeight={700} px={['20px', '60px']}>
          <Tabs activeTab={{id: 'tab1'}}>
            <Tabs.Tab id="tab1" title="Produce">
              <FlexRow justifyContent={['center', 'flex-start']} flexBasis="50%" mt={80}>
                {this.sortByFilter(
                  Array.from(this.props.allSheets).filter(sheet => sheet.use_case === 'Dispensary'),
                  this.state.filter
                ).map(sheet => (
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
              <FlexRow justifyContent={['center', 'flex-start']} flexBasis="50%" mt={80}>
                {this.sortByFilter(
                  Array.from(this.props.allSheets).filter(sheet => sheet.use_case === 'Dispensary'),
                  this.state.filter
                )
                  .sort((a, b) => a.title - b.title)
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
            <Tabs.Tab id="tab3" title="Cultivate">
              <FlexRow justifyContent={['center', 'flex-start']} flexBasis="50%" mt={80}>
                {this.sortByFilter(
                  Array.from(this.props.allSheets).filter(sheet => sheet.use_case === 'Dispensary'),
                  this.state.filter
                )
                  .sort((a, b) => a.title - b.title)
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
        </Container>
      </Section>
    );
  }
}

const mapStateToProps = state => ({
  allSheets: state.sheetsAndItemsReducer.allSheets,
});

export default connect(mapStateToProps, {updateNavColor})(SheetsPage);

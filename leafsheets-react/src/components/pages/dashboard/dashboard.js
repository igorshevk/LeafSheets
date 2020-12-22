// Imports

import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import UserSheetCard from '../../cards/user-sheet-card/user-sheet-card';
import {getUserSheets} from '../../../actions/sheets';
import {updateNavColor} from '../../../actions/ui';
import {FlexRow, Container} from '../../layouts';
import {Paragraph} from '../../paragraph';
import {Title} from '../../headers';
import {Page} from '../../layouts';

// Login

export class DashboardPage extends Component {
  constructor(props) {
    super(props);
    this.renderUserSheets = this.renderUserSheets.bind(this);
  }

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    updateNavColor: PropTypes.func.isRequired,
    userSheets: PropTypes.array.isRequired,
    getUserSheets: PropTypes.func.isRequired,
  };

  componentWillMount() {
    window.scroll(0,0);
    this.props.updateNavColor('secondaryBg');
    this.props.getUserSheets();
  }

  renderUserSheets(userSheets) {
    const sortedUserSheets = userSheets.sort((a, b) => {
      return a.sheet.title.localeCompare(b.sheet.title);
    });
    return (
      <>
        {sortedUserSheets &&
          sortedUserSheets.map(userSheet => (
            <UserSheetCard mr={40} ml={[40, 0]} userSheet={userSheet} />
          ))}
      </>
    );
  }

  hoursSaved(items) {
    if (items && items.length > 0) {
      return items.reduce((a, b) => +a + +b['sheet']['hours_saved'], 0);
    } else {
      return 0;
    }
  }

  render() {
    const {isAuthenticated, companies, userSheets} = this.props;
    const documentsCount = userSheets.length;
    const hoursSaved = this.hoursSaved(userSheets);
    if (!isAuthenticated) {
      return <Redirect to="/login" />;
    }
    if (!companies || companies.length < 1 || companies[0].verified === false) {
      return <Redirect to="/onboarding" />;
    }
    const qualifier = parseInt(documentsCount) === 1 ? 'sheet' : 'sheets';
    return (
      <Page
        alignItems="flex-start"
        justifyContent={['center', 'flex-start']}
        bg="white"
        pt={'80px'}
        pb={'96px'}
      >
        <Container
          alignItems="flex-start"
          justifyContent={['center', 'flex-start']}
          flexDirection="column"
          px={['20px', '60px']}
          py="48px"
        >
          <Title
            textAlign={['center', 'flex-start']}
            mx={['auto', '0']}
            color="accent"
            mb={'10px'}
          >
            Purchased Sheets
          </Title>
          <Paragraph textAlign={['center', 'flex-start']} mx={['auto', '0']}>
            You own {' '}
            <span style={{fontWeight: 'bold', fontSize: '16px'}}>{documentsCount}</span>{' '}
            {qualifier} and have saved yourself{' '}
            <span style={{fontWeight: 'bold', fontSize: '16px'}}>{hoursSaved}</span> hours
            of time!
          </Paragraph>
          <FlexRow justifyContent={['center', 'flex-start']} alignItems="center" mt={48}>
            {this.renderUserSheets(userSheets)}
          </FlexRow>
        </Container>
      </Page>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.authReducer.isAuthenticated,
  userSheets: state.sheetsAndItemsReducer.userSheets,
  companies: state.companiesReducer.companies
});

export default connect(
  mapStateToProps,
  {
    getUserSheets,
    updateNavColor,
  }
)(DashboardPage);

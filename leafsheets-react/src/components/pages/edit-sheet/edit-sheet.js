// Imports

import Loader from 'react-loader-spinner';
import {Redirect} from 'react-router-dom';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import EditSheetForm from '../../forms/edit-sheet-form';
import {getCompanies} from '../../../actions/companies';
import {getUserSheet} from '../../../actions/sheets';
import Analytics from '../../../clients/analytics';
import {updateNavColor} from '../../../actions/ui';
import {Page, Container} from '../../layouts';
import ControlPanel from './control-panel';

// Edit Sheet Page

export class EditSheetPage extends Component {
  constructor(props) {
    super(props);
    this.state = this.initialState();
    this.editSheetRef = React.createRef();
    this.handleSbumit = this.handleSubmit.bind(this);
    this.handleSaveEnabled = this.handleSaveEnabled.bind(this);
  }

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    getUserSheet: PropTypes.func.isRequired,
    getCompanies: PropTypes.func.isRequired,
    updateNavColor: PropTypes.func.isRequired,
    userSheets: PropTypes.array.isRequired,
    activeUserSheet: PropTypes.array.isRequired,
  };

  initialState() {
    return {
      companies: [],
      userSheet: null,
      saveEnabled: false,
      showPreview: false,
    };
  }

  async componentDidUpdate(prevProps) {
    // Fetch a new sheet if the sheet ID has changed.
    const {
      match: {
        params: {sheetId},
      },
    } = this.props;
    const prevSheetId = prevProps.match.params.sheetId;
    if (
      prevSheetId !== sheetId &&
      this.state.userSheet &&
      this.state.sheetId !== sheetId
    ) {
      window.scroll(0, 0);
      const userSheet = await this.props.getUserSheet(sheetId);
      this.setState({userSheet});
    }
    // Update the user Sheet if the activeUserSheet has changed.
    const prevActiveUserSheet = prevProps.activeUserSheet;
    const activeUserSheet = this.props.activeUserSheet;
    if (prevActiveUserSheet !== activeUserSheet) {
      this.setState({userSheet: activeUserSheet});
    }
  }

  async componentDidMount() {
    window.scrollTo(0, 0);
    const {updateNavColor, getCompanies, getUserSheet} = this.props;
    const {
      match: {
        params: {sheetId},
      },
    } = this.props;
    getCompanies();
    updateNavColor('white');
    let userSheet = await getUserSheet(sheetId);
    this.setState({userSheet});
    Analytics.logUserSheetAction('user_sheet__edit', userSheet)
  }

  componentWillUnmount() {
    this.setState({userSheet: null});
  }

  handleSaveEnabled(saveEnabled) {
    if (this.state.saveEnabled !== saveEnabled) {
      this.setState({saveEnabled});
    }
  }

  async handleSubmit() {
    await this.editSheetRef.current.handleSubmit();
  }

  render() {
    const {isAuthenticated} = this.props;
    const {userSheet} = this.state;
    if (!isAuthenticated) {
      return <Redirect to="/login" />;
    }
    if (userSheet === null || userSheet === undefined) {
      return (
        <Page bg="white" alignItems="center" justifyContent="center" pt="100px">
          <ControlPanel
            userSheet={userSheet}
            saveEnabled={this.state.saveEnabled}
            handleSubmit={this.handleSbumit}
          />
          <Loader type="TailSpin" color="#30E1A5" height={60} width={60} visible={true} />
        </Page>
      );
    } else {
      return (
        <Page bg="white" alignItems="flex-start" justifyContent="center" pt="144px">
          <ControlPanel
            userSheet={userSheet}
            saveEnabled={this.state.saveEnabled}
            handleSubmit={this.handleSbumit}
          />
          <Container
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            px={['20px', '60px']}
          >
            <EditSheetForm
              userSheet={userSheet}
              handleSaveEnabled={this.handleSaveEnabled}
              ref={this.editSheetRef}
              maxWidth="600px"
            />
          </Container>
        </Page>
      );
    }
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.authReducer.isAuthenticated,
  activeUserSheet: state.sheetsAndItemsReducer.activeUserSheet,
  userSheets: state.sheetsAndItemsReducer.userSheets,
  companies: state.companiesReducer.companies,
});

EditSheetPage.defaultProps = {
  activeUserSheet: null,
  userSheets: [],
  userSheet: null,
  companies: [],
};

export default connect(
  mapStateToProps,
  {
    getCompanies,
    getUserSheet,
    updateNavColor,
  }
)(EditSheetPage);

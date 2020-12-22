// Imports

import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';
import {Provider as AlertProvider} from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import BackgroundDimmer from './components/background-dimmer/background-dimmer';
import OverlayLoader from './components/loaders/overlay-loader';
import Sidebar from './components/sidebar/sidebar';
import Header from './components/header/header';
import Footer from './components/footer/footer';
import Alerts from './components/alerts/alerts';

import OnboardingPage from './components/pages/onboarding/onboarding';
import EditSheetPage from './components/pages/edit-sheet/edit-sheet';
import DashboardPage from './components/pages/dashboard/dashboard';
import RegisterPage from './components/pages/register/register';
import CheckoutPage from './components/pages/checkout/checkout';
import NotFoundPage from './components/pages/errors/not-found';
import ReceiptPage from './components/pages/checkout/receipt';
import AccountPage from './components/pages/account/account';
import ChargesPage from './components/pages/charges/charges';
import SheetsPage from './components/pages/sheets/sheets';
import SheetPage from './components/pages/sheet/sheet';
import IndexPage from './components/pages/index/index';
import LoginPage from './components/pages/login/login';

import { getAllSheets, getUserSheets } from './actions/sheets';
import FileViewer from './components/file-viewer/file-viewer';
import { getPaymentMethods } from './actions/payment-methods';
import { getCart, getCartItems } from './actions/cart';
import { getCompanies } from './actions/companies';
import { getAddresses } from './actions/addresses';
import { getCharges } from './actions/charges';
import { closeSidebar } from './actions/ui';
import { loadUser, logout } from './actions/auth';
import { endLoading } from './actions/ui';

import { lightTheme } from './styles/themes.js';
import GlobalStyle from './global-style';

// import PrivateRoute from './components/private-route';

// Initialize Firebase
import './clients/firebase';

// Options

const alertOptions = {
  timeout: 3000,
  position: 'bottom center',
};

// App

class App extends React.Component {

  state = { firstFetch: true }

  static propTypes = {
    getCart: PropTypes.func.isRequired,
    getCompanies: PropTypes.func.isRequired,
    getCharges: PropTypes.func.isRequired,
    getCartItems: PropTypes.func.isRequired,
    userSheets: PropTypes.array.isRequired,
    getUserSheets: PropTypes.func.isRequired,
    getAddresses: PropTypes.func.isRequired,
    getPaymentMethods: PropTypes.func.isRequired,
    closeSidebar: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    endLoading: PropTypes.func.isRequired,
  }

  componentDidUpdate(prevProps) {
    const prevIsAuthenticated = prevProps.isAuthenticated;
    // Load the User once the store is rehydrated 
    // and credentials have (potentially) been restored.
    if (prevProps.isRehydrated === false && this.props.isRehydrated === true) {
      this.props.loadUser();
    }
    // Fetch some User sheet, cart, address, payment info.
    if (prevIsAuthenticated !== this.props.isAuthenticated) {
      if (this.props.isAuthenticated && this.state.firstFetch === true) {
        this.setState({ firstFetch: false })
        this.props.getPaymentMethods();
        this.props.getUserSheets();
        this.props.getCompanies();
        this.props.getAddresses();
        this.props.getCartItems();
        this.props.getCharges();
        this.props.getCart();
      }
    }
  }

  componentDidMount() {
    this.props.endLoading();
    // TODO: Initialize Google Analytics
    this.props.getAllSheets();
    if (this.props.isAuthenticated) {
      this.props.getCompanies();
    }
  }

  render() {
    return (
      <ThemeProvider theme={lightTheme}>
        <AlertProvider template={AlertTemplate} {...alertOptions}>
          <Router>
            <Fragment>
              <GlobalStyle />
              <Header />
              <Alerts />
              <OverlayLoader />
              <FileViewer />
              <Sidebar />
              <BackgroundDimmer />
              <Switch>
                <Route exact path="/" component={IndexPage} />                
                <Route exact path="/login" component={LoginPage} />
                <Route exact path="/sheets" component={SheetsPage} />
                <Route exact path="/orders" component={ChargesPage} />
                <Route exact path="/dashboard" component={DashboardPage} />
                <Route exact path="/account" component={AccountPage} />
                <Route exact path="/checkout" component={CheckoutPage} />
                <Route exact path="/register" component={RegisterPage} />
                <Route exact path="/onboarding" component={OnboardingPage} />
                <Route exact path="/sheets/:sheetId" component={SheetPage} />
                <Route exact path="/receipts/:chargeId" component={ReceiptPage} />
                <Route exact path="/dashboard/sheets/:sheetId" component={EditSheetPage} />
                <Route component={NotFoundPage} />
              </Switch>
              <Footer />
            </Fragment>
          </Router>
        </AlertProvider>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.authReducer.isAuthenticated,
  user: state.authReducer.user,
  userSheets: state.sheetsAndItemsReducer.userSheets,
  isRehydrated: state._persist.rehydrated,
});

export default connect(
  mapStateToProps,
  { loadUser,
    logout,
    getCompanies,
    getAllSheets,
    getUserSheets,
    getCharges,
    getCart, 
    getCartItems,
    getAddresses,
    getPaymentMethods,
    closeSidebar,
    endLoading }
)(App)

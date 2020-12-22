// Imports

import { combineReducers } from 'redux';

import sheetsAndItemsReducer from './sheets-and-items';
import paymentMethodsReducer from './payment-methods';
import addressesReducer from './addresses';
import companiesReducer from './companies';
import messagesReducer from './messages';
import chargeReducer from './charges';
import errorsReducer from './errors';
import authReducer from './auth';
import cartReducer from './cart';
import uiReducer from './ui';

// Root Reducer

export default combineReducers({
  sheetsAndItemsReducer,
  paymentMethodsReducer,
  addressesReducer,
  companiesReducer,
  messagesReducer,
  errorsReducer,
  chargeReducer,
  authReducer,
  cartReducer,
  uiReducer,
});

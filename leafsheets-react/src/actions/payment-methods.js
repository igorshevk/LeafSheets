// Imports

import axios from 'axios';

import { 
  GET_PAYMENT_METHODS_URL,
  GET_PAYMENT_METHOD_URL, 
  ADD_PAYMENT_METHOD_URL, 
  DELETE_PAYMENT_METHOD_URL,
  UPDATE_PAYMENT_METHOD_URL,
  } from '../urls';
import { returnErrors } from './errors';
import { 
  GET_PAYMENT_METHODS,
  GET_PAYMENT_METHOD,
  ADD_PAYMENT_METHOD,
  DELETE_PAYMENT_METHOD,
  UPDATE_PAYMENT_METHOD, 
  } from './types';
import { buildQueryParams } from '../utils/query-params';
import Analytics from '../clients/analytics';
import { isEmpty } from '../utils/empty';
import { tokenConfig } from './auth';

// Actions

// GET Payment Methods
export const getPaymentMethods = (queryParams) => (dispatch, getState) => {
 let params = "";
 if (!isEmpty(queryParams)) {
  params = buildQueryParams(queryParams);
  params = `?${params}`;
 }
 axios
  .get(`${GET_PAYMENT_METHODS_URL}${params}`, tokenConfig(getState))
  .then(res => {
    dispatch({
      type: GET_PAYMENT_METHODS,
      payload: res.data,
    });
  })
  .catch(err => {
    dispatch(returnErrors(err.response.data, err.response.status));
  });
}

// GET Payment Method
export const getPaymentMethod = (paymentMethodId) => (dispatch, getState) => {
  axios
    .get(`${GET_PAYMENT_METHOD_URL}${paymentMethodId}`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_PAYMENT_METHOD,
        payload: res.data,
      });
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
} 

// ADD Payment Method
export const addPaymentMethod = ({token, makeDefaultCard}) => (dispatch, getState) => {
  Analytics.logCardAction('card__create');
  const body = JSON.stringify({ token: token, isDefault: makeDefaultCard});
  return axios
    .post(ADD_PAYMENT_METHOD_URL, body, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: ADD_PAYMENT_METHOD,
        payload: res.data,
      });
      return res.data
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
} 

// DELETE Payment Method
export const deletePaymentMethod = (paymentMethodId) => (dispatch, getState) => {
  Analytics.logCardAction('card__delete');
  axios
    .delete(`${DELETE_PAYMENT_METHOD_URL}${paymentMethodId}`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: DELETE_PAYMENT_METHOD,
        payload: res.data,
      });
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

// UPDATE Payment Method
export const updatePaymentMethod = (paymentMethodId, isDefault) => (dispatch, getState) => {
  const body = JSON.stringify({isDefault});
  axios
    .patch(`${UPDATE_PAYMENT_METHOD_URL}${paymentMethodId}/`, body, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: UPDATE_PAYMENT_METHOD,
        payload: res.data,
      });
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

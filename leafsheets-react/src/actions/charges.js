// Imports

import axios from 'axios';

import { 
  GET_CHARGES_URL,
  ADD_CHARGE_URL, 
  } from '../urls';
import { returnErrors } from './errors';
import { 
  GET_CHARGES,
  ADD_CHARGE,
  } from './types';
import { tokenConfig } from './auth';

// Actions

// GET Charges
export const getCharges = () => (dispatch, getState) => {
 axios
  .get(GET_CHARGES_URL, tokenConfig(getState))
  .then(res => {
    dispatch({
      type: GET_CHARGES,
      payload: res.data,
    });
  })
  .catch(err => {
    dispatch(returnErrors(err.response.data, err.response.status));
  });
}

// ADD Charge
export const addCharge = ({paymentMethodID, billingAddressID}) => (dispatch, getState) => {
  const body = JSON.stringify({ 
    paymentMethodType: 'card', 
    paymentMethodID: paymentMethodID, 
    billingAddressID: billingAddressID
  });
  return axios
    .post(ADD_CHARGE_URL, body, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: ADD_CHARGE,
        payload: res.data,
      });
      return res.data
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
} 
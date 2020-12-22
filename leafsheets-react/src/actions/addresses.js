// Imports

import axios from 'axios';

import { 
  GET_ADDRESSES_URL,
  GET_ADDRESS_URL, 
  ADD_ADDRESS_URL, 
  DELETE_ADDRESS_URL,
  UPDATE_ADDRESS_URL,
  } from '../urls';
import { returnErrors } from './errors';
import { 
  GET_ADDRESSES,
  GET_ADDRESS,
  ADD_ADDRESS,
  DELETE_ADDRESS,
  UPDATE_ADDRESS, 
  } from './types';
import { buildQueryParams } from '../utils/query-params';
import Analytics from '../clients/analytics';
import { isEmpty } from '../utils/empty';
import { tokenConfig } from './auth';

// Actions

// GET Addresses
export const getAddresses = (queryParams) => (dispatch, getState) => {
 let params = "";
 if (!isEmpty(queryParams)) {
  params = buildQueryParams(queryParams);
  params = `?${params}`;
 }
 axios
  .get(`${GET_ADDRESSES_URL}${params}`, tokenConfig(getState))
  .then(res => {
    dispatch({
      type: GET_ADDRESSES,
      payload: res.data,
    });
  })
  .catch(err => {
    dispatch(returnErrors(err.response.data, err.response.status));
  });
}

// GET Address
export const getAddress = (addressId) => (dispatch, getState) => {
  axios
    .get(`${GET_ADDRESS_URL}${addressId}`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_ADDRESS,
        payload: res.data,
      });
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

// ADD Address
export const addAddress = ({google_place, user_address, kind, makeDefaultAddress}) => (dispatch, getState) => {
  Analytics.logAddressAction('address__create')
  const body = JSON.stringify({google_place, user_address, kind, isDefault: makeDefaultAddress});
  return axios
    .post(ADD_ADDRESS_URL, body, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: ADD_ADDRESS,
        payload: res.data,
      });
      return res.data
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
      return null
    });
};

// DELETE Address
export const deleteAddress = (addressId) => (dispatch, getState) => {
  Analytics.logAddressAction('address__delete')
  axios
    .delete(`${DELETE_ADDRESS_URL}${addressId}`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: DELETE_ADDRESS,
        payload: res.data,
      });
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

// UPDATE Address
export const updateAddress = (addressId, isDefault) => (dispatch, getState) => {
  Analytics.logAddressAction('address__update')
  const body = JSON.stringify({isDefault});
  axios
    .patch(`${UPDATE_ADDRESS_URL}${addressId}/`, body, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: UPDATE_ADDRESS,
        payload: res.data,
      });
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

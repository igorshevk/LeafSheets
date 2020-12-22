// Imports

import axios from 'axios';

import { ADD_CART_ITEM_URL, GET_CART_URL, GET_CART_ITEMS_URL, DELETE_CART_ITEM_URL } from '../urls';
import { returnErrors } from './errors';
import { ADD_CART_ITEM, GET_CART, GET_CART_ITEMS, DELETE_CART_ITEM } from './types';
import { tokenConfig } from './auth';

import Analytics from '../clients/analytics';

// Actions

// Add to Cart
export const addToCart = (sheet, quantity) => (dispatch, getState) => {
  Analytics.logSheetAction('sheet__add_to_cart', sheet);
  const item = sheet.item;
  const id = item.id;
  const body = JSON.stringify({id, quantity});
  axios
    .post(ADD_CART_ITEM_URL, body, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: ADD_CART_ITEM,
        payload: res.data,
      });
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

export const deleteFromCart = (orderItem, quantity) => (dispatch, getState) => {
  Analytics.logSheetAction('sheet__remove_from_cart', orderItem.sheet);
  const id = orderItem.sheet.item;
  const body = JSON.stringify({quantity});
  axios
    .delete(`${DELETE_CART_ITEM_URL}${id}`, tokenConfig(getState), body)
    .then(res => {
      dispatch({
        type: DELETE_CART_ITEM,
        payload: res.data,
      });
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
}

// Get Cart Items
export const getCartItems = () => (dispatch, getState) => {
  axios
    .get(GET_CART_ITEMS_URL, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_CART_ITEMS,
        payload: res.data,
      });
    })
    .catch(err => {
      dispatch(returnErrors(err.response.dat, err.response.status));
    });
}

// Get Cart
export const getCart = () => (dispatch, getState) => {
  axios
    .get(GET_CART_URL, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_CART,
        payload: res.data,
      });
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
}


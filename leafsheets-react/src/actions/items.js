// Imports

import axios from 'axios';

import { GET_ITEM }  from './types';
import { returnErrors } from './errors';
import { GET_ITEM_URL } from '../urls';

// Actions

// Get Item
export const getItem = itemId => dispatch => {
  axios
    .get(`${GET_ITEM_URL}${itemId}`)
    .then(res => {
      dispatch({
        type: GET_ITEM,
        payload: res.data,
      });
    })
    .catch(err => dispatch(returnErrors(err.response.data, err.response.status)))
}
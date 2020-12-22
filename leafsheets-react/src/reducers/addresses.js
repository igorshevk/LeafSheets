// Imports

import {
  GET_ADDRESSES, 
  GET_ADDRESS, 
  ADD_ADDRESS,
  DELETE_ADDRESS,
  UPDATE_ADDRESS,
  LOGOUT_SUCCESS
} from '../actions/types';

// Reducers

const initialState = {
  billingAddresses: [],
  shippingAddresses: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ADDRESSES:
    case GET_ADDRESS:
    case ADD_ADDRESS:
    case DELETE_ADDRESS:
    case UPDATE_ADDRESS:
      return {
        ...state,
        billingAddresses: action.payload.filter(address => address.kind === 'B'),
        shippingAddresses: action.payload.filter(address => address.kind === 'S'),
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        billingAddresses: [],
        shippingAddresses: []
      }
    default:
      return state;
  }
}

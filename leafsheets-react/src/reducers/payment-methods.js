// Imports

import {
  GET_PAYMENT_METHODS, 
  GET_PAYMENT_METHOD, 
  ADD_PAYMENT_METHOD,
  DELETE_PAYMENT_METHOD,
  UPDATE_PAYMENT_METHOD,
  LOGOUT_SUCCESS
} from '../actions/types';

// Reducers

const initialState = {
  paymentMethods: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_PAYMENT_METHODS: 
    case GET_PAYMENT_METHOD:
    case ADD_PAYMENT_METHOD:
    case DELETE_PAYMENT_METHOD:
    case UPDATE_PAYMENT_METHOD:
      return {
        ...state,
        paymentMethods: action.payload
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        paymentMethods: []
      }
    default:
      return state;
  }
}

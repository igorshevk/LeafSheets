// Imports

import {
    GET_CHARGES, 
    ADD_CHARGE,
    LOGOUT_SUCCESS
  } from '../actions/types';
  
  // Reducers
  
  const initialState = {
    charges: [],
  };
  
  export default function(state = initialState, action) {
    switch (action.type) {
      case GET_CHARGES: 
      case ADD_CHARGE:
        return {
          ...state,
          charges: action.payload
        };
      case LOGOUT_SUCCESS:
        return {
          ...state,
          charges: []
        }
      default:
        return state;
    }
  }
  
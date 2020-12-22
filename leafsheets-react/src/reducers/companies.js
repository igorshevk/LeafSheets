// Imports

import {
  GET_COMPANIES,
  DELETE_COMPANY,
  ADD_COMPANY,
  UPDATE_COMPANY,
  LOGOUT_SUCCESS
} from '../actions/types';

// Reducers

const initialState = {
  companies: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_COMPANIES:
      return {
        ...state,
        companies: action.payload,
      };
    case DELETE_COMPANY:
      return {
        ...state,
        companies: action.payload,
        // companies: state.companies.filter(company => company.id !== action.payload),
      };
    case ADD_COMPANY:
      return {
        ...state,
        companies: action.payload,
      };
    case UPDATE_COMPANY:
      return {
        ...state,
        companies: action.payload,
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        companies: [],
      };
    default:
      return state;
  }
}

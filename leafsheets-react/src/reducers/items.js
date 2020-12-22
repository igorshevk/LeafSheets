// Imports

import { GET_ITEM } from '../actions/types';

// Reducers

const initialState = {
  sheets: [],
  sheet: {},
};

export default function(state = initialState, action) {
    case GET_ITEM:
      return {
        ...state,
        sheet: {...state.sheet, item: action.payload}
      }
    default:
      return state;
  }
}
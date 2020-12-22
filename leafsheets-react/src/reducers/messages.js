// Imports

import {CREATE_MESSAGE} from '../actions/types';

// State

const initialState = {};

// Reducer

export default function(state = initialState, action) {
  switch (action.type) {
    case CREATE_MESSAGE:
      return (state = action.payload);
    default:
      return state;
  }
}

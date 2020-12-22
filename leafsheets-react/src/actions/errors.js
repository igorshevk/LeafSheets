// Imports

import { GET_ERRORS } from './types';

// Actions

// GET Errors
export const returnErrors = (msg, status) => {
  return {
    type: GET_ERRORS,
    payload: {msg, status},
  };
};

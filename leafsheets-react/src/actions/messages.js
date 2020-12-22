// Imports

import {CREATE_MESSAGE} from './types';

// Actions

// CREATE Message
export const createMessage = msg => {
  return {
    type: CREATE_MESSAGE,
    payload: msg,
  };
};

// Imports

import axios from 'axios';

import { 
  LOGIN_URL,
  LOGOUT_URL, 
  REGISTER_URL, 
  GET_USER_URL,
  UPDATE_USER_URL
} from '../urls';
import { returnErrors } from './errors';
import { 
  USER_LOADED, 
  USER_LOADING, 
  AUTH_ERROR,
  LOGIN_SUCCESS, 
  LOGIN_FAIL, 
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS, 
  REGISTER_FAIL,
  UPDATE_USER
  } from './types';
import Analytics from '../clients/analytics';

// Actions

// GET User
export const loadUser = () => (dispatch, getState) => {
  // User Loading
  dispatch({type: USER_LOADING});
  axios
    .get(GET_USER_URL, tokenConfig(getState))
    .then(res => {
      const user = res.data;
      try {
        Analytics.setUserId(user.id);
      } catch(e) {
        throw e
      }
      dispatch({
        type: USER_LOADED,
        payload: res.data,
      });
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({type: AUTH_ERROR});
    });
};

export const updateUser = (updates) => (dispatch, getState) => {
  Analytics.logUserAction('user__update');
  const body = JSON.stringify(updates);
  axios
    .patch(`${UPDATE_USER_URL}`, body, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: UPDATE_USER,
        payload: res.data,
      });
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};


// LOGIN USER
export const login = (email, password) => dispatch => {
  // Headers
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  // Request Body
  const body = JSON.stringify({email, password});
  axios
    .post(LOGIN_URL, body, config)
    .then(res => {
      Analytics.logUserAction('user__login');
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({type: LOGIN_FAIL});
    });
};

// REGISTER USER
export const register = ({ email, password }) => dispatch => {
  // Headers
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  // Request Body
  const body = JSON.stringify({email, password});
  axios
    .post(REGISTER_URL, body, config)
    .then(res => {
      Analytics.logUserAction('user__create')
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
    })
    .catch(err => {
      console.log(err)
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({type: REGISTER_FAIL});
    });
};

// LOGOUT USER
export const logout = () => (dispatch, getState) => {
  Analytics.logUserAction('user__logout');
  axios
    .post(LOGOUT_URL, null, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: LOGOUT_SUCCESS,
      });
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({type: LOGOUT_SUCCESS});
    });
};


// Setup config with Token - Helper function
export const tokenConfig = (getState, contentType='application/json') => {
  // Get token from state
  const token = getState().authReducer.token;
  // Headers
  const config = {
    headers: {
      'Content-Type': contentType,
    },
  };
  // If Token, add to headers config
  if (token) {
    config.headers['Authorization'] = `Token ${token}`;
  }
  return config
}
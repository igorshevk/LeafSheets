// Imports

import axios from 'axios';

import {
  GET_ALL_SHEETS,
  GET_SHEET,
  EMPTY_SHEET,
  GET_USER_SHEETS,
  GET_USER_SHEET,
  UPDATE_USER_VARIABLE_DICT,
  SET_ACTIVE_USER_SHEET,
  GENERATE_USER_SHEET,
  DOWNLOAD_USER_SHEET,
  PREVIEW_USER_SHEET
} from './types';
import {
  GET_SHEETS_URL,
  GET_SHEET_URL,
  GET_USER_SHEETS_URL,
  GET_USER_SHEET_URL,
  UPDATE_USER_VARIABLE_DICT_URL,
} from '../urls';
import {getUpdatedUserVariableDict} from '../utils/sheets';
import Analytics from '../clients/analytics';
import {returnErrors} from './errors';
import {tokenConfig} from './auth';

// Actions

// Set Active User Sheet
export const setActiveUserSheet = (userSheet) => dispatch => {
  dispatch({
    type: SET_ACTIVE_USER_SHEET,
    payload: userSheet,
  });
};

// Get All Sheets
export const getAllSheets = () => dispatch => {
  axios
    .get(GET_SHEETS_URL)
    .then(res => {
      dispatch({
        type: GET_ALL_SHEETS,
        payload: res.data,
      });
    })
    .catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

// Get Sheet
export const getSheet = sheetId => dispatch => {
  dispatch({type: EMPTY_SHEET});
  axios
    .get(`${GET_SHEET_URL}${sheetId}`)
    .then(res => {
      const sheet = res.data;
      Analytics.logSheetAction('sheet__view', sheet)
      dispatch({
        type: GET_SHEET,
        payload: sheet,
      });
    })
    .catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

// Get User Sheet

export const getUserSheet = sheetId => (dispatch, getState) => {
  return axios
    .get(`${GET_USER_SHEET_URL}${sheetId}/`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_USER_SHEET,
        payload: res.data,
      });
      return res.data;
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

// Get User Sheets
export const getUserSheets = () => (dispatch, getState) => {
  axios
    .get(GET_USER_SHEETS_URL, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_USER_SHEETS,
        payload: res.data,
      });
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

// Update User Variable Dict
export const updateUserVariableDict = (userSheet, updates) => (dispatch, getState) => {
  Analytics.logUserSheetAction('user_sheet__update', userSheet);
  const userVariableDict = getUpdatedUserVariableDict(userSheet, updates);
  const body = JSON.stringify({"user_variable_dict": userVariableDict});
  const userSheetId = userSheet.id;
  return axios
    .patch(`${UPDATE_USER_VARIABLE_DICT_URL}${userSheetId}/`, body, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: UPDATE_USER_VARIABLE_DICT,
        payload: res.data,
      });
      return res.data;
    })
    .catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

// Save the User Sheet
export const generateUserSheet = (userSheet) => (dispatch, getState) => {
  Analytics.logUserSheetAction('user_sheet__save', userSheet);
  const userSheetId = userSheet.id;
  return axios
    .get(`${GET_USER_SHEET_URL}${userSheetId}/generate/`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GENERATE_USER_SHEET,
        payload: res.data,
      });
      return res.data;
    })
    .catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
}

// Preview the User Sheet
export const previewUserSheet = (preview, userSheet) => (dispatch) => {
  if (userSheet !== null) {
    Analytics.logUserSheetAction('user_sheet__preview', userSheet);
  }
  dispatch({
    type: PREVIEW_USER_SHEET,
    payload: {
      preview: preview,
      userSheet: userSheet
    }
  });
}

// Download the User Sheet
export const downloadUserSheet = (userSheet) => (dispatch) => {
  Analytics.logUserSheetAction('user_sheet__download', userSheet)
  return axios
    .get(userSheet.user_variable_pdf)
    .then(res => {
      dispatch({
        type: DOWNLOAD_USER_SHEET,
      });
      return res.data;
    })
    .catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
}


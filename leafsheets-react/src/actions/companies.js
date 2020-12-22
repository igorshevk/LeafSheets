// Imports

import axios from 'axios';

import {
  GET_COMPANIES_URL,
  UPDATE_COMPANY_URL,
  ADD_COMPANY_URL,
  DELETE_COMPANY_URL,
  UPLOADS_URL
} from '../urls';
import {GET_COMPANIES, DELETE_COMPANY, ADD_COMPANY, UPDATE_COMPANY} from './types';
import Analytics from '../clients/analytics';
import {returnErrors} from './errors';
import {tokenConfig} from './auth';

// Actions

// GET Companies
export const getCompanies = () => (dispatch, getState) => {
  axios
    .get(GET_COMPANIES_URL, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_COMPANIES,
        payload: res.data,
      });
    })
    .catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

// ADD Company
export const addCompany = company => (dispatch, getState) => {
  Analytics.logCompanyAction('company__create')
  axios
    .post(ADD_COMPANY_URL, company, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: ADD_COMPANY,
        payload: res.data,
      });
    })
    .catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

// DELETE Company
export const deleteCompany = (companyId) => (dispatch, getState) => {
  Analytics.logCompanyAction('company__delete')
  axios
    .delete(`${DELETE_COMPANY_URL}${companyId}`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: DELETE_COMPANY,
        payload: res.data,
      });
    })
    .catch(err => console.warn(err));
};

// UPDATE Company
export const updateCompany = (companyId, updates) => (dispatch, getState) => {
  Analytics.logCompanyAction('company__update')
  const body = JSON.stringify(updates);
  return axios
    .patch(`${UPDATE_COMPANY_URL}${companyId}/`, body, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: UPDATE_COMPANY,
        payload: res.data,
      });
      return res.data
    })
    .catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

// UPDATE Company Icon
export const updateCompanyIcon = (companyId, icon) => (dispatch, getState) => {
  let formData = new FormData();
  formData.append('model', 'company');
  formData.append('field', 'icon');
  formData.append('id', companyId);
  formData.append('file', icon);
  axios
    .put(UPLOADS_URL, formData, tokenConfig(getState, 'multipart/form-data'))
    .then(res => {
      dispatch(getCompanies());
    })
    .catch(err => dispatch(returnErrors(err.response.data, err.reponse.status)));
};
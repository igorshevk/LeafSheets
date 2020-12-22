// Imports

import {
    OPEN_SIDEBAR,
    CLOSE_SIDEBAR,
    APPLY_BACKGROUND_DIM,
    UNAPPLY_BACKGROUND_DIM,
    BEGIN_LOADING,
    END_LOADING,
    REDIRECT_TO,
    UPDATE_NAV_COLOR,
    CLEAR_FORM
} from '../actions/types';

// State

const initialState = {
  sidebarOpen: false,
  dimApplied: false,
  isLoading: false,
  loadingTitle: 'Loading',
  loadingSubtitle: 'Please be patient while we serve your request',
  redirectEndpoint: null,
  navColor: null,
  clearForm: null,
};

// Reducer

export default function(state = initialState, action) {
  switch (action.type) {
    case OPEN_SIDEBAR:
      return {
        ...state,
        sidebarOpen: true,
      };
    case CLOSE_SIDEBAR:
      return {
        ...state,
        sidebarOpen: false,
      };
    case APPLY_BACKGROUND_DIM:
      return {
        ...state,
        dimApplied: true,
      };
    case UNAPPLY_BACKGROUND_DIM:
      return {
        ...state,
        dimApplied: false,
      };
    case BEGIN_LOADING:
      return {
        ...state,
        isLoading: true,
        loadingTitle: action.payload['title'],
        loadingSubtitle: action.payload['subtitle'],
      }
    case END_LOADING:
      return {
        ...state,
        isLoading: false,
      }
    case REDIRECT_TO:
      return {
        ...state,
        loadingTitle: action.payload['title'],
        loadingSubtitle: action.payload['subtitle'],
        redirectEndpoint: action.payload['endpoint']
      }
    case UPDATE_NAV_COLOR:
      return {
        ...state,
        navColor: action.payload
      }
    case CLEAR_FORM:
      return {
        ...state,
        clearForm: action.payload
      }
    default:
      return state;
  }
}

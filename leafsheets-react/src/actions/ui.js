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
} from './types';

// Actions

// Sidebar
export const openSidebar = () => (dispatch) => {
  dispatch(applyBackgroundDim());
  dispatch({
    type: OPEN_SIDEBAR,
    payload: true,
  });
};
export const closeSidebar = () => (dispatch) => {
  dispatch(unapplyBackgroundDim());
  dispatch({type: CLOSE_SIDEBAR});
};

// Dim
export const applyBackgroundDim = () => (dispatch) =>{
  dispatch({type: APPLY_BACKGROUND_DIM});
};
export const unapplyBackgroundDim = () => (dispatch) => {
  dispatch({type: UNAPPLY_BACKGROUND_DIM});
};

// Loading
export const beginLoading = (options, delay=0) => (dispatch) => {
  setTimeout(() => {
    dispatch({
      type: BEGIN_LOADING,
      payload: options
    });
  }, delay)
}
export const endLoading = (options, delay=1000) => (dispatch) => {
  setTimeout(() => {
    dispatch({
      type: END_LOADING,
      payload: options
    });
  }, delay)
}
export const redirectTo = options => (dispatch) => {
  dispatch({
    type: REDIRECT_TO,
    payload: options
  })
}

// Nav
export const updateNavColor = color => (dispatch) => {
  dispatch({
    type: UPDATE_NAV_COLOR,
    payload: color
  })
}

// Form
export const clearForm = form => (dispatch) => {
  dispatch({
    type: CLEAR_FORM,
    payload: form
  })
}
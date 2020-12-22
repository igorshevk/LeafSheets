// Imports

import { 
  GET_ALL_SHEETS,
  GET_SHEET, 
  EMPTY_SHEET, 
  GET_USER_SHEETS,
  GET_USER_SHEET,
  GET_ITEM,
  SET_ACTIVE_USER_SHEET,
  GENERATE_USER_SHEET,
  PREVIEW_USER_SHEET
} from '../actions/types';

// Reducers

const initialState = {
  allSheets: [],
  activeSheet: {},
  userSheets: [],
  activeUserSheet: {},
  preview: {
    preview: false,
    userSheet: null
  }
};

export default function(state = initialState, action) {
  switch(action.type) {
    case GET_ALL_SHEETS:
      return {
        ...state,
        allSheets: action.payload,
      };
    case GET_SHEET:
      return {
        ...state,
        activeSheet: action.payload,
      };
    case EMPTY_SHEET:
      return {
        ...state,
        activeSheet: {},
      };
    case GET_ITEM:
      return {
        ...state,
        activeSheet: {...state.activeSheet, item: action.payload}
      }
    case GET_USER_SHEET:
      return {
        ...state,
        activeUserSheet: action.payload,
        userSheets: state.userSheets.map(sheet => sheet.id === action.payload.id ? action.payload : sheet)
      }
    case GET_USER_SHEETS:
      return {
        ...state,
        userSheets: action.payload
      }
    case SET_ACTIVE_USER_SHEET:
      return {
        ...state,
        activeUserSheet: action.payload,
      }
    case GENERATE_USER_SHEET:
      return {
        ...state,
        activeUserSheet: action.payload,
        userSheets: state.userSheets.map(sheet => sheet.id === action.payload.id ? action.payload : sheet)
      }
    case PREVIEW_USER_SHEET:
      return {
        ...state,
        preview: { userSheet: action.payload.userSheet, preview: action.payload.preview }
      }
    default:
      return state;
  }
}

// Exports
export const getPreviewSheet = state => state.sheetsAndItemsReducer.preview.userSheet;
export const getPreviewBool = state => state.sheetsAndItemsReducer.preview.preview;

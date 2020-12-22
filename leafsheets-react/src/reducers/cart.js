// Imports

import { ADD_CART_ITEM, GET_CART, GET_CART_ITEMS, DELETE_CART_ITEM, LOGOUT_SUCCESS } from '../actions/types';

// Reducers

const initialState = {
  cart: [],
  items: [],
};

export default function(state = initialState, action) {
  switch(action.type) {
    case GET_CART:
      let cart = action.payload;
      let items = (cart.order_id === "") ? [] : state.items;
      return {
        ...state,
        cart: cart,
        items: items,
      }
    case GET_CART_ITEMS:
    case ADD_CART_ITEM:
    case DELETE_CART_ITEM:
      return {
        ...state,
        items: action.payload
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        cart: [],
        items: []
      }
    default:
      return state;
  }
}
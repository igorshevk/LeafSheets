const BASE_URL = process.env.REACT_APP_DRF_AP_BASE_URL;

const API_URL = "/api"

const ENDPOINT = `${BASE_URL}${API_URL}`

export const UPLOADS_URL = `${ENDPOINT}/uploads/`

// Auth & User
export const LOGIN_URL = `${ENDPOINT}/auth/login`
export const LOGOUT_URL = `${ENDPOINT}/auth/logout`
export const REGISTER_URL = `${ENDPOINT}/auth/register`
export const GET_USER_URL = `${ENDPOINT}/auth/me`
export const UPDATE_USER_URL = `${ENDPOINT}/auth/me`

// Company
export const ADD_COMPANY_URL = `${ENDPOINT}/me/companies/`
export const GET_COMPANIES_URL = `${ENDPOINT}/me/companies/`
export const DELETE_COMPANY_URL = `${ENDPOINT}/me/companies/`
export const UPDATE_COMPANY_URL = `${ENDPOINT}/me/companies/`

// Sheets
export const GET_SHEET_URL = `${ENDPOINT}/sheets/`
export const GET_SHEETS_URL = `${ENDPOINT}/sheets/`
export const GET_USER_SHEET_URL = `${ENDPOINT}/me/sheets/`
export const GET_USER_SHEETS_URL = `${ENDPOINT}/me/sheets/`
export const UPDATE_USER_VARIABLE_DICT_URL = `${ENDPOINT}/me/sheets/`

// Cart & Items
export const GET_ITEM_URL = `${ENDPOINT}/items/`
export const GET_ITEMS_URL = `${ENDPOINT}/items/`
export const GET_CART_URL = `${ENDPOINT}/me/cart/`
export const DELETE_CART_ITEM_URL = `${ENDPOINT}/me/cart/items/`
export const ADD_CART_ITEM_URL = `${ENDPOINT}/me/cart/items/`
export const GET_CART_ITEMS_URL = `${ENDPOINT}/me/cart/items/`

// Addresses
export const GET_ADDRESSES_URL = `${ENDPOINT}/me/addresses/`
export const GET_ADDRESS_URL = `${ENDPOINT}/me/addresses/`
export const ADD_ADDRESS_URL = `${ENDPOINT}/me/addresses/`
export const DELETE_ADDRESS_URL = `${ENDPOINT}/me/addresses/`
export const UPDATE_ADDRESS_URL = `${ENDPOINT}/me/addresses/`

// Payment Methods
export const GET_PAYMENT_METHODS_URL = `${ENDPOINT}/me/payment-methods/`
export const GET_PAYMENT_METHOD_URL = `${ENDPOINT}/me/payment-methods/`
export const ADD_PAYMENT_METHOD_URL = `${ENDPOINT}/me/payment-methods/`
export const DELETE_PAYMENT_METHOD_URL = `${ENDPOINT}/me/payment-methods/`
export const UPDATE_PAYMENT_METHOD_URL = `${ENDPOINT}/me/payment-methods/`

// Charges
export const GET_CHARGES_URL = `${ENDPOINT}/me/charges/`
export const ADD_CHARGE_URL = `${ENDPOINT}/me/charges/`


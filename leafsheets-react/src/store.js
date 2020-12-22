// Imports

import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistStore, persistReducer } from 'redux-persist';
import { createStore, applyMiddleware } from 'redux';
import storage from 'redux-persist/lib/storage';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

import rootReducer from './reducers/root';

// Config

const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2
}

// Middleware

const middlewares = [thunk];

if (process.env.NODE_ENV === `development`) {
  middlewares.push(logger);
}

// Persistance

const persistedReducer = persistReducer(persistConfig, rootReducer)

// Store

const initialState = {};

const store = createStore(
  persistedReducer,
  initialState,
  composeWithDevTools(
    applyMiddleware(...middlewares),
  )
);

let persistor = persistStore(store);

// Export

export { store, persistor };

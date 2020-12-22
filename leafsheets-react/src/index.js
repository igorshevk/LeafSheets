// Imports

import React from 'react';
import {Provider} from 'react-redux';
import {hydrate, render} from 'react-dom';

import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import App from './App';

// Index

const rootElement = document.getElementById('root');
if (rootElement.hasChildNodes()) {
  hydrate(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>,
    rootElement
  );
} else {
  render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>,
    rootElement
  );
}

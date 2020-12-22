// Imports

import * as firebase from 'firebase/app';
import 'firebase/analytics';

// Config

try {
  var firebaseConfig = {
    apiKey: 'AIzaSyAXHSY_k_w3POAi_h07TWIpT-rkVaijqJA',
    authDomain: 'leafsheets-1572905172316.firebaseapp.com',
    databaseURL: 'https://leafsheets-1572905172316.firebaseio.com',
    projectId: 'leafsheets-1572905172316',
    storageBucket: 'leafsheets-1572905172316.appspot.com',
    messagingSenderId: '735072218561',
    appId: '1:735072218561:web:97d857addb7aaa77fe5340',
    measurementId: 'G-XLWR5PW0QE',
  };
} catch {}

// Initialize Firebase

firebase.initializeApp(firebaseConfig);
export const analytics = firebase.analytics();

// Exports
export default firebase;

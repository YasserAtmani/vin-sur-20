// Import the functions you need from the SDKs you need
import firebase from 'firebase';
require('firebase/auth');
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBX2Hy9KuUviQazUqG14s5piGas3pBUMGo',
  authDomain: 'shazamvin-af876.firebaseapp.com',
  projectId: 'shazamvin-af876',
  storageBucket: 'shazamvin-af876.appspot.com',
  messagingSenderId: '697022346087',
  appId: '1:697022346087:web:70a9e2e1ac42a72eb535c2',
};

let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const auth = firebase.auth();

export {auth};

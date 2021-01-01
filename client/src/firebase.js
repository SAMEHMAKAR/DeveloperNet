import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
    apiKey: "AIzaSyCNlLsPVDaUEO7rvfzjeCQq87liJ6E0elE",
    authDomain: "test-41408.firebaseapp.com",
    databaseURL: "https://test-41408.firebaseio.com",
    projectId: "test-41408",
    storageBucket: "test-41408.appspot.com",
    messagingSenderId: "301886026046",
    appId: "1:301886026046:web:35deb084d2e356e164fc6f",
    measurementId: "G-RD3HDBS6LQ"
};

firebase.initializeApp(config);
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

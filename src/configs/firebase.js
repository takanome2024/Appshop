// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, GoogleAuthProvider} from 'firebase/auth'
import App from "../App";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDf_1u_V5_tJU_nT0LDKyhIXE7xERvHprw",
  authDomain: "tk-project-73c63.firebaseapp.com",
  projectId: "tk-project-73c63",
  storageBucket: "tk-project-73c63.firebasestorage.app",
  messagingSenderId: "239594476281",
  appId: "1:239594476281:web:366a8d444181fe4efa4828",
  measurementId: "G-KW7DK199DR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const Auth = getAuth(app);
// const analytics = getAnalytics(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
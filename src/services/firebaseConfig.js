// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDVkmp_1gIBzLqlBrVES78VSFCM0_WEqCk",
  authDomain: "carga-bf126.firebaseapp.com",
  projectId: "carga-bf126",
  storageBucket: "carga-bf126.appspot.com",
  messagingSenderId: "553219897662",
  appId: "1:553219897662:web:89c6ebbc946d17aa99546f",
  measurementId: "G-CMQ44SJCNE"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
  
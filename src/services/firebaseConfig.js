// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDVkmp_1gIBzLqlBrVES78VSFCM0_WEqCk',
  authDomain: 'carga-bf126.firebaseapp.com',
  projectId: 'carga-bf126',
  storageBucket: 'carga-bf126.appspot.com',
  messagingSenderId: '553219897662',
  appId: '1:553219897662:web:89c6ebbc946d17aa99546f',
  measurementId: 'G-CMQ44SJCNE',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app); // Autenticação
export const db = getFirestore(app);
export const storage = getStorage(app); // Firestore

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDHhGXaOl6Fp6C1G7dOadlTYTFub43mtdw",
  authDomain: "majuai.firebaseapp.com",
  projectId: "majuai",
  storageBucket: "majuai.firebasestorage.app",
  messagingSenderId: "343330868379",
  appId: "1:343330868379:web:942d4289226bc8f2678a3e",
  measurementId: "G-CQWM888WGE",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app, 'majuai-db');

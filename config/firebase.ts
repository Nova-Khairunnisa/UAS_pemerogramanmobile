import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCTp_xelFvI1bCo0Pl2_Qasx39TrfDg3iQ",
  authDomain: "uasmobile2-b9c63.firebaseapp.com",
  databaseURL: "https://uasmobile2-b9c63-default-rtdb.firebaseio.com",
  projectId: "uasmobile2-b9c63",
  storageBucket: "uasmobile2-b9c63.firebasestorage.app",
  messagingSenderId: "791654873068",
  appId: "1:791654873068:web:a91f551b31603b06bbb2c9",
  measurementId: "G-BT4G7TRJT3"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
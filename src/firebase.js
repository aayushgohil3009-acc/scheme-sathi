import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCjcsaaQh-fTCwLCwVx16rmKlOF0fOwyzU",
  authDomain: "scheme-sathi-342c9.firebaseapp.com",
  projectId: "scheme-sathi-342c9",
  storageBucket: "scheme-sathi-342c9.firebasestorage.app",
  messagingSenderId: "325916305507",
  appId: "1:325916305507:web:8a4dbf28b7d890d3f43056",
  measurementId: "G-K6JN5ZJLYY"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBo2SeEc_0vOLhNW2rQ6d_QvgvcDupV0sY",
  authDomain: "jabbertalky-6b813.firebaseapp.com",
  projectId: "jabbertalky-6b813",
  storageBucket: "jabbertalky-6b813.appspot.com",
  messagingSenderId: "467278910517",
  appId: "1:467278910517:web:42e9f74d89d20586f0cd7c",
};

// Initialize Firebase
initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore();

// Initialize Firebase Auth
export const auth = getAuth();

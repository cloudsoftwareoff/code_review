// src/lib/firebaseClient.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCtoidEEgoYaogmEzrOhfQPkebuP3l2jU8",
  authDomain: "code-review-30008.firebaseapp.com",
  projectId: "code-review-30008",
  storageBucket: "code-review-30008.firebasestorage.app",
  messagingSenderId: "5409612043",
  appId: "1:5409612043:web:a83fdc29e6f07071f9020e",
  measurementId: "G-4XFW72X6TG"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import firebase from "firebase/app";
import "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBMOutr4z5dlIcgrMbDNYvdHaWCDdSH1qA",
  authDomain: "afterkelas-be02b.firebaseapp.com",
  projectId: "afterkelas-be02b",
  storageBucket: "afterkelas-be02b.appspot.com",
  messagingSenderId: "52047069922",
  appId: "1:52047069922:web:4dc9e44ae3bf563228d4bb",
  measurementId: "G-RTTQWNFE4M",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const db = firebase.firestore();

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCRGzqnh4Re64fAu0A1xhSsiXRPofTZmq4",
  authDomain: "swp-demo-dd255.firebaseapp.com",
  projectId: "swp-demo-dd255",
  storageBucket: "swp-demo-dd255.appspot.com",
  messagingSenderId: "206267505410",
  appId: "1:206267505410:web:9c47897d9fd7a6b0c3401b",
  measurementId: "G-NS559FPEDG",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app); // Lấy Firebase Storage instance
// const analytics = getAnalytics(app);

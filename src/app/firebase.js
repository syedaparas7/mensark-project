// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

  const firebaseConfig = {
//  apiKey: "AIzaSyAMCcsovFxHtt2G7ibOZ3M5-WYNP0iMSyA",
//   authDomain: "e-commerce-470f6.firebaseapp.com",
//   projectId: "e-commerce-470f6",
//   storageBucket: "e-commerce-470f6.firebasestorage.app",
//   messagingSenderId: "213671538861",
//   appId: "1:213671538861:web:79e3b9287053ea59599624",
//   measurementId: "G-Y7S7CLR8YY"
    //myfirebasecode
    apiKey: "AIzaSyDWdMDWdQ7QdWsZmWlCJVP6QtOhbfmMMF0",
    authDomain: "mensark-sark.firebaseapp.com",
    projectId: "mensark-sark",
    storageBucket: "mensark-sark.firebasestorage.app",
    messagingSenderId: "639920278169",
    appId: "1:639920278169:web:16794a60bbd42602ffc608",
    measurementId: "G-Z495M81G9L"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app)

export { auth , db };
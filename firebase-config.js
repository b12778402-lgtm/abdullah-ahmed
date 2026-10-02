import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCpkpJXnWeo1JqzFK9ehFhNGeEvtDPoJfc",
    authDomain: "raef-library.firebaseapp.com",
    projectId: "raef-library",
    storageBucket: "raef-library.firebasestorage.app",
    messagingSenderId: "39657634241",
    appId: "1:39657634241:web:2af6927127513e06f61740",
    measurementId: "G-EEJRBH89EQ"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { auth };
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZl4OT5izLIHX4dmrKRCWi5A92vmG_XJs",
  authDomain: "musicapp-47dbf.firebaseapp.com",
  projectId: "musicapp-47dbf",
  storageBucket: "musicapp-47dbf.firebasestorage.app",
  messagingSenderId: "916629825671",
  appId: "1:916629825671:web:2c8ff4640d94dfb542b022"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Ensure auth is initialized correctly
const db = getFirestore(app); // ← đây là Firestore
export { auth, db,app };
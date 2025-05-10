
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHn8LJwjwCdwvSRGWbG-BbF2ieUvqc_-Q",
  authDomain: "med-pulse-pos-system.firebaseapp.com",
  projectId: "med-pulse-pos-system",
  databaseURL: "https://med-pulse-pos-system-default-rtdb.firebaseio.com",
  storageBucket: "med-pulse-pos-system.appspot.com",
  messagingSenderId: "268364679881",
  appId: "1:268364679881:web:258b3ca7b05d3843819b18",
  measurementId: "G-Y7C6VJ7BGF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const auth = getAuth(app);
const database = getDatabase(app);

console.log("Firebase initialized with database URL:", firebaseConfig.databaseURL);

export { app, auth, database, analytics };

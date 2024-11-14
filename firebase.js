import { getApp, initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail  } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import Firebase Storage
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// Firebase configuration for the primary Firestore instance
const firebaseConfig = {
  apiKey: "AIzaSyAtAIsj6tCBHget5ghMIIAfYYaGtZTmc60",
  authDomain: "booking-project-a4de9.firebaseapp.com",
  projectId: "booking-project-a4de9",
  storageBucket: "booking-project-a4de9.appspot.com",
  messagingSenderId: "745901751173",
  appId: "1:745901751173:web:ace08f086b8b694da722ec",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication, Firestore, and Storage
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize Firebase Auth provider
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

// Function to sign in with Google popup
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);

// Function to send password reset email
export const resetPassword = (email) => {
  return sendPasswordResetEmail(auth, email)
    .then(() => {
      return "Password reset email sent successfully.";
    })
    .catch((error) => {
      throw error;
    });
};

// Export the auth, Firestore, and storage instances for use in your application
export { auth, db, storage };
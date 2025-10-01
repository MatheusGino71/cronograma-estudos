// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator, enableNetwork, disableNetwork } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDFj3iL8d--i3CD4ViVdOJt6KfyK8apoEw",
  authDomain: "cronograma-estudos-c3a5b.firebaseapp.com",
  projectId: "cronograma-estudos-c3a5b",
  storageBucket: "cronograma-estudos-c3a5b.firebasestorage.app",
  messagingSenderId: "632821144518",
  appId: "1:632821144518:web:d8ff2532ba5ec330cf30c7",
  measurementId: "G-PW2N7Y7RDW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Configure Firestore for better offline handling
if (typeof window !== 'undefined') {
  // Enable offline persistence
  try {
    // Try to enable network and handle connectivity gracefully
    enableNetwork(db).catch(error => {
      console.warn('Firebase network enable failed:', error);
    });
  } catch (error) {
    console.warn('Firebase network configuration failed:', error);
  }
}

// Initialize Analytics (only in browser environment)
let analytics: any = null;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn('Analytics initialization failed:', error);
  }
}
export { analytics };

export default app;

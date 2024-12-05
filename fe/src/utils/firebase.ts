import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const FIREBASE_API = import.meta.env.FIREBASE_API;


const firebaseConfig = FIREBASE_API;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export { storage };

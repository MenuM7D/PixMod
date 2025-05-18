import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

// 🔑 معلومات مشروعك من Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCn3stWO7QelOmGPyqQ-1jVXy9Y0y5uPgA",
  authDomain: "image-resizer-m7d.firebaseapp.com",
  projectId: "image-resizer-m7d",
  storageBucket: "image-resizer-m7d.appspot.com",
  messagingSenderId: "700892046577",
  appId: "1:700892046577:web:5c820df7f4a2ce26b5bfa2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 📦 تسجيل مستخدم جديد
const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// 🔐 تسجيل دخول المستخدم
const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// 🚪 تسجيل الخروج
const logoutUser = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    throw error;
  }
};

export {
  auth,
  registerUser,
  loginUser,
  logoutUser,
  onAuthStateChanged
};

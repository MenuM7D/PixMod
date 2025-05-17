import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification
} from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// 🔑 بيانات مشروعك من Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCn3stWO7QelOmGPyqQ-1jVXy9Y0y5uPgA",
  authDomain: "image-resizer-m7d.firebaseapp.com",
  projectId: "image-resizer-m7d",
  storageBucket: "image-resizer-m7d.appspot.com",
  messagingSenderId: "700892046577",
  appId: "1:700892046577:web:5c820df7f4a2ce26b5bfa2" // يمكنك الحصول عليه من Firebase Console > Project Settings > Your apps
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 📦 تسجيل مستخدم جديد + إرسال تفعيل + حفظ بيانات أولية
const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // ✉️ إرسال رسالة التفعيل
    await sendEmailVerification(user);

    // 💾 حفظ بيانات المستخدم في Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      profilePic: null,
      createdAt: new Date(),
    });

    return user;
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

export { auth, registerUser, loginUser, logoutUser, onAuthStateChanged };

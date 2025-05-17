import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

// ⚠️ استبدله بمعلومات مشروعك
const firebaseConfig = {
  apiKey: "AIzaSyCn3stWO7QelOmGPyqQ-1jVXy9Y0y5uPgA",
  authDomain: "image-resizer-m7d.firebaseapp.com",
  projectId: "image-resizer-m7d",
  storageBucket: "image-resizer-m7d.appspot.com",
  messagingSenderId: "700892046577",
  appId: "1:700892046577:web:5c820df7f4a2ce26b5bfa2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// تسجيل مستخدم جديد وإرسال رمز تفعيل
const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // إنشاء رمز تفعيل عشوائي
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // حفظ الرمز في Firestore
    await setDoc(doc(db, 'verificationCodes', user.uid), {
      email: user.email,
      code: verificationCode,
      createdAt: new Date(),
    });

    // ❗ هنا: يجب أن تُرسل هذا الرمز عبر البريد (يمكنك استخدام EmailJS أو Email API)
    alert(`رمز التفعيل هو: ${verificationCode}`);
    return user;
  } catch (error) {
    throw error;
  }
};

// تسجيل دخول المستخدم
const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// تسجيل خروج المستخدم
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
  onAuthStateChanged,
  sendPasswordResetEmail
};

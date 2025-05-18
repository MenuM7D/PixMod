import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail
} from 'firebase/auth';

// 🔑 استبدل هذه البيانات بمعلومات مشروعك من Firebase Console
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

// ✅ تسجيل مستخدم جديد
const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await sendEmailVerification(user);
    return user;
  } catch (error) {
    throw error;
  }
};

// ✅ تسجيل دخول المستخدم
const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// ✅ تسجيل خروج المستخدم
const logoutUser = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    throw error;
  }
};

// ✅ إعادة إرسال رسالة التفعيل
const resendVerificationEmail = () => {
  const user = auth.currentUser;
  if (user && !user.emailVerified) {
    return sendEmailVerification(user);
  }
  throw new Error('لا يمكن إعادة الإرسال الآن');
};

// ✅ إعادة تعيين كلمة المرور
const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return 'تم إرسال رابط إعادة تعيين كلمة المرور';
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
  resendVerificationEmail,
  resetPassword,
  sendEmailVerification,
  sendPasswordResetEmail
};

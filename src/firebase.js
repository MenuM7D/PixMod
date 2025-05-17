import React, { useState, useEffect } from 'react';
import {
  auth,
  registerUser,
  loginUser,
  logoutUser,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail
} from './firebase';

const App = () => {
  // Auth states
  const [showAuthModal, setShowAuthModal] = useState(true);
  const [authMode, setAuthMode] = useState('login'); // login or signup or reset-password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  // Account verification state
  const [isVerified, setIsVerified] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(false);

  // Image Resizer State
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');
  const [image, setImage] = useState(null);
  const [resizedImage, setResizedImage] = useState(null);
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(200);
  const [aspectRatio, setAspectRatio] = useState(true);
  const [format, setFormat] = useState('png');
  const [quality, setQuality] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Profile Picture
  const [profilePic, setProfilePic] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Toggle language
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  // Translations
  const translations = {
    en: {
      title: 'Professional Image Resizer',
      upload: 'Upload Image',
      width: 'Width',
      height: 'Height',
      resize: 'Resize Image',
      download: 'Download Resized Image',
      noImage: 'No image uploaded yet.',
      resizing: 'Resizing...',
      dragDrop: 'Drag & Drop or Click to Upload',
      lockRatio: 'Lock Aspect Ratio',
      unlockRatio: 'Unlock Aspect Ratio',
      format: 'Format',
      quality: 'Quality',
      reset: 'Reset',
      originalSize: 'Original Size',
      fileName: 'File Name:',
      fileSize: 'File Size:',
      preview: 'Live Preview',
      zoomIn: 'Zoom In',
      zoomOut: 'Zoom Out',
      login: 'Login',
      signup: 'Sign Up',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      submitLogin: 'Login',
      submitSignup: 'Create Account',
      alreadyAccount: 'Already have an account?',
      needAccount: "Don't have an account?",
      loginNow: 'Login Now',
      logout: 'Logout',
      requiredFields: 'All fields are required',
      passNotMatch: 'Passwords do not match',
      invalidPass: 'Password must be at least 6 characters',
      verifyEmailSent: 'Verification email sent! Please check your inbox.',
      emailNotVerified: 'Please verify your email before using the site.',
      forgotPassword: 'Forgot Password?',
      resetPassword: 'Send Reset Link',
      backToLogin: 'Back to Login',
      profile: 'Profile',
      changePassword: 'Change Password',
      updateProfile: 'Update Profile',
      updateSuccess: 'Profile updated successfully!',
      sending: 'Sending...',
      resetPasswordDesc: 'Enter your email to receive a password reset link',
      resetPasswordSuccess: 'Password reset email sent!',
      resetPasswordError: 'Failed to send reset email'
    },
    ar: {
      title: 'مُصغّر الصور الاحترافي',
      upload: 'تحميل صورة',
      width: 'العرض',
      height: 'الارتفاع',
      resize: 'تغيير الحجم',
      download: 'تنزيل الصورة المصغرة',
      noImage: 'لم يتم تحميل أي صورة بعد.',
      resizing: 'جاري التغيير...',
      dragDrop: 'اسحب وأفلت أو اضغط لتحميل صورة',
      lockRatio: 'قفل نسبة الأبعاد',
      unlockRatio: 'إلغاء قفل النسبة',
      format: 'التنسيق',
      quality: 'الجودة',
      reset: 'إعادة ضبط',
      originalSize: 'الحجم الأصلي',
      fileName: 'اسم الملف:',
      fileSize: 'حجم الملف:',
      preview: 'معاينة مباشرة',
      zoomIn: 'تكبير',
      zoomOut: 'تصغير',
      login: 'تسجيل الدخول',
      signup: 'إنشاء حساب',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      submitLogin: 'دخول',
      submitSignup: 'إنشاء الحساب',
      alreadyAccount: 'لديك حساب بالفعل؟',
      needAccount: 'لا تملك حسابًا؟',
      loginNow: 'سجل دخولك الآن',
      logout: 'تسجيل الخروج',
      requiredFields: 'جميع الحقول مطلوبة',
      passNotMatch: 'كلمتا المرور غير متطابقتين',
      invalidPass: 'يجب أن تكون كلمة المرور 6 خانات على الأقل',
      verifyEmailSent: 'تم إرسال رسالة التفعيل! الرجاء فحص بريدك الإلكتروني.',
      emailNotVerified: 'الرجاء تفعيل البريد الإلكتروني قبل استخدام الموقع.',
      forgotPassword: 'هل نسيت كلمة المرور؟',
      resetPassword: 'إرسال رابط إعادة التعيين',
      backToLogin: 'العودة إلى تسجيل الدخول',
      profile: 'الملف الشخصي',
      changePassword: 'تغيير كلمة المرور',
      updateProfile: 'تحديث الملف الشخصي',
      updateSuccess: 'تم تحديث البيانات بنجاح!',
      sending: 'جاري الإرسال...',
      resetPasswordDesc: 'أدخل بريدك الإلكتروني لتلقي رابط تغيير كلمة المرور',
      resetPasswordSuccess: 'تم إرسال رابط إعادة تعيين كلمة المرور',
      resetPasswordError: 'فشل إرسال الرابط'
    }
  };

  const t = translations[language];

  // Check if user is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setIsVerified(user.emailVerified);
      } else {
        setCurrentUser(null);
        setIsVerified(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Handle Sign Up
  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      alert(t.requiredFields);
      return;
    }

    if (password !== confirmPassword) {
      alert(t.passNotMatch);
      return;
    }

    if (password.length < 6) {
      alert(t.invalidPass);
      return;
    }

    try {
      await registerUser(email, password);
      alert(t.verifyEmailSent);
      setShowAuthModal(true);
      setAuthMode('login');
    } catch (error) {
      alert(error.message);
    }
  };

  // Handle Login
  const handleLogin = async () => {
    if (!email || !password) {
      alert(t.requiredFields);
      return;
    }

    try {
      await loginUser(email, password);
      setShowAuthModal(false);
    } catch (error) {
      alert(error.message);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await logoutUser();
      setIsVerified(false);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      alert(error.message);
    }
  };

  // Send password reset email
  const handlePasswordReset = async () => {
    if (!email) {
      alert('الرجاء إدخال البريد الإلكتروني');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert(t.resetPasswordSuccess);
      setAuthMode('login');
    } catch (error) {
      alert(t.resetPasswordError + ': ' + error.message);
    }
  };

  // Handle Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setFileSize(file.size / 1024); // KB

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          setImage(img.src);
          setWidth(img.width);
          setHeight(img.height);
          setResizedImage(null);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag & Drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const input = document.getElementById('image-upload');
      input.files = e.dataTransfer.files;
      const event = new Event('change', { bubbles: true });
      input.dispatchEvent(event);
    }
  };

  // Resize image
  const resizeImage = () => {
    if (!image || width <= 0 || height <= 0) return;

    const img = new Image();
    img.src = image;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = width;
      canvas.height = height;

      setLoading(true);

      setTimeout(() => {
        ctx.drawImage(img, 0, 0, width, height);
        let resizedDataURL;
        if (format === 'jpg') {
          resizedDataURL = canvas.toDataURL('image/jpeg', quality);
        } else {
          resizedDataURL = canvas.toDataURL('image/png');
        }
        setResizedImage(resizedDataURL);
        setLoading(false);
      }, 600);
    };
  };

  // Download image
  const downloadImage = () => {
    if (!resizedImage) return;

    const link = document.createElement('a');
    link.href = resizedImage;
    link.download = `resized-${Date.now()}.${format}`;
    link.click();
  };

  // Reset settings
  const resetSettings = () => {
    if (!image) return;

    const img = new Image();
    img.src = image;
    img.onload = () => {
      setWidth(img.width);
      setHeight(img.height);
      setAspectRatio(true);
      setFormat('png');
      setQuality(1);
      setResizedImage(null);
    };
  };

  // Zoom handlers
  const zoomIn = () => {
    if (!image) return;
    setWidth(prev => Math.min(prev + 50, 5000));
    if (aspectRatio) {
      const img = new Image();
      img.src = image;
      img.onload = () => {
        const ratio = img.height / img.width;
        setHeight(Math.round(width * ratio));
      };
    }
  };

  const zoomOut = () => {
    if (!image) return;
    setWidth(prev => Math.max(prev - 50, 50));
    if (aspectRatio) {
      const img = new Image();
      img.src = image;
      img.onload = () => {
        const ratio = img.width / img.height;
        setWidth(Math.round(height * ratio));
      };
    }
  };

  // Update width based on aspect ratio
  useEffect(() => {
    if (aspectRatio && image) {
      const img = new Image();
      img.src = image;
      img.onload = () => {
        const ratio = img.height / img.width;
        setHeight(Math.round(width * ratio));
      };
    }
  }, [width, aspectRatio, image]);

  // Update width based on aspect ratio
  useEffect(() => {
    if (aspectRatio && image) {
      const img = new Image();
      img.src = image;
      img.onload = () => {
        const ratio = img.width / img.height;
        setWidth(Math.round(height * ratio));
      };
    }
  }, [height, aspectRatio, image]);

  return (
    <>
      {!currentUser ? (
        <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
          <div className={`w-full max-w-md p-6 rounded-lg shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-2xl font-bold mb-6 text-center">{authMode === 'login' ? t.login : authMode === 'signup' ? t.signup : t.forgotPassword}</h2>

            {authMode === 'login' && (
              <>
                <input
                  type="email"
                  placeholder={t.email}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-2 mb-4 border rounded-md focus:outline-none ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
                />
                <input
                  type="password"
                  placeholder={t.password}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-2 mb-4 border rounded-md focus:outline-none ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
                />
                <button
                  onClick={handleLogin}
                  className={`w-full py-2 rounded-md font-medium mt-2 ${
                    darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {t.submitLogin}
                </button>
                <p className="mt-4 text-center">
                  {t.needAccount}{' '}
                  <button onClick={() => setAuthMode('signup')} className="text-blue-500 hover:underline">{t.signup}</button>
                </p>
                <p className="mt-2 text-center">
                  <button onClick={() => setAuthMode('reset-password')} className="text-red-500 hover:underline">{t.forgotPassword}</button>
                </p>
              </>
            )}

            {authMode === 'signup' && (
              <>
                <input
                  type="email"
                  placeholder={t.email}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-2 mb-4 border rounded-md focus:outline-none ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
                />
                <input
                  type="password"
                  placeholder={t.password}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-2 mb-4 border rounded-md focus:outline-none ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
                />
                <input
                  type="password"
                  placeholder={t.confirmPassword}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-4 py-2 mb-4 border rounded-md focus:outline-none ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
                />
                <button
                  onClick={handleSignUp}
                  className={`w-full py-2 rounded-md font-medium mt-2 ${
                    darkMode ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {t.submitSignup}
                </button>
                <p className="mt-4 text-center">
                  {t.alreadyAccount}{' '}
                  <button onClick={() => setAuthMode('login')} className="text-blue-500 hover:underline">{t.loginNow}</button>
                </p>
              </>
            )}

            {authMode === 'reset-password' && (
              <>
                <p className="mb-4 text-sm">{t.resetPasswordDesc}</p>
                <input
                  type="email"
                  placeholder={t.email}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-2 mb-4 border rounded-md focus:outline-none ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
                />
                <button
                  onClick={handlePasswordReset}
                  className={`w-full py-2 rounded-md font-medium mt-2 ${
                    darkMode ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                  }`}
                >
                  {loadingAuth ? t.sending : t.resetPassword}
                </button>
                <p className="mt-4 text-center">
                  <button onClick={() => setAuthMode('login')} className="text-blue-500 hover:underline">{t.backToLogin}</button>
                </p>
              </>
            )}
          </div>
        </div>
      ) : !isVerified ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
          <div className="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-semibold mb-4">Verify Your Email</h2>
            <p className="mb-4">تم إرسال رسالة تفعيل إلى بريدك الإلكتروني.</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">من فضلك تحقق من البريد وانقر على رابط التفعيل.</p>
            <button
              onClick={handleLogout}
              className="py-2 px-4 rounded-md bg-red-500 hover:bg-red-600 text-white"
            >
              {t.logout}
            </button>
          </div>
        </div>
      ) : (
        <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
          {/* Main App UI */}
          <header className="p-4 md:p-6 flex justify-between items-center shadow-md bg-opacity-80 backdrop-blur-md backdrop-saturate-150 border-b dark:border-gray-700">
            <h1 className="text-xl md:text-3xl font-bold">Professional Image Resizer</h1>
            <div className="flex gap-3 md:gap-4">
              <button
                onClick={toggleLanguage}
                className={`p-2 rounded-full focus:outline-none transition-transform hover:scale-110 ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
                aria-label="Toggle language"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
              </button>
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full focus:outline-none transition-transform hover:scale-110 ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5" />
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                  </svg>
                )}
              </button>
            </div>
          </header>

          <main className="container mx-auto p-4 md:p-6">
            <div className="flex justify-end mb-4">
              <button
                onClick={handleLogout}
                className={`py-2 px-4 rounded-md font-medium ${
                  darkMode ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                {t.logout}
              </button>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                {currentUser?.email.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{currentUser?.email}</h2>
                <p className="text-xs text-green-500">✓ {t.emailNotVerified}</p>
              </div>
            </div>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* Upload Section */}
              <div className={`p-6 rounded-lg shadow-lg transition-all duration-300 ${darkMode ? 'bg-gray-800 hover:shadow-blue-500/20' : 'bg-white hover:shadow-blue-300/20'}`}>
                <h2 className="text-xl font-semibold mb-4">{t.upload}</h2>
                <label
                  htmlFor="image-upload"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative block w-full p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-blue-500 bg-blue-500/10'
                      : darkMode
                        ? 'border-gray-600 hover:border-blue-400 bg-gray-700/50 hover:bg-gray-700'
                        : 'border-gray-300 hover:border-blue-400 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 0 01-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <span className="block text-sm md:text-base">{t.dragDrop}</span>
                  <input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                </label>

                {image && (
                  <div className="mt-4 space-y-2">
                    <p><strong>{t.fileName}</strong> {fileName}</p>
                    <p><strong>{t.fileSize}</strong> {Math.round(fileSize)} KB</p>
                  </div>
                )}

                {!image && <p className="mt-4 text-center">{t.noImage}</p>}

                {image && (
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <label>{t.lockRatio}</label>
                      <button
                        onClick={() => setAspectRatio(!aspectRatio)}
                        className={`p-1 rounded focus:outline-none ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                        aria-label="Toggle aspect ratio"
                      >
                        {aspectRatio ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0110 0v4" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 019.9-2" />
                          </svg>
                        )}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2">{t.width}</label>
                        <input
                          type="number"
                          value={width}
                          onChange={(e) => setWidth(parseInt(e.target.value))}
                          min="1"
                          className={`w-full px-3 py-2 border rounded-md focus:ring ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-800'}`}
                        />
                      </div>
                      <div>
                        <label className="block mb-2">{t.height}</label>
                        <input
                          type="number"
                          value={height}
                          onChange={(e) => setHeight(parseInt(e.target.value))}
                          min="1"
                          className={`w-full px-3 py-2 border rounded-md focus:ring ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-800'}`}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={setToOriginalSize}
                        className={`py-1 px-2 rounded-md text-xs hover:opacity-90 ${darkMode ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-indigo-500 hover:bg-indigo-600 text-white'}`}
                      >
                        {t.originalSize}
                      </button>
                      <button
                        onClick={zoomIn}
                        className={`py-1 px-2 rounded-md text-xs hover:opacity-90 ${darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                      >
                        {t.zoomIn}
                      </button>
                      <button
                        onClick={zoomOut}
                        className={`py-1 px-2 rounded-md text-xs hover:opacity-90 ${darkMode ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-purple-500 hover:bg-purple-600 text-white'}`}
                      >
                        {t.zoomOut}
                      </button>
                    </div>

                    <div>
                      <label className="block mb-2">{t.format}</label>
                      <select
                        value={format}
                        onChange={(e) => setFormat(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:ring ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-800'}`}
                      >
                        <option value="png">PNG</option>
                        <option value="jpg">JPG</option>
                      </select>
                    </div>

                    {format === 'jpg' && (
                      <div>
                        <label className="block mb-2">{t.quality}</label>
                        <input
                          type="range"
                          min="0.1"
                          max="1"
                          step="0.1"
                          value={quality}
                          onChange={(e) => setQuality(parseFloat(e.target.value))}
                          className="w-full"
                        />
                        <div className="flex justify-between mt-1 text-xs">
                          <span>Low</span>
                          <span>High</span>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={resetSettings}
                        className={`py-2 px-4 rounded-md font-medium hover:opacity-90 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                      >
                        {t.reset}
                      </button>
                      <button
                        onClick={resizeImage}
                        disabled={loading}
                        className={`flex-1 py-2 px-4 rounded-md font-medium hover:opacity-90 ${darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                      >
                        {loading ? t.resizing : t.resize}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Preview & Download Section */}
              <div className={`p-6 rounded-lg shadow-lg transition-all duration-300 ${darkMode ? 'bg-gray-800 hover:shadow-green-500/20' : 'bg-white hover:shadow-green-300/20'}`}>
                <h2 className="text-xl font-semibold mb-4">{t.download}</h2>
                {resizedImage ? (
                  <>
                    <img src={resizedImage} alt="Resized" className="w-full max-h-60 object-contain rounded-md border dark:border-gray-600" />
                    <button
                      onClick={downloadImage}
                      className={`mt-6 w-full py-2 px-4 rounded-md font-medium transition-all hover:opacity-90 ${darkMode ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                    >
                      {t.download}
                    </button>
                  </>
                ) : (
                  <p className="text-center mt-10">{!image ? t.noImage : loading ? t.resizing : "Select size and click resize."}</p>
                )}
              </div>
            </section>
          </main>

          <footer className={`p-4 text-center mt-10 ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'}`}>
            <p>© 2025 M7D | Professional Image Resizer | Designed with ❤️ by M7D</p>
          </footer>
        </div>
      )}
    </>
  );
};

export default App;

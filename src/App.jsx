import React, { useState, useEffect } from 'react';
import {
  auth,
  registerUser,
  loginUser,
  logoutUser,
  onAuthStateChanged,
  resendVerificationEmail,
  } from './firebase';

const App = () => {
  // Auth states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // login | signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [userName, setUserName] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  // Image Resizer State
  const [darkMode, setDarkMode] = useState(true); // dark mode افتراضيًا
  const [language, setLanguage] = useState('ar'); // اللغة العربية افتراضيًا
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
  // Translations
  const translations = {
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
      forgotPassword: 'هل نسيت كلمة المرور؟',
      backToLogin: 'العودة إلى تسجيل الدخول',
      alreadyAccount: 'لديك حساب بالفعل؟',
      needAccount: 'لا تملك حسابًا؟',
      loginNow: 'سجل دخولك الآن',
      logout: 'تسجيل الخروج',
      requiredFields: 'جميع الحقول مطلوبة',
      passNotMatch: 'كلمتا المرور غير متطابقتين',
      invalidPass: 'يجب أن تكون كلمة المرور 6 خانات على الأقل',
      profile: 'الملف الشخصي',
      changeName: 'تعديل الاسم',
      save: 'حفظ',
      cancel: 'إلغاء',
      nameSaved: 'تم حفظ الاسم بنجاح!',
      userInitial: 'مستخدم'
    },
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
      forgotPassword: 'Forgot Password?',
      backToLogin: 'Back to Login',
      alreadyAccount: 'Already have an account?',
      needAccount: "Don't have an account?",
      loginNow: 'Login Now',
      logout: 'Logout',
      requiredFields: 'All fields are required',
      passNotMatch: 'Passwords do not match',
      invalidPass: 'Password must be at least 6 characters',
      profile: 'Profile',
      changeName: 'Edit Name',
      save: 'Save',
      cancel: 'Cancel',
      nameSaved: 'Name saved successfully!',
      userInitial: 'User'
    }
  };
  const t = translations[language];

  // Check if user is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setCurrentUser(user);
        setUserName(user.email || 'User');
        setNewName(user.email.split('@')[0]);
        setIsVerified(user.emailVerified);
      } else {
        setIsLoggedIn(false);
        setCurrentUser(null);
        setUserName('');
        setNewName('');
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
      setShowAuthModal(false);
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
      setIsLoggedIn(false);
      setCurrentUser(null);
      setUserName('');
      setNewName('');
      setEditingName(false);
    } catch (error) {
      alert(error.message);
    }
  };

  // Save new name
  const handleSaveName = () => {
    if (!newName.trim()) {
      alert('الرجاء إدخال اسم صحيح');
      return;
    }
    setUserName(newName);
    setEditingName(false);
    alert(t.nameSaved);
  };

  // Handle image upload
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

  // Update height based on aspect ratio
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

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

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

  // Auto-size handler
  const setToOriginalSize = () => {
    if (!image) return;
    const img = new Image();
    img.src = image;
    img.onload = () => {
      setWidth(img.width);
      setHeight(img.height);
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
        const ratio = img.height / img.width;
        setHeight(Math.round(width * ratio));
      };
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      {/* Header with all toggles */}
      <header className="p-4 md:p-6 flex justify-between items-center shadow-md bg-opacity-80 backdrop-blur-md backdrop-saturate-150 border-b dark:border-gray-700">
        <h1 className="text-xl md:text-3xl font-bold">{t.title}</h1>
        <div className="flex gap-3 md:gap-4 items-center">
          {/* User Initial Circle */}
          {isLoggedIn && (
            <div className="relative group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm cursor-pointer">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="absolute right-0 mt-2 w-40 p-3 rounded-md shadow-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                {editingName ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full px-2 py-1 border rounded mb-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditingName(false)} className="text-xs text-red-500 hover:text-red-700">
                        {t.cancel}
                      </button>
                      <button onClick={handleSaveName} className="text-xs text-blue-500 hover:text-blue-700">
                        {t.save}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <span>{userName || t.userInitial}</span>
                    <button
                      onClick={() => setEditingName(true)}
                      className="text-xs text-blue-500 hover:text-blue-700"
                    >
                      ✏️
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            aria-label="Toggle language"
            className={`p-2 rounded-full focus:outline-none hover:scale-105 transition-transform ${
              darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </button>
          {/* Dark Mode Toggle */}
          <button
  onClick={() => setDarkMode(!darkMode)}
  aria-label="Toggle dark mode"
  className={`p-2 rounded-full focus:outline-none hover:scale-105 transition-transform ${
    darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
  }`}
>
  {darkMode ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )}
</button>
          {/* Login Button */}
          {!isLoggedIn && (
            <button
              onClick={() => {
                setShowAuthModal(true);
                setAuthMode('login');
              }}
              className="py-2 px-4 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              {t.login}
            </button>
          )}
          {/* Logout Button */}
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="py-2 px-4 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium"
            >
              {t.logout}
            </button>
          )}
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-6">
        {!isLoggedIn ? (
          <section className="max-w-md mx-auto mt-10 p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800 text-center space-y-4">
            <h2 className="text-2xl font-semibold">مرحبًا بك!</h2>
            <p>للاستفادة الكاملة من الموقع، يرجى تسجيل الدخول أو إنشاء حساب.</p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setAuthMode('login');
                  setShowAuthModal(true);
                }}
                className="flex-1 py-2 px-4 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
              >
                {t.login}
              </button>
              <button
                onClick={() => {
                  setAuthMode('signup');
                  setShowAuthModal(true);
                }}
                className="flex-1 py-2 px-4 rounded-md bg-green-600 hover:bg-green-700 text-white"
              >
                {t.signup}
              </button>
            </div>
          </section>
        ) : (
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
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
    className={`p-1 rounded focus:outline-none ${
      darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
    }`}
    aria-label="Toggle aspect ratio"
  >
    {aspectRatio ? (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 1 10 0v4" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 1 9.9-2" />
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
                        className={`w-full px-3 py-2 border rounded-md focus:ring dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                          darkMode ? 'focus:ring-blue-400' : 'focus:ring-blue-200'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block mb-2">{t.height}</label>
                      <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(parseInt(e.target.value))}
                        min="1"
                        className={`w-full px-3 py-2 border rounded-md focus:ring dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                          darkMode ? 'focus:ring-blue-400' : 'focus:ring-blue-200'
                        }`}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={setToOriginalSize}
                      className={`py-1 px-2 rounded-md text-xs hover:opacity-90 ${
                        darkMode ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                      }`}
                    >
                      {t.originalSize}
                    </button>
                    <button
                      onClick={zoomIn}
                      className={`py-1 px-2 rounded-md text-xs hover:opacity-90 ${
                        darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      {t.zoomIn}
                    </button>
                    <button
                      onClick={zoomOut}
                      className={`py-1 px-2 rounded-md text-xs hover:opacity-90 ${
                        darkMode ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-purple-500 hover:bg-purple-600 text-white'
                      }`}
                    >
                      {t.zoomOut}
                    </button>
                  </div>
                  <div>
                    <label className="block mb-2">{t.format}</label>
                    <select
                      value={format}
                      onChange={(e) => setFormat(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:ring dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                        darkMode ? 'focus:ring-blue-400' : 'focus:ring-blue-200'
                      }`}
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
                        <span>منخفض</span>
                        <span>عالي</span>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={resetSettings}
                      className={`py-2 px-4 rounded-md font-medium hover:opacity-90 ${
                        darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                      }`}
                    >
                      {t.reset}
                    </button>
                    <button
                      onClick={resizeImage}
                      disabled={loading}
                      className={`flex-1 py-2 px-4 rounded-md font-medium hover:opacity-90 ${
                        loading
                          ? 'opacity-70 cursor-not-allowed'
                          : darkMode
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
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
                    className={`mt-6 w-full py-2 px-4 rounded-md font-medium transition-all hover:opacity-90 ${
                      darkMode ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                  >
                    {t.download}
                  </button>
                </>
              ) : (
                <p className="text-center mt-10">
                  {!image ? t.noImage : loading ? t.resizing : "حدد الحجم واضغط تغيير"}
                </p>
              )}
            </div>
          </section>
        )}
      </main>
      <footer className={`p-4 text-center mt-10 ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'}`}>
        <p>© 2025 M7D | {t.title} | تم التصميم بحب ❤️</p>
      </footer>
      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`w-full max-w-md p-6 rounded-lg shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} relative transform transition-all scale-100`}
          >
            <h2 className="text-2xl font-bold mb-4 text-center">
              {authMode === 'login' ? t.login : t.signup}
            </h2>

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
                  className="w-full py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium mt-2"
                >
                  {t.submitLogin}
                </button>
                <p className="mt-4 text-center">
                  {t.alreadyAccount}{' '}
                  <button
                    onClick={() => setAuthMode('signup')}
                    className="text-blue-500 hover:underline"
                  >
                    {t.signup}
                  </button>
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
                  className="w-full py-2 rounded-md bg-green-600 hover:bg-green-700 text-white font-medium mt-2"
                >
                  {t.submitSignup}
                </button>
                <p className="mt-4 text-center">
                  {t.needAccount}{' '}
                  <button
                    onClick={() => setAuthMode('login')}
                    className="text-blue-500 hover:underline"
                  >
                    {t.loginNow}
                  </button>
                </p>
              </>
            )}

            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-2 right-3 text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

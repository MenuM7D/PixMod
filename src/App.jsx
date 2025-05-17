import React, { useState, useEffect } from 'react';

const App = () => {
  // Auth states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // login or signup
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [profilePic, setProfilePic] = useState(null);

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
      optimize: 'Optimize for Web',
      autoSize: 'Auto Size',
      preview: 'Live Preview',
      zoomIn: 'Zoom In',
      zoomOut: 'Zoom Out',
      login: 'Login',
      signup: 'Sign Up',
      username: 'Username',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      submitLogin: 'Login',
      submitSignup: 'Create Account',
      alreadyAccount: 'Already have an account?',
      needAccount: "Don't have an account?",
      loginNow: 'Login Now',
      logout: 'Logout',
      profile: 'Profile',
      uploadProfile: 'Upload Profile Picture',
      invalidPass: 'Password must contain letters and numbers',
      passNotMatch: 'Passwords do not match',
      userExists: 'Username already exists',
      requiredFields: 'All fields are required'
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
      optimize: 'تحسين للويب',
      autoSize: 'حجم تلقائي',
      preview: 'معاينة مباشرة',
      zoomIn: 'تكبير',
      zoomOut: 'تصغير',
      login: 'تسجيل الدخول',
      signup: 'إنشاء حساب',
      username: 'اسم المستخدم',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      submitLogin: 'دخول',
      submitSignup: 'إنشاء الحساب',
      alreadyAccount: 'لديك حساب بالفعل؟',
      needAccount: 'لا تملك حسابًا؟',
      loginNow: 'سجل دخولك الآن',
      logout: 'تسجيل الخروج',
      profile: 'الملف الشخصي',
      uploadProfile: 'رفع صورة الملف الشخصي',
      invalidPass: 'يجب أن تحتوي كلمة المرور على حروف وأرقام',
      passNotMatch: 'كلمتا المرور غير متطابقتين',
      userExists: 'اسم المستخدم موجود مسبقًا',
      requiredFields: 'جميع الحقول مطلوبة'
    }
  };

  const t = translations[language];

  // Load user data from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setIsLoggedIn(true);
      if (user.profilePic) setProfilePic(user.profilePic);
    }

    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Handle Sign Up
  const handleSignUp = () => {
    if (!username || !password || (authMode === 'signup' && !confirmPassword)) {
      alert(t.requiredFields);
      return;
    }

    if (authMode === 'signup' && password !== confirmPassword) {
      alert(t.passNotMatch);
      return;
    }

    if (password.length < 6 || !/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
      alert(t.invalidPass);
      return;
    }

    let users = JSON.parse(localStorage.getItem('users') || '[]');

    if (authMode === 'signup') {
      const userExists = users.some(u => u.username === username);
      if (userExists) {
        alert(t.userExists);
        return;
      }

      const newUser = { username, email, password, profilePic: null };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
    }

    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      setCurrentUser(user);
      setIsLoggedIn(true);
      setShowAuthModal(false);
    }
  };

  // Handle Login
  const handleLogin = () => {
    if (!username || !password) {
      alert(t.requiredFields);
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      setCurrentUser(user);
      setIsLoggedIn(true);
      setShowAuthModal(false);
    } else {
      alert('بيانات الدخول خاطئة!');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setIsLoggedIn(false);
    setProfilePic(null);
  };

  // Handle Profile Picture Upload
  const handleProfilePictureUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const updatedUser = { ...currentUser, profilePic: e.target.result };
      setCurrentUser(updatedUser);
      setProfilePic(e.target.result);

      let users = JSON.parse(localStorage.getItem('users') || '[]');
      users = users.map(u => u.username === currentUser.username ? updatedUser : u);
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    };
    reader.readAsDataURL(file);
  };

  // Handle Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setFileSize(file.size / 1024); // in KB

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

  // UI Components

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`w-full max-w-md p-6 rounded-lg shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-2xl font-bold mb-4">{authMode === 'login' ? t.login : t.signup}</h2>
            {authMode === 'signup' && (
              <input
                type="text"
                placeholder={t.username}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full px-4 py-2 mb-4 border rounded-md focus:outline-none ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
              />
            )}
            {authMode === 'signup' && (
              <input
                type="email"
                placeholder={t.email}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-2 mb-4 border rounded-md focus:outline-none ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
              />
            )}
            <input
              type="password"
              placeholder={t.password}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-2 mb-4 border rounded-md focus:outline-none ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
            />
            {authMode === 'signup' && (
              <input
                type="password"
                placeholder={t.confirmPassword}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-4 py-2 mb-4 border rounded-md focus:outline-none ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
              />
            )}
            <button
              onClick={authMode === 'login' ? handleLogin : handleSignUp}
              className={`w-full py-2 rounded-md font-medium mt-2 ${
                darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {authMode === 'login' ? t.submitLogin : t.submitSignup}
            </button>

            <p className="mt-4 text-center">
              {authMode === 'login' ? t.needAccount : t.alreadyAccount}{' '}
              <button
                onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                className="text-blue-500 hover:underline"
              >
                {authMode === 'login' ? t.signup : t.loginNow}
              </button>
            </p>
          </div>
        </div>
      )}

      <header className="p-4 md:p-6 flex justify-between items-center shadow-md bg-opacity-80 backdrop-blur-md backdrop-saturate-150 border-b dark:border-gray-700">
        <h1 className="text-xl md:text-3xl font-bold">{t.title}</h1>
        <div className="flex gap-3 md:gap-4">
          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className={`p-2 rounded-full focus:outline-none transition-transform hover:scale-110 ${
              darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
            }`}
            aria-label="Toggle language"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </button>

          {/* Dark Mode Toggle */}
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
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {!isLoggedIn ? (
        <main className="container mx-auto p-4 md:p-6">
          <section className="max-w-md mx-auto mt-10 p-6 rounded-lg shadow-lg text-center space-y-4">
            <h2 className="text-2xl font-semibold">تسجيل الدخول</h2>
            <p>للاستخدام الكامل للموقع، يرجى تسجيل الدخول أو إنشاء حساب جديد.</p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setAuthMode('login');
                  setShowAuthModal(true);
                }}
                className="flex-1 py-2 px-4 rounded-md bg-blue-500 hover:bg-blue-600 text-white"
              >
                {t.login}
              </button>
              <button
                onClick={() => {
                  setAuthMode('signup');
                  setShowAuthModal(true);
                }}
                className="flex-1 py-2 px-4 rounded-md bg-green-500 hover:bg-green-600 text-white"
              >
                {t.signup}
              </button>
            </div>
          </section>
        </main>
      ) : (
        <>
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
              {profilePic ? (
                <img src={profilePic} alt="Profile" className="w-16 h-16 rounded-full object-cover border dark:border-gray-600" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                  {currentUser?.username.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h2 className="text-xl font-semibold">{currentUser?.username}</h2>
                <label className="mt-2 inline-block cursor-pointer text-sm underline">
                  {t.uploadProfile}
                  <input type="file" accept="image/*" onChange={handleProfilePictureUpload} className="hidden" />
                </label>
              </div>
            </div>

            {/* Image Resizer Section */}
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
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 9.9-2" />
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
                          className={`w-full px-3 py-2 border rounded-md focus:ring focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
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
                          className={`w-full px-3 py-2 border rounded-md focus:ring focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                            darkMode ? 'focus:ring-blue-400' : 'focus:ring-blue-200'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={setToOriginalSize}
                        className={`py-1 px-2 rounded-md text-xs transition-all hover:opacity-90 ${
                          darkMode ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                        }`}
                      >
                        {t.originalSize}
                      </button>
                      <button
                        onClick={zoomIn}
                        className={`py-1 px-2 rounded-md text-xs transition-all hover:opacity-90 ${
                          darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                      >
                        {t.zoomIn}
                      </button>
                      <button
                        onClick={zoomOut}
                        className={`py-1 px-2 rounded-md text-xs transition-all hover:opacity-90 ${
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
                        className={`w-full px-3 py-2 border rounded-md focus:ring focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
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
                          <span>Low</span>
                          <span>High</span>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={resetSettings}
                        className={`py-2 px-4 rounded-md font-medium transition-all hover:opacity-90 ${
                          darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                        }`}
                      >
                        {t.reset}
                      </button>
                      <button
                        onClick={resizeImage}
                        disabled={loading}
                        className={`flex-1 py-2 px-4 rounded-md font-medium transition-all hover:opacity-90 ${
                          darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
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
                  <p className="text-center mt-10">{!image ? t.noImage : loading ? t.resizing : "Select size and click resize."}</p>
                )}
              </div>
            </section>
          </main>
        </>
      )}

      <footer className={`p-4 text-center mt-10 ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'}`}>
        <p>© 2025 M7D | {t.title}</p>
      </footer>
    </div>
  );
};

export default App;

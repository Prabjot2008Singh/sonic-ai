import React, { useEffect, useState } from 'react';

const SplashScreen = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-4 sm:p-6 md:p-8 transition-opacity duration-500`}>
        <div className={`text-center transition-all duration-1000 ease-in-out ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="flex items-center justify-center gap-4 mb-4 sm:mb-6">
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold text-white tracking-wider">SONIC.AI</h1>
          </div>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90">Feel the Magic in Every Beat</p>
          <div className="mt-8 flex justify-center gap-2">
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
    </div>
  );
};

export default SplashScreen;
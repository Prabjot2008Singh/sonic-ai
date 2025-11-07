import React from 'react';
import { Page } from '../types';

interface LoginPageProps {
  onLogin: () => void;
  onNavigate: (page: Page) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigate }) => {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 text-white flex flex-col items-center justify-center p-4">
      <div className="text-center w-full max-w-md">
        <h1 className="text-5xl sm:text-6xl font-bold text-white mx-auto mb-4 tracking-wide">SONIC.AI</h1>
        <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-12">Feel the Magic in Every Beat</p>

        <div className="space-y-4">
          <button
            onClick={onLogin}
            className="w-full max-w-xs mx-auto bg-white/20 backdrop-blur-lg text-white font-semibold py-3 px-6 rounded-full shadow-lg transform transition-all hover:scale-105 text-base sm:text-lg"
          >
            Continue as Guest
          </button>
        </div>

        <p className="text-xs text-white/70 mt-8 px-4">
          By continuing, you agree to our{' '}
          <button onClick={() => onNavigate('terms')} className="underline font-semibold">Terms of Service</button> and{' '}
          <button onClick={() => onNavigate('privacy')} className="underline font-semibold">Privacy Policy</button>.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
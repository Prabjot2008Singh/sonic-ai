import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import LoginPage from './components/LoginPage';
import ChatPage from './components/ChatPage';
import TermsPage from './components/pages/TermsPage';
import PrivacyPage from './components/pages/PrivacyPage';
import AboutPage from './components/pages/AboutPage';
import ContactPage from './components/pages/ContactPage';
import { Page, Theme } from './types';

const App: React.FC = () => {
    const [showSplash, setShowSplash] = useState(true);
    const [currentPage, setCurrentPage] = useState<Page>('login');
    const [previousPage, setPreviousPage] = useState<Page>('login');
    const [theme, setTheme] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem('theme') as Theme | null;
        if (savedTheme) return savedTheme;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);
    
    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const handleLogin = () => {
        setPreviousPage(currentPage);
        setCurrentPage('chat');
    };

    const handleNavigation = (page: Page) => {
        setPreviousPage(currentPage);
        setCurrentPage(page);
    };

    const handleBack = () => {
        setCurrentPage(previousPage);
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'login':
                return <LoginPage onLogin={handleLogin} onNavigate={handleNavigation} />;
            case 'chat':
                return <ChatPage onNavigate={handleNavigation} theme={theme} toggleTheme={toggleTheme} />;
            case 'terms':
                return <TermsPage onBack={handleBack} />;
            case 'privacy':
                return <PrivacyPage onBack={handleBack} />;
            case 'about':
                return <AboutPage onBack={() => setCurrentPage('chat')} />;
            case 'contact':
                return <ContactPage onBack={() => setCurrentPage('chat')} />;
            default:
                return <LoginPage onLogin={handleLogin} onNavigate={handleNavigation} />;
        }
    };

    return (
        <>
            {showSplash && <SplashScreen />}
            <div className={`w-full min-h-screen font-sans bg-gray-100 dark:bg-gray-900 transition-opacity duration-1000 ${showSplash ? 'opacity-0' : 'opacity-100'}`}>
                {renderPage()}
            </div>
        </>
    );
};

export default App;
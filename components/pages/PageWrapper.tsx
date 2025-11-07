import React from 'react';

interface PageWrapperProps {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ title, onBack, children }) => {
  return (
    <div className="w-full min-h-screen bg-gray-100 dark:bg-gradient-to-br dark:from-gray-700 dark:via-gray-900 dark:to-black text-white flex flex-col items-center p-2 sm:p-4 md:p-8">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-2xl h-full flex flex-col my-auto max-h-[95vh]">
        <header className="flex-shrink-0 flex items-center p-4 border-b border-gray-200 dark:border-white/20 relative">
          <button
            onClick={onBack}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-full p-2.5 transition-colors text-gray-800 dark:text-white"
            aria-label="Go back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg sm:text-xl font-bold text-center w-full px-12 sm:px-14 text-gray-900 dark:text-white">{title}</h1>
        </header>
        <main className="flex-grow p-4 sm:p-6 md:p-8 overflow-y-auto text-gray-600 dark:text-gray-300">
          <div className="prose prose-sm sm:prose-base dark:prose-invert prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-headings:text-gray-900 dark:prose-headings:text-white max-w-none">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PageWrapper;

import React from 'react';

const TypingIndicator = () => (
  <div className="flex items-center space-x-2 p-4">
    <div className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce"></div>
  </div>
);

export default TypingIndicator;

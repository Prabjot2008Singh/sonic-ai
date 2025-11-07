import React, { useState, useRef, useEffect } from 'react';
import { Message, Song } from '../types';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { SendIcon } from './Icons';

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  theme: { primary: string };
  isInputDisabled: boolean;
  onLanguageConfirm: (languages: string[]) => void;
  isLanguageSelectionDone: boolean;
  onAddToQueue: (song: Song) => void;
  queue: Song[];
  onDiscoverMore: (message: Message) => void;
}

const quickMoods = ['happy', 'sad', 'romantic', 'energetic', 'calm'];

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, isLoading, onSendMessage, theme, isInputDisabled, onLanguageConfirm, isLanguageSelectionDone, onAddToQueue, queue, onDiscoverMore }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isLoading && !isInputDisabled) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-b-2xl shadow-2xl overflow-hidden">
      <div className="flex-1 p-3 sm:p-4 md:p-6 space-y-4 overflow-y-auto">
        {messages.map((msg) => (
          <MessageBubble 
            key={msg.id} 
            message={msg} 
            onLanguageConfirm={onLanguageConfirm}
            isLanguageSelectionDone={isLanguageSelectionDone}
            onAddToQueue={onAddToQueue}
            queue={queue}
            onDiscoverMore={onDiscoverMore}
          />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl">
              <TypingIndicator />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="bg-white/90 dark:bg-gray-900/80 backdrop-blur p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 text-center">Quick moods:</p>
          <div id="quick-moods" className="flex flex-wrap gap-2 justify-center">
            {quickMoods.map((mood) => (
              <button
                key={mood}
                onClick={() => onSendMessage(mood)}
                disabled={isLoading || isInputDisabled}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r ${theme.primary} text-white text-xs sm:text-sm font-medium hover:shadow-lg transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {mood}
              </button>
            ))}
          </div>
        </div>

      <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2 sm:space-x-3">
          <input
            id="chat-input"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isInputDisabled ? "Please select languages first..." : "How are you feeling?"}
            className="flex-1 w-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 px-4 py-2 sm:py-3 rounded-full border-2 border-purple-300 dark:border-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 transition-shadow duration-200 text-sm sm:text-base"
            disabled={isLoading || isInputDisabled}
          />
          <button
            type="submit"
            disabled={isLoading || isInputDisabled || !inputText.trim()}
            className={`flex-shrink-0 bg-gradient-to-r ${theme.primary} text-white p-3 sm:p-3.5 rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-110`}
            aria-label="Send message"
          >
            <SendIcon className="h-5 w-5 sm:h-6 sm:h-6" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
import React from 'react';
import { Message, Song } from '../types';
import { SparklesIcon, YoutubeIcon, PlayIcon, PlusIcon, CheckIcon } from './Icons';
import LanguageSelector from './LanguageSelector';

interface MessageBubbleProps {
  message: Message;
  onLanguageConfirm?: (languages: string[]) => void;
  isLanguageSelectionDone?: boolean;
  onAddToQueue: (song: Song) => void;
  queue: Song[];
  onDiscoverMore?: (message: Message) => void;
}

const platforms = [
    { id: 'youtube', name: 'YouTube', color: 'bg-red-600 hover:bg-red-700' },
    { id: 'youtubemusic', name: 'YT Music', color: 'bg-red-500 hover:bg-red-600' },
    { id: 'spotify', name: 'Spotify', color: 'bg-green-600 hover:bg-green-700' },
    { id: 'gaana', name: 'Gaana', color: 'bg-orange-500 hover:bg-orange-600' },
    { id: 'jiosaavn', name: 'JioSaavn', color: 'bg-green-500 hover:bg-green-600' },
];

const getPlatformURL = (song: string, artist: string, platform: string) => {
    const searchQuery = encodeURIComponent(`${song} ${artist}`);
    switch(platform) {
      case 'youtube':
        return `https://www.youtube.com/results?search_query=${searchQuery}`;
      case 'youtubemusic':
        return `https://music.youtube.com/search?q=${searchQuery}`;
      case 'spotify':
        return `https://open.spotify.com/search/${searchQuery}`;
      case 'gaana':
        return `https://gaana.com/search/${searchQuery}`;
      case 'jiosaavn':
        return `https://www.jiosaavn.com/search/${searchQuery}`;
      default:
        return `https://www.youtube.com/results?search_query=${searchQuery}`;
    }
};


const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onLanguageConfirm, isLanguageSelectionDone, onAddToQueue, queue, onDiscoverMore }) => {
  const isUser = message.sender === 'user';

  const renderContent = () => {
    if (message.type === 'language-selection' && !isLanguageSelectionDone && onLanguageConfirm) {
        return (
          <div id="language-selector-container">
            <p className="mb-3 whitespace-pre-wrap text-sm sm:text-base">{message.text}</p>
            <LanguageSelector onConfirm={onLanguageConfirm} />
          </div>
        );
    }
    
    if (message.songs && message.songs.length > 0) {
      return (
        <div>
          <p className="mb-3 whitespace-pre-wrap text-sm sm:text-base">{message.text}</p>
          <ul className="space-y-3">
            {message.songs.map((song) => {
                const isQueued = queue.some(s => s.title === song.title && s.artist === song.artist);
                return (
                  <li key={song.id} className="flex flex-col p-3 bg-gray-200/80 dark:bg-gray-600/80 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm sm:text-base">{song.title}</p>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{song.artist}</p>
                      </div>
                      <div className="flex items-center -mr-2 -mt-1">
                          <button
                              onClick={() => !isQueued && onAddToQueue(song)}
                              disabled={isQueued}
                              className={`p-2 rounded-full transition-colors ${
                                  isQueued ? 'text-green-600 dark:text-green-400 cursor-default' : 'text-gray-500 dark:text-gray-400 hover:text-purple-600 hover:bg-gray-300 dark:hover:bg-gray-500'
                              }`}
                              aria-label={isQueued ? "Song is in queue" : "Add to queue"}
                          >
                              {isQueued ? <CheckIcon className="w-4 h-4" /> : <PlusIcon className="w-4 h-4" />}
                          </button>
                      </div>
                    </div>
                    <div className="flex justify-start mt-2 gap-2 flex-wrap">
                        {platforms.map((platform) => (
                          <a
                            key={platform.id}
                            href={getPlatformURL(song.title, song.artist, platform.id)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 ${platform.color} text-white rounded-full text-xs font-medium transition-transform transform hover:scale-105 shadow-lg`}
                          >
                            {platform.id === 'youtube' ? <YoutubeIcon className="w-3 h-3 sm:w-4 sm:h-4" /> : <PlayIcon className="w-3 h-3 sm:w-4 sm:h-4" />}
                            {platform.name}
                          </a>
                        ))}
                      </div>
                  </li>
                );
            })}
          </ul>
          {!isUser && onDiscoverMore && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => onDiscoverMore(message)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-sm font-semibold hover:bg-purple-200 dark:hover:bg-purple-900/80 transition-all transform hover:scale-105 shadow-sm hover:shadow-md"
              >
                <SparklesIcon className="w-4 h-4" />
                Discover More
              </button>
            </div>
          )}
        </div>
      );
    }
    return <p className="whitespace-pre-wrap text-sm sm:text-base">{message.text}</p>;
  };

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] sm:max-w-md lg:max-w-lg rounded-2xl px-4 py-3 sm:px-5 sm:py-3 shadow-lg ${isUser ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
        {!isUser && <SparklesIcon className="inline w-4 h-4 mr-1 text-purple-600 dark:text-purple-400" />}
        {renderContent()}
      </div>
    </div>
  );
};

export default MessageBubble;
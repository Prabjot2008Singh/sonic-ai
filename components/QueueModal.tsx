import React, { useState } from 'react';
import { Song } from '../types';
import { TrashIcon, YoutubeIcon, PlayIcon, DragHandleIcon } from './Icons';

interface QueueModalProps {
  isOpen: boolean;
  onClose: () => void;
  queue: Song[];
  onRemoveFromQueue: (song: Song) => void;
  onClearQueue: () => void;
  onReorderQueue: (newQueue: Song[]) => void;
}

const platforms = [
    { id: 'youtube', name: 'YouTube', color: 'bg-red-600 hover:bg-red-700' },
    { id: 'youtubemusic', name: 'YT Music', color: 'bg-red-500 hover:bg-red-600' },
    { id: 'spotify', name: 'Spotify', color: 'bg-green-600 hover:bg-green-700' },
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
      default:
        return `https://www.youtube.com/results?search_query=${searchQuery}`;
    }
};

const QueueModal: React.FC<QueueModalProps> = ({ isOpen, onClose, queue, onRemoveFromQueue, onClearQueue, onReorderQueue }) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleDragStart = (e: React.DragEvent<HTMLLIElement>, index: number) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLLIElement>, dropIndex: number) => {
    e.preventDefault();
    const draggedItemIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (draggedItemIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newQueue = [...queue];
    const [draggedItem] = newQueue.splice(draggedItemIndex, 1);
    newQueue.splice(dropIndex, 0, draggedItem);
    
    onReorderQueue(newQueue);
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md m-4 text-gray-800 transform transition-all animate-scale-in flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg sm:text-xl font-bold dark:text-gray-100">Your Song Queue ({queue.length})</h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-2 transition-colors"
            aria-label="Close queue"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <main className="flex-grow p-4 overflow-y-auto">
          {queue.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 dark:text-gray-400">Your queue is empty.</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Add songs from the chat!</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {queue.map((song, index) => (
                <li 
                  key={song.id} 
                  className={`flex flex-col p-3 bg-gray-100 dark:bg-gray-700 rounded-lg transition-opacity ${draggedIndex === index ? 'opacity-50' : ''}`}
                  draggable="true"
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-2">
                        <div className="cursor-move touch-none pt-0.5 text-gray-400 dark:text-gray-500" aria-label="Drag to reorder">
                           <DragHandleIcon className="w-4 h-4"/>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm sm:text-base">{song.title}</p>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{song.artist}</p>
                        </div>
                    </div>
                    <button
                      onClick={() => onRemoveFromQueue(song)}
                      className="p-2 -mr-2 -mt-1 text-gray-500 dark:text-gray-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-800/50 rounded-full transition-colors"
                      aria-label="Remove from queue"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex justify-start mt-2 gap-2 flex-wrap pl-6">
                      {platforms.map((platform) => (
                        <a
                          key={platform.id}
                          href={getPlatformURL(song.title, song.artist, platform.id)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-1.5 px-2.5 py-1 ${platform.color} text-white rounded-full text-xs font-medium transition-transform transform hover:scale-105 shadow-md`}
                        >
                          {platform.id === 'youtube' ? <YoutubeIcon className="w-3 h-3" /> : <PlayIcon className="w-3 h-3" />}
                          {platform.name}
                        </a>
                      ))}
                    </div>
                </li>
              ))}
            </ul>
          )}
        </main>

        {queue.length > 0 && (
            <footer className="flex-shrink-0 bg-gray-50 dark:bg-gray-900 px-4 py-3 flex justify-end rounded-b-2xl">
                <button
                    onClick={onClearQueue}
                    className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-800/40 dark:text-red-300 dark:hover:bg-red-800/70 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                    Clear All
                </button>
            </footer>
        )}
      </div>
       <style>{`
        @keyframes scale-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default QueueModal;

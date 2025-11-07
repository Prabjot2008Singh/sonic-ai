import React from 'react';
import { Song } from '../types';
import { CloseIcon, WavesIcon } from './Icons';

interface PiPPlayerProps {
  song: Song | null;
  onClose: () => void;
}

const PiPPlayer: React.FC<PiPPlayerProps> = ({ song, onClose }) => {
  if (!song) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-72 sm:w-80 bg-white/80 backdrop-blur-lg rounded-xl shadow-2xl text-gray-800 transform transition-all animate-slide-in-up overflow-hidden">
      <div className="p-4 flex items-center gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white shadow-lg">
            <WavesIcon className="w-6 h-6 animate-pulse" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm truncate">{song.title}</p>
          <p className="text-xs text-gray-600 truncate">{song.artist}</p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-500 hover:bg-black/10 rounded-full p-1.5 transition-colors"
          aria-label="Close player"
        >
          <CloseIcon className="w-5 h-5" />
        </button>
      </div>
      <style>{`
        @keyframes slide-in-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-in-up {
          animation: slide-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default PiPPlayer;
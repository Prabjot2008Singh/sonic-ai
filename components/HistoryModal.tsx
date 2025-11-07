import React, { useState, useMemo } from 'react';
import { HistoryEntry, Song } from '../types';
import { PlusIcon, CheckIcon } from './Icons';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryEntry[];
  onAddToQueue: (song: Song) => void;
  queue: Song[];
}

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, history, onAddToQueue, queue }) => {
  const [moodFilter, setMoodFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const uniqueMoods = useMemo(() => [...new Set(history.map(item => item.mood))], [history]);

  const filteredHistory = useMemo(() => {
    let filtered = [...history];

    if (moodFilter !== 'all') {
      filtered = filtered.filter(item => item.mood === moodFilter);
    }
    if (startDate) {
      const start = new Date(startDate).setHours(0, 0, 0, 0);
      filtered = filtered.filter(item => item.timestamp >= start);
    }
    if (endDate) {
      const end = new Date(endDate).setHours(23, 59, 59, 999);
      filtered = filtered.filter(item => item.timestamp <= end);
    }
    return filtered.reverse();
  }, [history, moodFilter, startDate, endDate]);

  const resetFilters = () => {
    setMoodFilter('all');
    setStartDate('');
    setEndDate('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg m-4 text-gray-800 transform transition-all animate-scale-in flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg sm:text-xl font-bold dark:text-gray-100">Song History ({history.length})</h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-2 transition-colors"
            aria-label="Close history"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="mood-filter" className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Filter by Mood</label>
              <select id="mood-filter" value={moodFilter} onChange={e => setMoodFilter(e.target.value)} className="w-full bg-white dark:bg-gray-700 text-sm rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-purple-500 focus:ring-purple-500">
                <option value="all">All Moods</option>
                {uniqueMoods.map(mood => <option key={mood} value={mood} className="capitalize">{mood}</option>)}
              </select>
            </div>
            <div>
               <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Filter by Date</label>
               <div className="flex gap-2">
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-white dark:bg-gray-700 text-sm rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-purple-500 focus:ring-purple-500" placeholder="Start Date"/>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full bg-white dark:bg-gray-700 text-sm rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-purple-500 focus:ring-purple-500" placeholder="End Date"/>
               </div>
            </div>
          </div>
           <button onClick={resetFilters} className="mt-3 text-xs text-purple-600 dark:text-purple-400 hover:underline">Reset Filters</button>
        </div>

        <main className="flex-grow p-4 overflow-y-auto">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 dark:text-gray-400">No songs match your filters.</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{history.length === 0 ? "Your history is empty." : "Try adjusting your filters."}</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {filteredHistory.map(({ song, mood, timestamp }) => {
                const isQueued = queue.some(s => s.id === song.id);
                return (
                  <li key={timestamp} className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm sm:text-base">{song.title}</p>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{song.artist}</p>
                      <p className="text-xs text-purple-600 dark:text-purple-400 mt-1 font-medium capitalize">For: {mood}</p>
                    </div>
                    <button
                      onClick={() => !isQueued && onAddToQueue(song)}
                      disabled={isQueued}
                      className={`p-2 rounded-full transition-colors ${
                          isQueued ? 'text-green-600 dark:text-green-400 cursor-default' : 'text-gray-500 dark:text-gray-400 hover:text-purple-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                      aria-label={isQueued ? "Song is in queue" : "Add to queue"}
                    >
                      {isQueued ? <CheckIcon className="w-5 h-5" /> : <PlusIcon className="w-5 h-5" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </main>
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

export default HistoryModal;
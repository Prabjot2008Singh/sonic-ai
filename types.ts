import { Song } from './Song';

export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  songs?: Song[];
  type?: 'text' | 'language-selection';
}

export interface AIResponse {
  mood: string;
  responseText: string;
  songs: { title: string; artist: string; }[];
}

export interface HistoryEntry {
  song: Song;
  mood: string;
  timestamp: number;
}

export type Page = 'login' | 'chat' | 'terms' | 'privacy' | 'about' | 'contact';
export type Theme = 'light' | 'dark';

// This is a placeholder for the Song type if it were in its own file
// In the current structure, Song is defined in types.ts directly
// export { Song } from './Song';
export { Song };

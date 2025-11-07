import React, { useState, useEffect } from 'react';
import ChatInterface from './ChatInterface';
import { getAiResponse } from '../services/geminiService';
import { Message, Page, Song, HistoryEntry, Theme } from '../types';
import { SparklesIcon, QueueIcon, LanguageIcon, HistoryIcon, SettingsIcon } from './Icons';
import ConfirmationDialog from './ConfirmationDialog';
import QueueModal from './QueueModal';
import HistoryModal from './HistoryModal';
import OnboardingTour from './OnboardingTour';
import SettingsModal from './SettingsModal';

const INITIAL_MESSAGES: Message[] = [
    {
        id: 0,
        text: "🎵 Welcome to Sonic.AI! First, let's personalize your experience.",
        sender: 'ai',
        type: 'text'
    },
    {
        id: 1,
        text: "Please select your preferred music languages or industries from the list below.",
        sender: 'ai',
        type: 'language-selection'
    }
];

const emotionThemes = {
    happy: { gradient: 'from-yellow-400 via-orange-400 to-pink-500', primary: 'from-yellow-500 to-orange-500' },
    sad: { gradient: 'from-blue-400 via-indigo-400 to-purple-500', primary: 'from-blue-500 to-indigo-500' },
    romantic: { gradient: 'from-pink-400 via-rose-400 to-red-500', primary: 'from-pink-500 to-rose-500' },
    energetic: { gradient: 'from-orange-500 via-red-500 to-pink-600', primary: 'from-orange-500 to-red-500' },
    stressed: { gradient: 'from-indigo-400 via-purple-400 to-pink-500', primary: 'from-indigo-500 to-purple-500' },
    anxious: { gradient: 'from-violet-400 via-purple-500 to-fuchsia-500', primary: 'from-violet-500 to-purple-500' },
    calm: { gradient: 'from-green-400 via-teal-400 to-blue-500', primary: 'from-green-500 to-teal-500' },
    angry: { gradient: 'from-red-500 via-pink-500 to-purple-600', primary: 'from-red-500 to-pink-500' },
    lonely: { gradient: 'from-slate-400 via-gray-400 to-zinc-500', primary: 'from-slate-500 to-gray-500' },
    tired: { gradient: 'from-cyan-400 via-sky-400 to-blue-500', primary: 'from-cyan-500 to-sky-500' },
    motivated: { gradient: 'from-amber-500 via-orange-500 to-red-600', primary: 'from-amber-500 to-orange-500' },
    peaceful: { gradient: 'from-emerald-400 via-teal-400 to-cyan-500', primary: 'from-emerald-500 to-teal-500' },
    excited: { gradient: 'from-fuchsia-500 via-pink-500 to-rose-600', primary: 'from-fuchsia-500 to-pink-500' },
    reflective: { gradient: 'from-gray-400 via-cyan-400 to-blue-500', primary: 'from-gray-500 to-cyan-500' },
    nostalgic: { gradient: 'from-orange-300 via-amber-400 to-yellow-500', primary: 'from-orange-400 to-amber-400' },
    adventurous: { gradient: 'from-lime-400 via-green-500 to-emerald-600', primary: 'from-lime-500 to-green-500' },
    confused: { gradient: 'from-slate-500 via-violet-500 to-indigo-600', primary: 'from-slate-500 to-violet-500' },
    grateful: { gradient: 'from-rose-300 via-pink-400 to-fuchsia-400', primary: 'from-rose-400 to-pink-400' },
    hopeful: { gradient: 'from-sky-300 via-cyan-300 to-teal-400', primary: 'from-sky-400 to-cyan-400' },
    playful: { gradient: 'from-fuchsia-400 via-pink-500 to-orange-400', primary: 'from-fuchsia-500 to-pink-500' },
    proud: { gradient: 'from-amber-400 via-yellow-400 to-orange-400', primary: 'from-amber-500 to-yellow-500' },
    surprised: { gradient: 'from-yellow-300 via-cyan-400 to-lime-400', primary: 'from-yellow-400 to-cyan-400' },
    loved: { gradient: 'from-red-500 via-rose-500 to-pink-500', primary: 'from-red-500 to-rose-500' },
    neutral: { gradient: 'from-purple-500 via-pink-500 to-orange-500', primary: 'from-purple-500 to-pink-500' }
};

interface ChatPageProps {
  onNavigate: (page: Page) => void;
  theme: Theme;
  toggleTheme: () => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ onNavigate, theme, toggleTheme }) => {
    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
    const [isLoading, setIsLoading] = useState(false);
    const [currentEmotion, setCurrentEmotion] = useState('neutral');
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [isClearQueueConfirmOpen, setIsClearQueueConfirmOpen] = useState(false);
    const [languageSelectionDone, setLanguageSelectionDone] = useState(false);
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
    const [queue, setQueue] = useState<Song[]>([]);
    const [isQueueOpen, setIsQueueOpen] = useState(false);
    const [isInitialSetup, setIsInitialSetup] = useState(true);
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [tourStep, setTourStep] = useState(0);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const tourSteps = [
        {
          selector: '#language-selector-container',
          title: 'Select Your Music',
          content: "First, pick your favorite music languages or industries. This helps us find songs you'll truly love.",
          position: 'top',
        },
        {
          selector: '#chat-input',
          title: 'Share Your Mood',
          content: "Great! Now, tell us how you're feeling. For example, 'I'm feeling happy' or 'I had a stressful day'.",
          position: 'top',
        },
        {
          selector: '#quick-moods',
          title: 'Quick Moods',
          content: 'In a hurry? Use these quick mood buttons for instant recommendations based on common feelings.',
          position: 'top',
        },
        {
          selector: '#chat-container',
          title: "You're All Set!",
          content: 'Enjoy your personalized music journey. Feel the magic in every beat!',
          position: 'bottom',
        }
    ] as const;

    useEffect(() => {
        const onboardingComplete = localStorage.getItem('onboardingComplete');
        if (!onboardingComplete) {
            setShowOnboarding(true);
        }
    }, []);

    const emotionTheme = emotionThemes[currentEmotion as keyof typeof emotionThemes] || emotionThemes.neutral;

    const handleAddToQueue = (song: Song) => {
        if (!queue.some(s => s.id === song.id)) {
            setQueue(prev => [...prev, song]);
        }
    };

    const handleRemoveFromQueue = (songToRemove: Song) => {
        setQueue(prev => prev.filter(song => song.id !== songToRemove.id));
    };

    const handleClearQueue = () => {
        setIsClearQueueConfirmOpen(true);
    };
    
    const confirmAndClearQueue = () => {
        setQueue([]);
        setIsQueueOpen(false);
        setIsClearQueueConfirmOpen(false);
    };

    const handleReorderQueue = (newQueue: Song[]) => {
        setQueue(newQueue);
    };

    const handleOnboardingClose = () => {
        setShowOnboarding(false);
        localStorage.setItem('onboardingComplete', 'true');
    };

    const handleLanguageConfirm = (languages: string[]) => {
        let finalLanguages = languages;
        if (languages.length === 0) {
            finalLanguages = ['Bollywood - Hindi', 'Pollywood - Punjabi'];
        }
        setSelectedLanguages(finalLanguages);
        setLanguageSelectionDone(true);

        const userLangMessage: Message = {
            id: Date.now(),
            text: `Selected: ${finalLanguages.map(l => {
                const parts = l.split(' - ');
                return parts.length > 1 ? parts[1] : parts[0];
            }).join(', ')}.`,
            sender: 'user',
        };
        
        const followUpText = isInitialSetup 
            ? "Awesome choice! Now, how are you feeling today?"
            : "Great, your preferences have been updated! So, what's the mood now?";

        const botNextStepMessage: Message = {
            id: Date.now() + 1,
            text: followUpText,
            sender: 'ai',
        };
        setMessages(prev => [...prev, userLangMessage, botNextStepMessage]);
        
        if (showOnboarding) {
            setTourStep(1);
        }

        if (isInitialSetup) {
            setIsInitialSetup(false);
        }
    };

    const addBotMessage = (text: string, songs?: Song[]) => {
         const aiMessage: Message = {
            id: Date.now(),
            text,
            sender: 'ai',
            songs,
        };
        setMessages(prev => [...prev, aiMessage]);
    }

    const handleChangeLanguageClick = () => {
        if (!languageSelectionDone) return;

        setLanguageSelectionDone(false);
        if (isInitialSetup) {
            setIsInitialSetup(false);
        }

        const changeLangMessage: Message = {
            id: Date.now(),
            text: "Of course! Please select your new preferred music languages or industries below.",
            sender: 'ai',
            type: 'language-selection',
        };
        setMessages(prev => [...prev, changeLangMessage]);
    };

    const handleSendMessage = async (text: string) => {
        const userMessage: Message = {
            id: Date.now(),
            text,
            sender: 'user',
        };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        const lowerInput = text.toLowerCase().trim();
        
        const changeLanguageKeywords = ['change language', 'update language', 'select language', 'change preference', 'update preference', 'choose new language', 'pick different music'];
        if (changeLanguageKeywords.some(keyword => lowerInput.includes(keyword))) {
            setIsLoading(false);
            setLanguageSelectionDone(false);
            const changeLangMessage: Message = {
                id: Date.now() + 1,
                text: "Of course! Please select your new preferred music languages or industries below.",
                sender: 'ai',
                type: 'language-selection',
            };
            setMessages(prev => [...prev, changeLangMessage]);
            return;
        }

        const creatorKeywords = ['who built', 'who created', 'who developed', 'who made', 'your creator', 'your developer', 'prabjot singh', 'prabjot'];
        if (creatorKeywords.some(keyword => lowerInput.includes(keyword))) {
            setTimeout(() => {
                addBotMessage('🌟 Sonic.AI was conceptualized and developed by Mr. Prabjot Singh, a visionary who believes in combining technology and art to support emotional well-being. His goal is to make music discovery a more intuitive and emotionally connected experience for everyone. 🎵');
                setIsLoading(false);
            }, 500);
            return;
        }

        const whoAreYouKeywords = ['who are you', 'what are you', 'who r u', 'introduce yourself'];
        if (whoAreYouKeywords.some(keyword => lowerInput.includes(keyword))) {
            setTimeout(() => {
                addBotMessage("🎵 Hi! I'm SONIC.AI - your personal music companion! I use AI to understand your feelings and find the perfect songs to match your mood. My purpose is to enhance your emotional well-being through music. Just tell me how you're feeling, and let's 'Feel the Magic in Every Beat'! ✨");
                setIsLoading(false);
            }, 500);
            return;
        }

        const purposeKeywords = ['what is your purpose', 'your purpose', 'what do you do', 'what can you do', 'app purpose', 'why were you created'];
        if (purposeKeywords.some(keyword => lowerInput.includes(keyword))) {
            setTimeout(() => {
                addBotMessage("🎯 My purpose is to enhance emotional well-being through the power of music. I achieve this by:\n\n🤖 Using advanced AI to understand the nuances of your mood.\n🎵 Curating personalized song recommendations to resonate with how you feel.\n💚 Creating a space where music can be a tool for relaxation, motivation, and reflection.\n\nUltimately, I'm here to make music discovery a more intuitive and emotionally connected experience. Feel the Magic in Every Beat! ✨");
                setIsLoading(false);
            }, 500);
            return;
        }

        const thanksKeywords = ['thank', 'thanks', 'appreciate'];
        if (thanksKeywords.some(keyword => lowerInput.includes(keyword))) {
            setTimeout(() => {
                addBotMessage("😊 You're welcome! I'm happy to help brighten your day with music! Keep feeling the magic in every beat! 🎵💫");
                setIsLoading(false);
            }, 500);
            return;
        }

        const greetingKeywords = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'];
        if (greetingKeywords.some(keyword => lowerInput.startsWith(keyword))) {
            setTimeout(() => {
                addBotMessage("Hello there! It's wonderful to see you. How are you feeling today? Tell me, and I'll find the perfect soundtrack for your moment.");
                setIsLoading(false);
            }, 500);
            return;
        }

        const howAreYouKeywords = ['how are you', "how's it going", "what's up", 'hw r u'];
        if (howAreYouKeywords.some(keyword => lowerInput.includes(keyword))) {
            setTimeout(() => {
                addBotMessage("I'm doing wonderfully, thank you for asking! I'm here and ready to find the perfect music for you. How are you feeling right now?");
                setIsLoading(false);
            }, 500);
            return;
        }

        const farewellKeywords = ['bye', 'goodbye', 'see you', 'cya', 'take care'];
        if (farewellKeywords.some(keyword => lowerInput.includes(keyword))) {
            setTimeout(() => {
                addBotMessage("Goodbye for now! I hope the music brought you some joy. Feel free to return whenever you need a song for your mood. Take care! 🎵");
                setIsLoading(false);
            }, 500);
            return;
        }
        
        try {
            const { mood, songs, responseText } = await getAiResponse(text, selectedLanguages, []);
            setCurrentEmotion(mood);

            // If the AI determines it's not a mood query, it will return an empty song list.
            if (!songs || songs.length === 0) {
                addBotMessage(responseText);
            } else {
                const songsWithIds: Song[] = songs.map((song, index) => ({
                    ...song,
                    id: `${Date.now()}-${index}`
                }));
                
                const newHistoryEntries: HistoryEntry[] = songsWithIds.map(song => ({
                    song,
                    mood: mood,
                    timestamp: Date.now() + Math.random(),
                }));
                setHistory(prev => [...prev, ...newHistoryEntries]);
    
                addBotMessage(responseText, songsWithIds);
            }
        } catch (error) {
            addBotMessage("I'm sorry, I had trouble finding songs. Please try a different mood or check your connection.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleDiscoverMore = async (originalMessage: Message) => {
        const userMessage: Message = {
            id: Date.now(),
            text: 'Find more songs like these!',
            sender: 'user',
        };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const originalSongs = originalMessage.songs || [];
            const songList = originalSongs.map(s => `'${s.title} by ${s.artist}'`).join(', ');

            const discoverPrompt = `I'm still in a '${currentEmotion}' mood. I liked these songs: ${songList}. Could you find 3-5 more songs that fit this vibe? Please suggest different tracks from what I've already seen.`;

            const { mood, songs, responseText } = await getAiResponse(discoverPrompt, selectedLanguages, []);
            
            setCurrentEmotion(mood);

            const songsWithIds: Song[] = songs.map((song, index) => ({
                ...song,
                id: `${Date.now()}-${index}`
            }));
            
            const newHistoryEntries: HistoryEntry[] = songsWithIds.map(song => ({
                song,
                mood: mood,
                timestamp: Date.now() + Math.random(),
            }));
            setHistory(prev => [...prev, ...newHistoryEntries]);

            addBotMessage(responseText, songsWithIds);
        } catch (error) {
            addBotMessage("I'm sorry, I had trouble finding more songs. Please try a different mood or check your connection.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetChat = () => {
        setMessages(INITIAL_MESSAGES);
        setCurrentEmotion('neutral');
        setLanguageSelectionDone(false);
        setSelectedLanguages([]);
        setQueue([]);
        setHistory([]);
        setIsInitialSetup(true);
    };

    const confirmAndResetChat = () => {
        handleResetChat();
        setIsConfirmDialogOpen(false);
    };

    const handleRevisitTour = () => {
        setIsSettingsOpen(false);
        localStorage.removeItem('onboardingComplete');
        setTourStep(0);
        setShowOnboarding(true);
    };
    
    const handleSettingsChangeLanguage = () => {
        setIsSettingsOpen(false);
        handleChangeLanguageClick();
    };

    return (
        <div className={`w-full min-h-screen bg-gradient-to-br ${emotionTheme.gradient} dark:bg-gradient-to-br dark:from-gray-900 dark:via-purple-900 dark:to-black text-white transition-all duration-1000`}>
            <main className="w-full h-screen flex flex-col items-center p-2 sm:p-4">
               <div id="chat-container" className="w-full max-w-4xl lg:max-w-6xl 2xl:max-w-none 2xl:px-8 mx-auto flex flex-col h-full">
                <header className="flex-shrink-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur rounded-t-2xl shadow-2xl p-4 sm:p-5 mt-0 sm:mt-4 md:mt-8 relative">
                    <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
                         <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            SONIC.AI
                        </h1>
                    </div>
                     <p className="text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400 italic mb-3">Feel the Magic in Every Beat</p>
                     <div className={`flex items-center justify-center gap-2 p-2 sm:p-3 bg-gradient-to-r ${emotionTheme.primary} text-white rounded-full shadow-lg text-xs sm:text-sm`}>
                        <SparklesIcon className="w-4 h-4" />
                        <span className="font-semibold">Emotion: {currentEmotion.toUpperCase()}</span>
                    </div>
                    <div id="header-icons" className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center gap-1">
                        <button 
                            onClick={() => setIsQueueOpen(true)}
                            className="relative p-2 text-gray-500 dark:text-gray-400 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors"
                            aria-label="Open song queue"
                        >
                            <QueueIcon className="h-5 w-5"/>
                            {queue.length > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-pink-500 text-white text-[10px] font-bold">
                                    {queue.length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setIsHistoryOpen(true)}
                            className="p-2 text-gray-500 dark:text-gray-400 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors"
                            aria-label="Open song history"
                        >
                            <HistoryIcon className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-1">
                        <button 
                            onClick={() => setIsSettingsOpen(true)}
                            className="p-2 text-gray-500 dark:text-gray-400 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors"
                            aria-label="Open settings"
                        >
                            <SettingsIcon className="h-5 w-5"/>
                        </button>
                    </div>
                </header>
                <div className="flex-grow w-full min-h-0">
                   <ChatInterface 
                        messages={messages} 
                        isLoading={isLoading} 
                        onSendMessage={handleSendMessage} 
                        theme={emotionTheme} 
                        isInputDisabled={!languageSelectionDone}
                        onLanguageConfirm={handleLanguageConfirm}
                        isLanguageSelectionDone={languageSelectionDone}
                        onAddToQueue={handleAddToQueue}
                        queue={queue}
                        onDiscoverMore={handleDiscoverMore}
                    />
                </div>
                 <footer className="flex-shrink-0 text-center py-3 sm:py-4 text-white/90 dark:text-gray-400 text-xs sm:text-sm px-4">
                    <div className="flex justify-center items-center space-x-4 mb-2">
                        <button onClick={() => onNavigate('about')} className="hover:underline">About</button>
                        <button onClick={() => onNavigate('terms')} className="hover:underline">Terms</button>
                        <button onClick={() => onNavigate('privacy')} className="hover:underline">Privacy</button>
                        <button onClick={() => onNavigate('contact')} className="hover:underline">Contact</button>
                    </div>
                    <p className="mb-1 text-xs sm:text-sm">✨ Made with ❤ in India ✨</p>
                    <p className="text-[10px] sm:text-xs opacity-75">🎵 Feel the Magic in Every Beat 🎵</p>
                </footer>
              </div>
            </main>
            <ConfirmationDialog
                isOpen={isConfirmDialogOpen}
                onClose={() => setIsConfirmDialogOpen(false)}
                onConfirm={confirmAndResetChat}
                title="Clear Chat History"
                message="Are you sure you want to clear the entire conversation? This action cannot be undone."
                confirmButtonText="Clear Chat"
            />
            <ConfirmationDialog
                isOpen={isClearQueueConfirmOpen}
                onClose={() => setIsClearQueueConfirmOpen(false)}
                onConfirm={confirmAndClearQueue}
                title="Clear Song Queue"
                message="Are you sure you want to clear your entire song queue? This action cannot be undone."
                confirmButtonText="Clear Queue"
            />
            <QueueModal
                isOpen={isQueueOpen}
                onClose={() => setIsQueueOpen(false)}
                queue={queue}
                onRemoveFromQueue={handleRemoveFromQueue}
                onClearQueue={handleClearQueue}
                onReorderQueue={handleReorderQueue}
            />
            <HistoryModal
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
                history={history}
                onAddToQueue={(song) => handleAddToQueue(song)}
                queue={queue}
            />
            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                theme={theme}
                onToggleTheme={toggleTheme}
                onClearChat={() => {
                    setIsSettingsOpen(false);
                    setIsConfirmDialogOpen(true);
                }}
                onRevisitTour={handleRevisitTour}
                onChangeLanguage={handleSettingsChangeLanguage}
            />
            <OnboardingTour
                isOpen={showOnboarding}
                onClose={handleOnboardingClose}
                steps={tourSteps}
                currentStep={tourStep}
                onStepChange={setTourStep}
            />
        </div>
    );
};

export default ChatPage;
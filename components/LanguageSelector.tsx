import React, { useState } from 'react';

interface LanguageSelectorProps {
  onConfirm: (languages: string[]) => void;
}

const languagesString = "(Bollywood - Hindi), (Tollywood - Telugu), (Kollywood - Tamil), (Mollywood - Malayalam), (Sandalwood - Kannada), (Pollywood - Punjabi), (Dhollywood - Gujarati), (Ollywood - Odia), (Hollywood - American English), (Nollywood - Nigerian English/Yoruba/Hausa/Igbo), (Shaw Brothers - Mandarin/Cantonese), (Gallywood - Ghanaian English/Akan), (Cinecittà - Italian), (Babelsberg - German), (Pinewood - British English), (Studio Ghibli - Japanese), (Pathé - French), (Mosfilm - Russian), (Daemyung Culture - Korean)";
const languageOptions = languagesString.replace(/[()]/g, '').split(', ').map(s => s.trim());

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onConfirm }) => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelection = (language: string) => {
    setSelected(prev =>
      prev.includes(language)
        ? prev.filter(item => item !== language)
        : [...prev, language]
    );
  };

  return (
    <div>
      <div className="max-h-48 overflow-y-auto space-y-2 pr-2 -mr-2">
         <div className="flex flex-wrap gap-2">
            {languageOptions.map(lang => {
              const isSelected = selected.includes(lang);
              const parts = lang.split(' - ');
              const name = parts.length > 1 ? parts[1] : parts[0];
              return (
                <button
                  key={lang}
                  onClick={() => toggleSelection(lang)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all duration-200 ${
                    isSelected
                      ? 'bg-purple-600 border-purple-600 text-white'
                      : 'bg-white/50 dark:bg-gray-600/50 border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-200 hover:border-purple-400 dark:hover:border-purple-500'
                  }`}
                >
                  {name}
                </button>
              );
            })}
        </div>
      </div>
      <button
        onClick={() => onConfirm(selected)}
        className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
      >
        Confirm Selection
      </button>
    </div>
  );
};

export default LanguageSelector;

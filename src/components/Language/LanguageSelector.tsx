import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-1">
      <button
        onClick={() => setLanguage('fr')}
        className={`p-1.5 rounded-md transition-all duration-200 text-sm ${
          language === 'fr' 
            ? 'bg-indigo-500 bg-opacity-20 text-white' 
            : 'text-gray-400 hover:text-white hover:bg-gray-800'
        }`}
        title="Français"
      >
        🇫🇷
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`p-1.5 rounded-md transition-all duration-200 text-sm ${
          language === 'en' 
            ? 'bg-indigo-500 bg-opacity-20 text-white' 
            : 'text-gray-400 hover:text-white hover:bg-gray-800'
        }`}
        title="English"
      >
        🇬🇧
      </button>
    </div>
  );
};

export default LanguageSelector;

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSelector from '../Language/LanguageSelector';

const translations = {
  fr: {
    title: 'Perfect CV',
    home: 'Accueil',
    templates: 'Modèles',
    preview: 'Aperçu',
    assistant: 'Assistant'
  },
  en: {
    title: 'Perfect CV',
    home: 'Home',
    templates: 'Templates',
    preview: 'Preview',
    assistant: 'Assistant'
  },
  es: {
    title: 'Perfect CV',
    home: 'Inicio',
    templates: 'Plantillas',
    preview: 'Vista Previa',
    assistant: 'Asistente'
  }
};

const Header: React.FC = () => {
  const { language } = useLanguage();
  const location = useLocation();
  const t = translations[language];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-gray-900 shadow-xl">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="ml-2 text-xl font-bold text-white">{t.title}</span>
            </Link>
            
            <div className="hidden md:flex ml-10 space-x-8">
              <Link
                to="/"
                className={`${
                  isActive('/') 
                    ? 'text-white border-b-2 border-indigo-500'
                    : 'text-gray-300 hover:text-white hover:border-b-2 hover:border-indigo-400'
                } px-3 py-2 text-sm font-medium transition-colors duration-200`}
              >
                {t.home}
              </Link>
              <Link
                to="/cv-form/personal-info"
                className={`${
                  isActive('/cv-form/personal-info') || isActive('/cv-form/*')
                    ? 'text-white border-b-2 border-indigo-500'
                    : 'text-gray-300 hover:text-white hover:border-b-2 hover:border-indigo-400'
                } px-3 py-2 text-sm font-medium transition-colors duration-200`}
              >
                {t.assistant}
              </Link>
              <Link
                to="/templates"
                className={`${
                  isActive('/templates')
                    ? 'text-white border-b-2 border-indigo-500'
                    : 'text-gray-300 hover:text-white hover:border-b-2 hover:border-indigo-400'
                } px-3 py-2 text-sm font-medium transition-colors duration-200`}
              >
                {t.templates}
              </Link>
              <Link
                to="/cv-form/preview"
                className={`${
                  isActive('/cv-form/preview')
                    ? 'text-white border-b-2 border-indigo-500'
                    : 'text-gray-300 hover:text-white hover:border-b-2 hover:border-indigo-400'
                } px-3 py-2 text-sm font-medium transition-colors duration-200`}
              >
                {t.preview}
              </Link>
            </div>
          </div>
          
          <div className="flex items-center">
            <LanguageSelector />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;

import React, { createContext, useContext, useState, useEffect } from 'react';
import { logger } from '../utils/logger';

// Import translations
const loadTranslations = () => {
  try {
    logger.info('Starting to load translation files');
    
    // Load French translations
    logger.debug('Loading French translations');
    const frTranslations = require('../translations/fr.json');
    logger.info('French translations loaded successfully', {
      keysCount: Object.keys(frTranslations).length,
      mainSections: Object.keys(frTranslations)
    });

    // Load English translations
    logger.debug('Loading English translations');
    const enTranslations = require('../translations/en.json');
    logger.info('English translations loaded successfully', {
      keysCount: Object.keys(enTranslations).length,
      mainSections: Object.keys(enTranslations)
    });

    // Validate translations structure
    const validateTranslations = (lang: string, translations: any) => {
      logger.debug(`Validating ${lang} translations structure`);
      
      const requiredSections = ['form', 'features', 'testimonials'];
      const missingSections = requiredSections.filter(section => !translations[section]);
      
      if (missingSections.length > 0) {
        logger.warn(`Missing required sections in ${lang} translations`, { missingSections });
      }

      // Validate form section specifically
      if (translations.form) {
        const requiredFormSections = ['personalInfo', 'workExperience', 'education', 'skills'];
        const missingFormSections = requiredFormSections.filter(section => !translations.form[section]);
        
        if (missingFormSections.length > 0) {
          logger.warn(`Missing required form sections in ${lang} translations`, { missingFormSections });
        }
      }
    };

    validateTranslations('fr', frTranslations);
    validateTranslations('en', enTranslations);

    logger.info('All translations loaded and validated successfully');

    return { fr: frTranslations, en: enTranslations };
  } catch (error) {
    logger.error('Error loading translations', { error });
    throw error;
  }
};

type Language = 'fr' | 'en';

// Ensure type safety for imported JSON
interface TranslationType {
  title: string;
  home: string;
  assistant: string;
  templates: string;
  preview: string;
  subtitle: string;
  description: string;
  startButton: string;
  improveButton: string;
  uploadHint: string;
  features: {
    fast: {
      title: string;
      description: string;
    };
    templates: {
      title: string;
      description: string;
    };
    ai: {
      title: string;
      description: string;
    };
  };
  testimonials: {
    title: string;
    roles: {
      developer: string;
      manager: string;
    };
    content1: string;
    content2: string;
  };
  form: {
    personalInfo: {
      title: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      address: string;
      summary: string;
      save: string;
    };
    workExperience: {
      title: string;
      company: string;
      position: string;
      startDate: string;
      endDate: string;
      current: string;
      description: string;
      descriptionPlaceholder: string;
      add: string;
    };
    education: {
      title: string;
      school: string;
      degree: string;
      field: string;
      startDate: string;
      endDate: string;
      current: string;
      description: string;
      add: string;
    };
    skills: {
      title: string;
      name: string;
      level: string;
      category: string;
      addSkill: string;
      addCategory: string;
      newCategoryPlaceholder: string;
      selectLevel: string;
      selectCategory: string;
      levels: {
        beginner: string;
        intermediate: string;
        advanced: string;
        expert: string;
      };
      defaultCategories: {
        technical: string;
        softSkills: string;
        languages: string;
        tools: string;
      };
    };
    projects: {
      title: string;
      name: string;
      description: string;
      technologies: string;
      link: string;
      linkPlaceholder: string;
      startDate: string;
      endDate: string;
      viewProject: string;
      add: string;
    };
    references: {
      title: string;
      name: string;
      position: string;
      company: string;
      email: string;
      phone: string;
      relationship: string;
      relationshipPlaceholder: string;
      hideForm: string;
      addReference: string;
      emailLabel: string;
      phoneLabel: string;
      relationshipLabel: string;
      add: string;
    };
    customSection: {
      title: string;
      sectionTitle: string;
      addSection: string;
      content: string;
      subtitle: string;
      date: string;
      addItem: string;
      cancel: string;
      deleteSection: string;
      enterSectionTitle: string;
      contentRequired: string;
      titleRequired: string;
    };
    certifications: {
      title: string;
      name: string;
      issuer: string;
      date: string;
      expiryDate: string;
      credentialId: string;
      credentialUrl: string;
      issued: string;
      expires: string;
      credentialIdLabel: string;
      verifyCredential: string;
      urlPlaceholder: string;
      add: string;
    };
    validation: {
      required: string;
      invalidEmail: string;
      invalidPhone: string;
    };
    navigation: {
      next: string;
      previous: string;
      finish: string;
      preview: string;
    };
  };
}

interface Translations {
  [key: string]: TranslationType;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translations: Translations;
  t: TranslationType;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const translations: Translations = loadTranslations();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    logger.error('useLanguage hook used outside of LanguageProvider');
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return {
    ...context,
    t: context.translations[context.language]
  };
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fr');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'fr' || savedLanguage === 'en')) {
      logger.info('Loading saved language preference', { savedLanguage });
      setLanguage(savedLanguage);
    } else {
      logger.info('No saved language preference found, using default', { defaultLanguage: 'fr' });
    }
  }, []);

  useEffect(() => {
    logger.debug('Saving language preference', { language });
    localStorage.setItem('language', language);
  }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    translations,
    t: translations[language]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

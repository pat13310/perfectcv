import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './translations/en.json';
import fr from './translations/fr.json';
import { logger } from './utils/logger';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en
      },
      fr: {
        translation: fr
      }
    },
    lng: 'fr', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    debug: process.env.NODE_ENV === 'development'
  })
  .then(() => {
    logger.info('i18next initialized successfully', {
      languages: Object.keys(i18n.services.resourceStore.data),
      currentLanguage: i18n.language
    });
  })
  .catch((error) => {
    logger.error('Error initializing i18next', { error });
  });

export default i18n;

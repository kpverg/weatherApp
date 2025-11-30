import React, { createContext, useState, useEffect } from 'react';
import { loadLanguage, saveLanguage } from '../services/storageService';

export const LanguageContext = createContext();

const translations = {
  en: {
    searchPlaceholder: 'Search city...',
    settings: 'Settings',
    apiKey: 'API Key',
    apiKeyPlaceholder: 'Enter your OpenWeather API key',
    language: 'Language',
    save: 'Save',
    missingApiKey: 'Missing API Key',
    missingApiKeyMsg: 'Please enter a valid API key.',
    english: 'English',
    greek: 'Greek',
  },
  gr: {
    searchPlaceholder: 'Αναζήτηση πόλης...',
    settings: 'Ρυθμίσεις',
    apiKey: 'API Key',
    apiKeyPlaceholder: 'Εισάγετε το API key του OpenWeather',
    language: 'Γλώσσα',
    save: 'Αποθήκευση',
    missingApiKey: 'Λείπει το API Key',
    missingApiKeyMsg: 'Παρακαλώ εισάγετε ένα έγκυρο API key.',
    english: 'Αγγλικά',
    greek: 'Ελληνικά',
  },
};

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState('en');

  useEffect(() => {
    loadLanguage().then(lang => {
      if (lang) {
        setLanguageState(lang);
      }
    });
  }, []);

  const setLanguage = async lang => {
    setLanguageState(lang);
    await saveLanguage(lang);
  };

  const t = key => translations[language][key] || translations['en'][key];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return React.useContext(LanguageContext);
}

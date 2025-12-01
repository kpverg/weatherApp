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
    // Days of week
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
    // Weather descriptions
    'clear sky': 'Clear Sky',
    'few clouds': 'Few Clouds',
    'scattered clouds': 'Scattered Clouds',
    'broken clouds': 'Broken Clouds',
    'shower rain': 'Shower Rain',
    rain: 'Rain',
    thunderstorm: 'Thunderstorm',
    snow: 'Snow',
    mist: 'Mist',
    humidity: 'Humidity',
    feelsLike: 'Feels Like',
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
    // Days of week
    monday: 'Δευτέρα',
    tuesday: 'Τρίτη',
    wednesday: 'Τετάρτη',
    thursday: 'Πέμπτη',
    friday: 'Παρασκευή',
    saturday: 'Σάββατο',
    sunday: 'Κυριακή',
    // Weather descriptions
    'clear sky': 'Καθαρός Ουρανός',
    'few clouds': 'Λίγα Σύννεφα',
    'scattered clouds': 'Διάσπαρτα Σύννεφα',
    'broken clouds': 'Σπασμένα Σύννεφα',
    'shower rain': 'Βροχή',
    rain: 'Βροχή',
    thunderstorm: 'Καταιγίδα',
    snow: 'Χιόνι',
    mist: 'Ομίχλη',
    humidity: 'Υγρασία',
    feelsLike: 'Αίσθηση Θερμοκρασίας',
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

  const t = key => translations[language][key] || translations.en[key];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return React.useContext(LanguageContext);
}

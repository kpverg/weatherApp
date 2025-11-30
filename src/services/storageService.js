// src/services/storageService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveApiKey(key) {
  return AsyncStorage.setItem('apiKey', key);
}

export async function loadApiKey() {
  return AsyncStorage.getItem('apiKey');
}

export async function saveLanguage(lang) {
  return AsyncStorage.setItem('language', lang);
}

export async function loadLanguage() {
  return AsyncStorage.getItem('language');
}

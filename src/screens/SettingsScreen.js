// src/screens/SettingsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { saveApiKey, loadApiKey } from '../services/storageService';
import { useLanguage } from '../context/LanguageContext';
import { colors, shadows, borderRadius, spacing } from '../styles/theme';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { language, setLanguage, t } = useLanguage();
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    async function load() {
      const k = await loadApiKey();
      if (k) setApiKey(k);
    }
    load();
  }, []);

  const save = async () => {
    const cleanKey = apiKey.trim();

    if (!cleanKey) {
      Alert.alert(t('missingApiKey'), t('missingApiKeyMsg'));
      return;
    }

    await saveApiKey(cleanKey);

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('settings')}</Text>
      </View>

      <Text style={styles.label}>API Key</Text>
      <TextInput
        value={apiKey}
        onChangeText={setApiKey}
        style={styles.input}
        placeholder={t('apiKeyPlaceholder')}
        placeholderTextColor="#777"
        autoCapitalize="none"
      />

      <Text style={styles.label}>{t('language')}</Text>
      <View style={styles.languageContainer}>
        <TouchableOpacity
          style={[styles.langBtn, language === 'en' && styles.langBtnActive]}
          onPress={() => setLanguage('en')}
        >
          <Text
            style={[
              styles.langText,
              language === 'en' && styles.langTextActive,
            ]}
          >
            {t('english')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.langBtn, language === 'gr' && styles.langBtnActive]}
          onPress={() => setLanguage('gr')}
        >
          <Text
            style={[
              styles.langText,
              language === 'gr' && styles.langTextActive,
            ]}
          >
            {t('greek')}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={save}>
        <Text style={styles.saveText}>{t('save')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.xl,
    backgroundColor: colors.grayLight,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    marginLeft: spacing.lg,
    color: colors.primary,
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: spacing.xl,
    color: colors.textDark,
  },

  input: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginTop: spacing.sm,
    fontSize: 16,
    color: colors.textDark,
    borderWidth: 2,
    borderColor: colors.grayMedium,
    ...shadows.light,
  },

  languageContainer: {
    flexDirection: 'row',
    marginTop: spacing.md,
    gap: spacing.md,
  },

  langBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.grayMedium,
    ...shadows.light,
  },

  langBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  langText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
  },

  langTextActive: {
    color: colors.white,
  },

  saveBtn: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginTop: 40,
    ...shadows.medium,
  },

  saveText: {
    color: colors.white,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
});

// src/screens/WeatherScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  Keyboard,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';

import { searchCities, searchCitiesGR } from '../services/cityService';
import { fetchWeather, searchCitiesOnline } from '../services/apiService';
import {
  loadApiKey,
  saveLastCity,
  loadLastCity,
} from '../services/storageService';
import { useLanguage } from '../context/LanguageContext';
import {
  colors,
  shadows,
  borderRadius,
  spacing,
  getWeatherTheme,
} from '../styles/theme';

// Helper: get weekday (Tuesday, Wednesday…)
const getDay = dateString => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
};

// Helper: map OpenWeather icon to FontAwesome icon name
const getWeatherIcon = (iconCode) => {
  switch (iconCode) {
    case '01d': return 'sun-o';
    case '01n': return 'moon-o';
    case '02d':
    case '02n':
    case '03d':
    case '03n':
    case '04d':
    case '04n': return 'cloud';
    case '09d':
    case '09n':
    case '10d':
    case '10n': return 'tint';
    case '11d':
    case '11n': return 'bolt';
    case '13d':
    case '13n': return 'snowflake-o';
    case '50d':
    case '50n': return 'bars';
    default: return 'sun-o';
  }
};

export default function WeatherScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { language, t } = useLanguage();

  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [weather, setWeather] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState({
    primary: colors.primary,
    accent: colors.primary,
    background: colors.grayLight,
  });

  // Reload API Key when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadApiKey().then(k => {
        if (k) {
          setApiKey(k);
          if (error === 'missingApiKey') {
            setError(null);
          }
        }
      });
    }, [error])
  );

  // Handle city selection from Map
  useEffect(() => {
    if (route.params?.selectedCity) {
      console.log('Received city from Map:', route.params.selectedCity);
      // Directly call handleSelectCity logic
      const processCityFromMap = async () => {
        setLoading(true);
        try {
          await handleSelectCity(route.params.selectedCity);
        } catch (e) {
          console.error('Error processing map city:', e);
        } finally {
          setLoading(false);
          // Clear params to avoid re-triggering
          navigation.setParams({ selectedCity: undefined });
        }
      };
      processCityFromMap();
    }
  }, [route.params?.selectedCity]);

  // Helper: group weather data by day
  const getWeatherByDay = list => {
    const grouped = {};
    list.forEach(item => {
      const day = getDay(item.dt_txt);
      const translatedDay = t(day.toLowerCase());
      if (!grouped[translatedDay]) {
        grouped[translatedDay] = [];
      }
      grouped[translatedDay].push(item);
    });
    return Object.entries(grouped).map(([day, items]) => ({
      day,
      items,
      temp: Math.round(items[0].main.temp),
      icon: items[0].weather[0].icon,
    }));
  };

  // Load API key and default city on mount
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const k = await loadApiKey();
        if (k) setApiKey(k);

        // Try to load last selected city, fallback to Athens
        let cityToLoad = await loadLastCity();
        if (!cityToLoad) {
          cityToLoad = {
            en: 'Athens',
            gr: 'Αθήνα',
            lat: 37.9838,
            lon: 23.7275,
          };
        }

        if (!k) {
          setError('missingApiKey');
          setLoading(false);
          return;
        }

        const data = await fetchWeather(cityToLoad.lat, cityToLoad.lon, k);
        setWeather({ ...data, selectedCity: cityToLoad });
        // Show the city name in the current language
        const displayName = language === 'gr' ? cityToLoad.gr : cityToLoad.en;
        setSearchText(displayName);
        // Update theme based on temperature and weather
        const weatherDesc = data.list[0]?.weather[0]?.main || '';
        const temp = data.list[0]?.main?.temp || 15;
        const newTheme = getWeatherTheme(temp, weatherDesc);
        setTheme(newTheme);
      } catch (err) {
        console.error(err);
        setError('fetchError');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [language]);

  const handleSearchChange = async (text) => {
    setSearchText(text);
    
    // 1. Get local results
    const localResults = searchCities(text);
    setSuggestions(localResults);

    // 2. If short query, don't search online
    if (text.length < 3) return;

    // 3. Search online for more specific municipalities (like Koroni)
    if (apiKey) {
      const onlineResults = await searchCitiesOnline(text, apiKey);
      
      // Merge results, avoiding duplicates
      setSuggestions(prev => {
        const merged = [...prev];
        onlineResults.forEach(online => {
          const exists = merged.find(m => 
            Math.abs(m.lat - online.lat) < 0.01 && 
            Math.abs(m.lon - online.lon) < 0.01
          );
          if (!exists) merged.push(online);
        });
        return merged.slice(0, 10);
      });
    }
  };

  async function handleSelectCity(city) {
    // Clear search box and close keyboard
    setSearchText('');
    setSuggestions([]);
    Keyboard.dismiss();

    try {
      setLoading(true);
      setError(null);
      // Ensure we have an API Key (might have just been added in Settings)
      const currentKey = apiKey || await loadApiKey();
      if (!currentKey) {
        setError('missingApiKey');
        return;
      }

      const data = await fetchWeather(city.lat, city.lon, currentKey);
      setWeather({ ...data, selectedCity: city });
      // Save the selected city for next app launch
      await saveLastCity(city);
      // Update theme based on temperature and weather
      const weatherDesc = data.list[0]?.weather[0]?.main || '';
      const temp = data.list[0]?.main?.temp || 15;
      const newTheme = getWeatherTheme(temp, weatherDesc);
      setTheme(newTheme);
      setError(null);
    } catch (err) {
      console.error('Error in handleSelectCity:', err);
      setError('fetchError');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* SEARCH BAR */}
      <View style={styles.searchBar}>
        <TextInput
          placeholder={t('searchPlaceholder')}
          value={searchText}
          onChangeText={handleSearchChange}
          style={styles.searchInput}
          placeholderTextColor="#999"
          selectionColor="#333"
          multiline={false}
          editable={true}
          allowFontScaling={true}
          keyboardType="default"
          contextMenuHidden={false}
          importantForAutofill="yes"
        />

        <TouchableOpacity onPress={() => navigation.navigate('Map')}>
          <Image
            source={require('../../assets/find.png')}
            style={styles.searchIcon}
          />
        </TouchableOpacity>
      </View>
      {/* AUTOCOMPLETE */}
      {suggestions.length > 0 && (
        <View style={styles.suggestionsBox}>
          {suggestions.map((city, i) => (
            <TouchableOpacity
              key={i}
              style={styles.suggestionItem}
              onPress={() => handleSelectCity(city)}
            >
              <Text style={styles.suggestionText}>
                {language === 'gr' ? city.gr : city.en}
                {city.state ? ` (${city.state})` : ''}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {/* WEATHER */}
      {loading && (
        <View style={styles.centerContainer}>
          <Text style={styles.status}>Loading...</Text>
        </View>
      )}

      {error === 'missingApiKey' && (
        <View style={styles.centerContainer}>
          <FontAwesome name="key" size={64} color={colors.primary} />
          <Text style={styles.errorText}>{t('missingApiKey')}</Text>
          <Text style={styles.errorSubText}>{t('missingApiKeyMsg')}</Text>
          <TouchableOpacity
            style={[styles.saveBtn, { marginTop: 20 }]}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={styles.saveText}>{t('settings')}</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && !error && weather?.city && (
        <>
          <View style={styles.header}>
            <View style={styles.mainInfo}>
              <Text style={styles.city} numberOfLines={1} ellipsizeMode="tail">
                {language === 'gr'
                  ? weather.selectedCity?.gr || weather.city.name
                  : weather.selectedCity?.en || weather.city.name}
              </Text>

              <Text style={[styles.temp, { color: theme.primary }]}>
                {Math.round(weather.list[0].main.temp)}°
              </Text>

              <Text style={styles.status}>
                {t(weather.list[0].weather[0].description.toLowerCase())}
              </Text>
            </View>

            <View style={styles.iconContainer}>
              <FontAwesome
                name={getWeatherIcon(weather.list[0].weather[0].icon)}
                size={70}
                color={theme.primary}
              />
            </View>
          </View>
          <View style={styles.divider} />
          {/* FORECAST LIST - Show all available days */}
          <ScrollView showsVerticalScrollIndicator={false}>
            {getWeatherByDay(weather.list).map((dayData, i) => {
              return (
                <TouchableOpacity
                  key={i}
                  style={styles.card}
                  onPress={() =>
                    navigation.navigate('DayDetails', {
                      day: dayData.day,
                      items: dayData.items,
                      cityName:
                        language === 'gr'
                          ? weather.selectedCity?.gr || weather.city.name
                          : weather.selectedCity?.en || weather.city.name,
                    })
                  }
                >
                  <Text style={styles.day}>{dayData.day}</Text>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    <Image
                      source={{
                        uri: `https://openweathermap.org/img/wn/${dayData.icon}@2x.png`,
                      }}
                      style={{ width: 40, height: 40 }}
                    />
                    <Text style={[styles.tempSmall, { color: theme.accent }]}>
                      {dayData.temp}°
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </>
      )}

      {/* SETTINGS BUTTON */}
      <TouchableOpacity
        style={[styles.settingsButton, { backgroundColor: theme.primary }]}
        onPress={() => navigation.navigate('Settings')}
      >
        <FontAwesome name="cog" size={26} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: colors.grayLight,
  },

  // SEARCH BAR
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.light,
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.textDark,
    paddingVertical: spacing.sm,
    borderWidth: 0,
    fontFamily: 'System',
  },

  searchIcon: {
    width: 24,
    height: 24,
    marginLeft: spacing.md,
    tintColor: colors.primary,
  },

  // AUTOCOMPLETE
  suggestionsBox: {
    position: 'absolute',
    top: 100, // Roughly below search bar
    left: 24,
    right: 24,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.sm,
    zIndex: 1000,
    ...shadows.heavy,
  },

  suggestionItem: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },

  suggestionText: {
    fontSize: 16,
    color: colors.textDark,
  },

  // HEADER
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    minHeight: 140,
  },

  mainInfo: {
    flex: 1,
    marginRight: spacing.md,
  },

  iconContainer: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },

  city: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
  },

  temp: {
    fontSize: 64,
    fontWeight: '700',
    marginTop: -10,
    color: colors.primary,
  },

  status: {
    fontSize: 18,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },

  divider: {
    height: 1,
    backgroundColor: colors.grayMedium,
    marginVertical: spacing.lg,
  },

  // FORECAST CARD
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shadows.light,
  },

  day: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textDark,
  },

  tempSmall: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.warmOrange,
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  errorText: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textDark,
    marginTop: 16,
  },

  errorSubText: {
    fontSize: 16,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
  },

  saveBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.medium,
  },

  saveText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },

  // SETTINGS BUTTON
  settingsButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: borderRadius.full,
    ...shadows.heavy,
  },
});

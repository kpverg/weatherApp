// src/screens/WeatherScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

import { searchCities, searchCitiesGR } from '../services/cityService';
import { fetchWeather } from '../services/apiService';
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

export default function WeatherScreen() {
  const navigation = useNavigation();
  const { language, t } = useLanguage();

  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [weather, setWeather] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [theme, setTheme] = useState({
    primary: colors.primary,
    accent: colors.primary,
    background: colors.grayLight,
  });

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

      const data = await fetchWeather(cityToLoad.lat, cityToLoad.lon, k);
      setWeather(data);
      // Show the city name in the current language
      const displayName = language === 'gr' ? cityToLoad.gr : cityToLoad.en;
      setSearchText(displayName);
      // Update theme based on temperature and weather
      const weatherDesc = data.list[0]?.weather[0]?.main || '';
      const temp = data.list[0]?.main?.temp || 15;
      const newTheme = getWeatherTheme(temp, weatherDesc);
      setTheme(newTheme);
    }
    load();
  }, [language]);

  const handleSearchChange = text => {
    setSearchText(text);
    // Use Greek search if language is Greek, otherwise use English
    const results =
      language === 'gr' ? searchCitiesGR(text) : searchCities(text);
    setSuggestions(results);
  };

  async function handleSelectCity(city) {
    // Show the city name in the current language
    const displayName = language === 'gr' ? city.gr : city.en;
    setSearchText(displayName);
    setSuggestions([]);

    const data = await fetchWeather(city.lat, city.lon, apiKey);
    setWeather(data);
    // Save the selected city for next app launch
    await saveLastCity(city);
    // Update theme based on temperature and weather
    const weatherDesc = data.list[0]?.weather[0]?.main || '';
    const temp = data.list[0]?.main?.temp || 15;
    const newTheme = getWeatherTheme(temp, weatherDesc);
    setTheme(newTheme);
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

        <Image
          source={require('../../assets/find.png')}
          style={styles.searchIcon}
        />
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
                {city.en} ({city.gr})
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {/* WEATHER */}
      {weather?.city && (
        <>
          <View style={styles.header}>
            <View>
              <Text style={styles.city}>{weather.city.name}</Text>

              <Text style={[styles.temp, { color: theme.primary }]}>
                {Math.round(weather.list[0].main.temp)}°
              </Text>

              <Text style={styles.status}>
                {t(weather.list[0].weather[0].description.toLowerCase())}
              </Text>
            </View>

            <FontAwesome name="sun-o" size={58} color={theme.primary} />
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
                      cityName: weather.city.name,
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
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.sm,
    marginBottom: spacing.lg,
    ...shadows.medium,
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

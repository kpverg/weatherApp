// src/screens/DayDetailsScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../context/LanguageContext';
import { colors, shadows, borderRadius, spacing } from '../styles/theme';

const getHour = dateString => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function DayDetailsScreen({ route }) {
  const navigation = useNavigation();
  const { day, items, cityName } = route.params;

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>{day}</Text>
        <Text style={styles.city}>{cityName}</Text>
      </View>

      {/* HOURLY FORECAST */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {items.map((item, i) => {
          const hour = getHour(item.dt_txt);
          const temp = Math.round(item.main.temp);
          const feelsLike = Math.round(item.main.feels_like);
          const humidity = item.main.humidity;
          const icon = item.weather[0].icon;
          const description = item.weather[0].description;

          return (
            <View key={i} style={styles.timeCard}>
              <View style={styles.timeHeader}>
                <Text style={styles.time}>{hour}</Text>
                <Text style={styles.description}>{description}</Text>
              </View>

              <View style={styles.tempRow}>
                <Image
                  source={{
                    uri: `https://openweathermap.org/img/wn/${icon}@2x.png`,
                  }}
                  style={styles.icon}
                />
                <View style={styles.tempDetails}>
                  <Text style={styles.tempMain}>{temp}°</Text>
                  <Text style={styles.feelsLike}>Feels like: {feelsLike}°</Text>
                </View>
                <View style={styles.humidity}>
                  <Text style={styles.humidityLabel}>Humidity</Text>
                  <Text style={styles.humidityValue}>{humidity}%</Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
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
    marginBottom: spacing.xl,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    marginTop: spacing.md,
  },

  city: {
    fontSize: 16,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },

  timeCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.light,
  },

  timeHeader: {
    marginBottom: spacing.md,
  },

  time: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },

  description: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: spacing.sm,
    textTransform: 'capitalize',
  },

  tempRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  icon: {
    width: 50,
    height: 50,
  },

  tempDetails: {
    flex: 1,
    marginLeft: spacing.md,
  },

  tempMain: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.warmOrange,
  },

  feelsLike: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },

  humidity: {
    alignItems: 'center',
  },

  humidityLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },

  humidityValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginTop: spacing.sm,
  },
});

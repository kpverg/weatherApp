// src/screens/MapScreen.js
import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../context/LanguageContext';
import { loadApiKey } from '../services/storageService';
import { reverseGeocode } from '../services/apiService';
import { colors, borderRadius, spacing } from '../styles/theme';

// Leaflet HTML content
const MAP_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    body { padding: 0; margin: 0; }
    #map { height: 100vh; width: 100vw; }
    .leaflet-control-attribution { display: none; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map', {
      zoomControl: false
    }).setView([39.0742, 21.8243], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    var marker;

    map.on('click', function(e) {
      if (marker) {
        map.removeLayer(marker);
      }
      marker = L.marker(e.latlng, { draggable: true }).addTo(map);
      
      const sendCoords = () => {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          latitude: marker.getLatLng().lat,
          longitude: marker.getLatLng().lng
        }));
      };

      sendCoords();

      marker.on('dragend', function() {
        sendCoords();
      });
    });
  </script>
</body>
</html>
`;

export default function MapScreen() {
  const navigation = useNavigation();
  const { t, language } = useLanguage();
  
  const [marker, setMarker] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cityName, setCityName] = useState('');
  
  const webViewRef = useRef(null);

  const handleMessage = async (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.latitude && data.longitude) {
        setMarker({
          latitude: data.latitude,
          longitude: data.longitude
        });
        
        // Fetch city name preview
        const apiKey = await loadApiKey();
        if (apiKey) {
          const locationData = await reverseGeocode(data.latitude, data.longitude, apiKey);
          if (locationData) {
            const name = language === 'gr' 
              ? locationData.cleanNameGr || locationData.local_names?.el || locationData.name
              : locationData.name;
            setCityName(name);
          } else {
            setCityName(t('selectedLocation'));
          }
        }
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  const handleConfirm = useCallback(async () => {
    if (!marker) return;

    setLoading(true);
    try {
      const apiKey = await loadApiKey();
      if (!apiKey) {
        navigation.navigate('Settings');
        return;
      }

      // Reverse geocode to get the city name
      const locationData = await reverseGeocode(marker.latitude, marker.longitude, apiKey);

      // Create a city object compatible with WeatherScreen
      const cityNameEn = locationData?.name || 'Selected Location';
      const cityNameGr = locationData?.cleanNameGr || locationData?.local_names?.el || locationData?.name || 'Επιλεγμένη Τοποθεσία';

      // Navigate back to WeatherScreen with the selected city
      navigation.navigate('Weather', { 
        selectedCity: {
          en: cityNameEn,
          gr: cityNameGr,
          lat: marker.latitude,
          lon: marker.longitude,
        } 
      });
    } catch (error) {
      console.error('Error fetching location data:', error);
      // Even on error, navigate with coordinates
      const selectedCity = {
        en: 'Selected Location',
        gr: 'Επιλεγμένη Τοποθεσία',
        lat: marker.latitude,
        lon: marker.longitude,
      };
      navigation.navigate('Weather', { selectedCity });
    } finally {
      setLoading(false);
    }
  }, [marker, navigation]);

  return (
    <View style={styles.container}>
      {/* Map (OSM via WebView) */}
      <View style={StyleSheet.absoluteFillObject}>
        <WebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html: MAP_HTML }}
          onMessage={handleMessage}
          style={styles.map}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          )}
        />
      </View>

      {/* Overlays */}
      <View style={styles.overlay} pointerEvents="box-none">
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{t('selectLocation')}</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.invisibleFlex} pointerEvents="none" />

        {/* Selected Location Preview & Confirm Button */}
        {marker && (
          <View style={styles.bottomOverlay}>
            <View style={styles.locationPreview}>
              <Text style={styles.previewTitle}>{t('selectedLocation')}:</Text>
              <Text style={styles.previewName}>{cityName || t('loading')}</Text>
            </View>

            <TouchableOpacity
              style={[styles.confirmButton, loading && styles.buttonDisabled]}
              onPress={handleConfirm}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.confirmText}>{t('confirm')}</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl + spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: colors.grayMedium,
  },
  backButton: {
    padding: spacing.sm,
  },
  backText: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textDark,
  },
  placeholder: {
    width: 40,
  },
  invisibleFlex: {
    flex: 1,
  },
  bottomOverlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl + spacing.lg,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  locationPreview: {
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  previewTitle: {
    fontSize: 12,
    color: colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  previewName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
  },
  confirmButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md + spacing.sm,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
    backgroundColor: colors.grayMedium,
  },
  confirmText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    marginBottom: 12,
    textAlign: 'center',
  },
  errorRetryText: {
    color: colors.primary,
    fontWeight: '600',
  },
});

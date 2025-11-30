export const colors = {
  // Primary Blues
  primary: '#0E7C86', // Deep teal
  primaryLight: '#1FA4B0', // Lighter teal
  sky: '#87CEEB', // Sky blue

  // Secondary - Grays & Cool tones
  grayLight: '#F0F4F8', // Very light gray
  grayMedium: '#B8C5D6', // Medium gray-blue
  grayDark: '#4A5568', // Dark gray

  // Accents - Warm tones
  warmOrange: '#FF9F43', // Warm orange for sunny/high temp
  warmYellow: '#FFD93D', // Warm yellow for sunshine

  // Functional
  white: '#FFFFFF',
  black: '#1A1A1A',
  textDark: '#2D3748',
  textMuted: '#718096',

  // Weather-specific
  rainy: '#4A90E2',
  sunny: '#FFD93D',
  cloudy: '#BCC3CC',
  hot: '#FF6B6B',
  cold: '#4ECDC4',
};

// Function to get dynamic theme based on temperature and weather
export const getWeatherTheme = (tempCelsius, weatherDescription = '') => {
  const temp = Math.round(tempCelsius);
  let themeColor = colors.primary;
  let backgroundColor = colors.grayLight;
  let accentColor = colors.primary;

  // Check weather conditions first
  const description = (weatherDescription || '').toLowerCase();
  if (description.includes('cloud') || description.includes('overcast')) {
    // Cloudy - Light Gray
    themeColor = '#7A8FA3';
    accentColor = '#7A8FA3';
    backgroundColor = '#E8ECEF';
  } else if (description.includes('rain') || description.includes('drizzle')) {
    // Rainy - Light Gray
    themeColor = '#5B7A95';
    accentColor = '#5B7A95';
    backgroundColor = '#DFE5EB';
  } else if (temp < 10) {
    // Cold - Pale Blue/Cyan
    themeColor = '#4ECDC4';
    accentColor = '#4ECDC4';
    backgroundColor = '#E0F7F6';
  } else if (temp <= 20) {
    // Mild - Light Yellow
    themeColor = '#FFD93D';
    accentColor = '#FFD93D';
    backgroundColor = '#FFFBEA';
  } else {
    // Hot - Warm Orange
    themeColor = '#FF9F43';
    accentColor = '#FF9F43';
    backgroundColor = '#FFE8D0';
  }

  return {
    primary: themeColor,
    accent: accentColor,
    background: backgroundColor,
  };
};
export const gradients = {
  // Sky gradient for headers
  skyGradient: ['#1FA4B0', '#0E7C86'],

  // Sunrise gradient
  sunriseGradient: ['#FF9F43', '#FFD93D'],

  // Background gradient
  backgroundGradient: ['#F0F4F8', '#E2EAEF'],
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 40,
};

export const shadows = {
  light: {
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  heavy: {
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 6,
  },
};

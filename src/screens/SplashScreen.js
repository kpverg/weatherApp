import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { colors } from '../styles/theme';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    // Show splash screen for 2 seconds, then navigate to Weather screen
    const timer = setTimeout(() => {
      navigation.replace('Weather');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/splash.png')}
        style={styles.splash}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  splash: {
    width: '100%',
    height: '100%',
  },
});

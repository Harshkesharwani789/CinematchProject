import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SplashScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1800,
        useNativeDriver: true,
      }),
    );

    spin.start();
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    return () => spin.stop();
  }, [fadeAnim, scaleAnim, spinAnim]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.logo}>CineMatch</Text>
        <Text style={styles.tagline}>Find your next favorite movie</Text>
      </Animated.View>
      <Animated.View style={[styles.loaderIcon, { transform: [{ rotate: spin }] }]}>
        <Ionicons name="film-outline" size={26} color="#e50914" />
      </Animated.View>
      <View style={styles.loadingRow}>
        <ActivityIndicator size="small" color="#e50914" />
        <Text style={styles.loadingText}>Getting your cinema ready</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#e50914',
    marginBottom: 10,
    letterSpacing: 2,
    textShadowColor: 'rgba(229, 9, 20, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  tagline: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
    letterSpacing: 1,
  },
  loaderIcon: {
    marginTop: 42,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(229, 9, 20, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },
  loadingText: {
    color: '#9a9a9a',
    fontSize: 13,
    marginLeft: 9,
  },
});

export default SplashScreen;

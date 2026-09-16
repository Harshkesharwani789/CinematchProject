import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SetupScreen = ({ message }) => (
  <View style={styles.container}>
    <View style={styles.iconWrap}>
      <Ionicons name="cloud-offline-outline" size={34} color="#e50914" />
    </View>
    <Text style={styles.title}>One quick setup step</Text>
    <Text style={styles.body}>{message}</Text>
    <Text style={styles.hint}>Copy .env.example to .env, add the Supabase URL and publishable key, then restart Expo.</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  iconWrap: {
    backgroundColor: 'rgba(229, 9, 20, 0.12)',
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    color: '#fff',
    fontSize: 25,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  body: {
    color: '#b6b6b6',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  hint: {
    color: '#777',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 22,
    textAlign: 'center',
  },
});

export default SetupScreen;

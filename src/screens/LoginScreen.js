import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email');
      return;
    }
    
    setLoading(true);
    try {
      await login(email, password);
    } catch (e) {
      Alert.alert('Unable to sign in', e.message || 'Please check your email and password, then try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <Text style={[styles.title, { color: theme.colors.text }]}>Welcome Back</Text>
        <Text style={[styles.subtitle, { color: theme.colors.subText }]}>Sign in to continue</Text>
        
        <TextInput
          style={[styles.input, { backgroundColor: theme.colors.inputBackground, color: theme.colors.text }]}
          placeholder="Email"
          placeholderTextColor={theme.colors.subText}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        
        <TextInput
          style={[styles.input, { backgroundColor: theme.colors.inputBackground, color: theme.colors.text }]}
          placeholder="Password"
          placeholderTextColor={theme.colors.subText}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: theme.colors.primary }]} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={[styles.linkText, { color: theme.colors.subText }]}>Don't have an account? <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>Sign up</Text></Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    textAlign: 'center',
    fontSize: 14,
  },
});

export default LoginScreen;

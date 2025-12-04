import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Switch } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const { theme, isDark, toggleTheme } = useContext(ThemeContext);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Profile</Text>
      </View>

      <View style={styles.userInfo}>
        <View style={[styles.avatar, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.avatarText, { color: theme.colors.text }]}>{user?.name?.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={[styles.name, { color: theme.colors.text }]}>{user?.name}</Text>
        <Text style={[styles.email, { color: theme.colors.subText }]}>{user?.email}</Text>
      </View>

      <View style={styles.menu}>
        <View style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}>
          <Ionicons name={isDark ? "moon" : "sunny"} size={24} color={theme.colors.text} />
          <Text style={[styles.menuText, { color: theme.colors.text }]}>Dark Mode</Text>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: '#767577', true: theme.colors.primary }}
            thumbColor={'#f4f3f4'}
          />
        </View>

        <TouchableOpacity style={[styles.menuItem, { borderBottomColor: theme.colors.border }]} onPress={() => navigation.navigate('EditProfile')}>
          <Ionicons name="person-outline" size={24} color={theme.colors.text} />
          <Text style={[styles.menuText, { color: theme.colors.text }]}>Edit Profile</Text>
          <Ionicons name="chevron-forward" size={24} color={theme.colors.subText} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, { borderBottomColor: theme.colors.border }]} onPress={() => navigation.navigate('ChangePassword')}>
          <Ionicons name="lock-closed-outline" size={24} color={theme.colors.text} />
          <Text style={[styles.menuText, { color: theme.colors.text }]}>Change Password</Text>
          <Ionicons name="chevron-forward" size={24} color={theme.colors.subText} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color={theme.colors.primary} />
          <Text style={[styles.menuText, styles.logoutText, { color: theme.colors.primary }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  userInfo: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
  },
  menu: {
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 16,
  },
  logoutItem: {
    marginTop: 20,
    borderBottomWidth: 0,
  },
  logoutText: {
    fontWeight: 'bold',
  },
});

export default ProfileScreen;

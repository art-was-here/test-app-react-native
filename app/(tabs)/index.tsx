import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Switch,
  useColorScheme,
  SafeAreaView,
  Animated,
} from 'react-native';

export default function App() {
  const deviceTheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(deviceTheme === 'dark');
  const fadeAnim = useRef(new Animated.Value(1)).current; // Initial opacity: 1

  const theme = {
    backgroundColor: isDarkMode ? '#121212' : '#FFFFFF',
    textColor: isDarkMode ? '#FFFFFF' : '#000000',
    secondaryBackgroundColor: isDarkMode ? '#333333' : '#F2F2F2',
  };

  const toggleTheme = () => {
    // Start fade-out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      // Update theme after fade-out
      setIsDarkMode(!isDarkMode);
    });
  };

  // Trigger fade-in when isDarkMode changes
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [isDarkMode]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.profileContainer}>
        <View style={styles.imageContainer}>
          <View style={[styles.profileImageFallback, { backgroundColor: theme.secondaryBackgroundColor }]}>
            <Text style={{ fontSize: 60, color: theme.textColor }}>👤</Text>
          </View>
          <Image
            source={require('@/assets/images/profile-modified.png')} // Relative path
            style={styles.profileImage}
          />
        </View>
        <Text style={[styles.portfolioText, { color: theme.textColor }]}>
          art's portfolio
        </Text>
        <Animated.View style={[styles.themeToggle, { opacity: fadeAnim }]}>
          <Text style={styles.themeEmoji}>{isDarkMode ? '🌓' : '☀️'}</Text>
          <Text style={[styles.themeText, { color: theme.textColor }]}>
            {isDarkMode ? 'Dark Mode' : 'Light Mode'}
          </Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileContainer: {
    alignItems: 'center',
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 100,
    overflow: 'hidden',
    marginBottom: 20,
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  profileImageFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  portfolioText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeText: {
    marginHorizontal: 10,
  },
  themeEmoji: {
    fontSize: 24,
  },
});
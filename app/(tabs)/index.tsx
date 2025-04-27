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
      </View>
      <View style={styles.homeContainer}>
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
    flexDirection: 'column',
    alignItems: 'center',
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: 'center',
    marginTop: 40,
  },
  homeContainer: {
    flexDirection: "row",
  },
  imageContainer: {
    width: 75,
    height: 75,
    borderRadius: 100,
    overflow: 'hidden',
    marginBottom: 20,
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  profileImageFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  portfolioText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginLeft: 15,
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
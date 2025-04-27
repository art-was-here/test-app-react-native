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
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const theme = {
    backgroundColor: isDarkMode ? '#121212' : '#FFFFFF',
    textColor: isDarkMode ? '#FFFFFF' : '#000000',
    secondaryBackgroundColor: isDarkMode ? '#333333' : '#F2F2F2',
  };

  const toggleBackground = () => {
    setIsDarkMode(!isDarkMode);
    Animated.timing(fadeAnim, {
      toValue: isDarkMode ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      {/* Light mode background */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: '#FFFFFF', opacity: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0], // Light visible when fadeAnim is 0
          }) },
        ]}
      />
      {/* Dark mode background */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: '#121212', opacity: fadeAnim },
        ]}
      />
      <View style={styles.profileContainer}>
        <View style={styles.imageContainer}>
          <View style={[styles.profileImageFallback, { backgroundColor: theme.secondaryBackgroundColor }]}>
            <Text style={{ fontSize: 60, color: theme.textColor }}>👤</Text>
          </View>
          <Image
            source={require('@/assets/images/profile-modified.png')}
            style={styles.profileImage}
          />
        </View>
        <Text style={[styles.portfolioText, { color: theme.textColor }]}>
          art's portfolio
        </Text>
      </View>
      <View style={styles.homeContainer}>
        <View style={styles.themeToggle}>
          <Text style={styles.themeEmoji}>{isDarkMode ? '🌓' : '☀️'}</Text>
          <Text style={[styles.themeText, { color: theme.textColor }]}>
            {isDarkMode ? 'Dark Mode' : 'Light Mode'}
          </Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleBackground}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>
      </View>
    </View>
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
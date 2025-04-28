import { IconSymbol } from '@/components/ui/IconSymbol';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  useColorScheme,
  SafeAreaView,
  Animated,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';

// Define the type for a single todo item
interface Todo {
  id: string;
  text: string;
}

export default function App() {
  const deviceTheme = useColorScheme();
  const isDarkMode = deviceTheme === 'dark';
  const fadeAnim = useRef(new Animated.Value(isDarkMode ? 1 : 0)).current;

  // Explicitly type the todos state as an array of Todo objects
  const [todos, setTodos] = useState<Todo[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [newTodo, setNewTodo] = useState('');

  const theme = {
    backgroundColor: isDarkMode ? '#121212' : '#FFFFFF',
    textColor: isDarkMode ? '#FFFFFF' : '#000000',
    secondaryBackgroundColor: isDarkMode ? '#333333' : '#F2F2F2',
    fabBackground: isDarkMode ? '#BB86FC' : '#6200EE',
    inputBackground: isDarkMode ? '#333333' : '#F2F2F2',
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: isDarkMode ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Dismiss keyboard when tapping outside
    const keyboardDidHide = Keyboard.addListener('keyboardDidHide', () => {
      setShowInput(false);
    });

    return () => {
      keyboardDidHide.remove();
    };
  }, [deviceTheme, fadeAnim]);

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now().toString(), text: newTodo }]);
      setNewTodo('');
      setShowInput(false);
      Keyboard.dismiss();
    }
  };

  const renderTodoItem = ({ item }: { item: Todo }) => (
    <View style={[styles.todoItem, { backgroundColor: theme.inputBackground }]}>
      <Text style={[styles.todoText, { color: theme.textColor }]}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 80}
    >
      <SafeAreaView style={styles.container}>
        {/* Light mode background */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: '#FFFFFF',
              opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0],
              }),
            },
          ]}
        />
        {/* Dark mode background */}
        <Animated.View
          style={[StyleSheet.absoluteFill, { backgroundColor: '#121212', opacity: fadeAnim }]}
        />
        <View style={{ flex: 1, width: '100%' }}>
          <View style={styles.profileContainer}>
            <View style={styles.imageContainer}>
              <View
                style={[styles.profileImageFallback, { backgroundColor: theme.secondaryBackgroundColor }]}
              >
                <Text style={{ fontSize: 60, color: theme.textColor }}>👤</Text>
              </View>
              <Image
                source={require('@/assets/images/profile-modified.png')}
                style={styles.profileImage}
              />
            </View>
            <Text style={[styles.portfolioText, { color: theme.textColor }]}>TODO:</Text>
          </View>
          <View style={styles.homeContainer}>
            <FlatList
              data={todos}
              renderItem={renderTodoItem}
              keyExtractor={(item) => item.id}
              style={styles.todoList}
              ListEmptyComponent={
                <Text style={[styles.emptyText, { color: theme.textColor }]}>
                  No tasks yet
                </Text>
              }
            />
            {showInput && (
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.textColor }]}
                  value={newTodo}
                  onChangeText={setNewTodo}
                  placeholder="Add a new task"
                  placeholderTextColor={isDarkMode ? '#888' : '#666'}
                  autoFocus
                  onSubmitEditing={addTodo}
                />
                <TouchableOpacity
                  style={[styles.addButton, { backgroundColor: theme.fabBackground }]}
                  onPress={addTodo}
                >
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          <TouchableOpacity
            style={[styles.fab, { backgroundColor: theme.fabBackground }]}
            onPress={() => setShowInput(!showInput)}
          >
            <Text style={styles.fabText}>{showInput ? '×' : '+'}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  profileContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 40,
  },
  homeContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 80,
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
  todoList: {
    flex: 1,
    width: '100%',
  },
  todoItem: {
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
  },
  todoText: {
    fontSize: 16,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  fabText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  addButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  useColorScheme,
  SafeAreaView,
  Animated,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  FlatList,
} from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';

// Define the type for a single todo item
interface Todo {
  id: string;
  text: string;
}

export default function App() {
  const deviceTheme = useColorScheme();
  const isDarkMode = deviceTheme === 'dark';
  const fadeAnim = useRef(new Animated.Value(isDarkMode ? 1 : 0)).current;

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

  const dismissKeyboard = () => {
    Keyboard.dismiss();
    setShowInput(false);
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((item) => item.id !== id));
  };

  const renderRightActions = (id: string) => (
    <TouchableOpacity
      style={[styles.swipeAction, { backgroundColor: '#FF3B30' }]}
      onPress={() => deleteTodo(id)}
    >
      <Text style={styles.swipeActionText}>Delete</Text>
    </TouchableOpacity>
  );

  const renderLeftActions = (id: string) => (
    <TouchableOpacity
      style={[styles.swipeAction, { backgroundColor: '#FF3B30' }]}
      onPress={() => deleteTodo(id)}
    >
      <Text style={styles.swipeActionText}>Delete</Text>
    </TouchableOpacity>
  );

  const renderTodoItem = ({ item }: { item: Todo }) => (
    <Swipeable
      renderRightActions={() => renderRightActions(item.id)}
      renderLeftActions={() => renderLeftActions(item.id)}
    >
      <View style={[styles.todoItem, { backgroundColor: theme.inputBackground }]}>
        <Text style={[styles.todoText, { color: theme.textColor }]}>{item.text}</Text>
        <TouchableOpacity style={styles.dragHandle}>
          <Text style={[styles.dragHandleText, { color: theme.textColor }]}>☰</Text>
        </TouchableOpacity>
      </View>
    </Swipeable>
  );

  return (
    <GestureHandlerRootView style={[styles.root, { backgroundColor: theme.backgroundColor }]}>
      <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingContainer}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 120}
        >
          <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View style={styles.innerContainer}>
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
                <Text style={[styles.portfolioText, { color: theme.textColor }]}>TODO: </Text>
              </View>
              <View style={styles.homeContainer}>
                <FlatList
                  data={todos}
                  renderItem={renderTodoItem}
                  keyExtractor={(item) => item.id}
                  style={styles.todoList}
                  contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
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
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: theme.fabBackground }]}
          onPress={() => setShowInput(!showInput)}
        >
          <Text style={styles.fabText}>{showInput ? '×' : '+'}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    width: '100%',
  },
  keyboardAvoidingContainer: {
    flex: 1,
    width: '100%',
  },
  innerContainer: {
    flex: 1,
    width: '100%',
  },
  profileContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 40,
    width: '100%',
  },
  homeContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
  },
  todoText: {
    fontSize: 16,
    flex: 1,
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
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 0, // Position at bottom of homeContainer
    left: 0,
    right: 0,
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
  dragHandle: {
    padding: 10,
  },
  dragHandleText: {
    fontSize: 20,
  },
  swipeAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: '100%',
  },
  swipeActionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
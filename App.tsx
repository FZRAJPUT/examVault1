import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, View, Text, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from './types/navigation';

// Screens
import Login from './screens/loginScreen/Login';
import Register from './screens/registerScreen/Register';
import Verification from './screens/verificationScreen/Verification';
import Main from './screens/Main';
import Profile from './screens/profileScreen/Profile';

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    // Simulate loading progress
    timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 10; // Increase by 10%
      });
    }, 150); // every 150ms

    const checkLogin = async () => {
      try {
        let storedEmail:any = await AsyncStorage.getItem('userInfo');
        storedEmail = JSON.parse(storedEmail);
        setIsLoggedIn(!!storedEmail);
      } catch (error:any) {
        Alert.alert('Error checking login status:', error);
      }
    };

    checkLogin();
  }, []);

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => {
        setLoading(false);
      }, 300); // small delay after reaching 100%
    }
  }, [progress]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>{progress}%</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="default" />
      <Stack.Navigator initialRouteName={isLoggedIn ? 'Main' : 'Login'}>
        <Stack.Screen
          name="Main"
          component={Main}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Verification"
          component={Verification}
          options={{ headerShown: false }}
        />
        
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ title: "My Profile" }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007bff',
  },
  loadingText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default App;

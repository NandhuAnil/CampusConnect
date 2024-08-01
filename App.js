import React, { useEffect, useState, useCallback } from "react";
import { View, Alert } from "react-native";
import * as SplashScreen from 'expo-splash-screen';

import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from './screens/Login';
import Signup from './screens/Signup';
import Welcome from './screens/Welcome';
import Home from './screens/Home';

import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';

import COLORS from './constants/colors';
import SkeletonLoader from "./components/SkeletonLoader";

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();


export default function App() {

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState();
  const [expoPushToken, setExpoPushToken] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      setUserId(user?.uid);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      setExpoPushToken(token);
      if (userId) {
        saveTokenToDatabase(token, userId);
      }
    });
  }, [userId]);

  function onAuthStateChanged(user) {
    setUser(user);
    setLoading(true);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; 
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    messaging().onNotificationOpenedApp(async (remoteMessage) => {
      console.log('Notification caused app to open from background state:', JSON.stringify(remoteMessage));
    });

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
        console.log('Message handled in the background!', remoteMessage);
    });

    messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        if (remoteMessage) {
          console.log('Notification caused app to open from quit state:', JSON.stringify(remoteMessage));
        }
      });

  }, []);

  const saveTokenToDatabase = async (token, userId) => {
    if (userId) {
      const userRef = firestore().collection('users').doc(userId);
      try {
        await userRef.set(
          {
            expoPushToken: token,
          },
          { merge: true }
        );
        // console.log(`Token successfully saved for user ${userId}`);
      } catch (error) {
        console.error(`Failed to save token for user ${userId}:`, error);
      }
    } else {
      console.error('No userId provided. Token not saved.');
    }
  };
  
  async function registerForPushNotificationsAsync() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      const token = await messaging().getToken();
      // console.log('Expo push token:', token);
      return token;
    } else {
      alert('Failed to get push token for push notification!');
      return null;
    }
  }

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setLoading(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (loading) {
      await SplashScreen.hideAsync();
    }
  }, [loading]);

  if (!loading) {
    return (
      <View>
        <SkeletonLoader />
      </View>
    );
  }

  return (
    <PaperProvider>
      <NavigationContainer onLayout={onLayoutRootView}> 
        {user ? (
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={Home}
              options={{
                headerShown: false,
              }}
            />
          </Stack.Navigator>
        ) : (
          <Stack.Navigator
            initialRouteName="Welcome"
            screenOptions={{
              statusBarColor: COLORS.primary,
              headerStyle: {
                backgroundColor: COLORS.primary,
              },
              headerTintColor: "#fff",
              headerTitleAlign: "center",
            }}
          >
            <Stack.Screen
              name="Welcome"
              component={Welcome}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Login"
              component={Login}
              options={{
                headerShown: true,
              }}
            />
            <Stack.Screen
              name="Signup"
              component={Signup}
              options={{
                headerShown: true,
              }}
            />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </PaperProvider>
  );
}

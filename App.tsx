import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import Login from './screens/Login';
import { useAtom } from 'jotai';
import { currentUserAtom, loginAtom } from './store';
import { ActivityIndicator, Image } from 'react-native';
import { userBaseURL } from './env';
import Menu from './screens/Menu';
import Profile from './screens/Profile';

const Stack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const queryClient = new QueryClient();

export default function App() {
  const [loggedIn, isLoggedIn] = useAtom(loginAtom);
  const [loading, isLoading] = useState(false);
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);

  const getCurrentUser = async (token: string) => {
    const res = await fetch(`${userBaseURL}/current`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await res.json();
    return data.data;
  }

  useEffect(() => {
    const getToken = async () => {
      isLoading(true);
      // await SecureStore.deleteItemAsync('token')
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        setCurrentUser(await getCurrentUser(token));
        isLoading(false);
        isLoggedIn(true);
      } else {
        isLoading(false)
        isLoggedIn(false);
      }
    }

    getToken();
  }, []);

  if (loading) {
    return <ActivityIndicator size={70} />
  }
  return (
    <QueryClientProvider client={queryClient}>
      {
        loggedIn ?
          (
            <NavigationContainer>
              <Tab.Navigator screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  switch (route.name) {
                    case 'HomeStack':
                      return <Feather name='home' size={size} color={color} />;
                    case 'Menu':
                      return <Image source={{uri: currentUser?.profilePicture}} width={25} height={25} style={{borderRadius: 1000, borderWidth: focused ? 1 : 0, borderColor: focused ? color : 'white'}} />
                  }

                }
              })}>
                <Tab.Screen name='HomeStack' component={HomeStackScreen} options={{ headerShown: false }} />
                <Tab.Screen name='Menu' component={Menu} options={{headerShown: false}} />
              </Tab.Navigator>
            </NavigationContainer>
          ) :
          (
            <Login />
          )
      }
    </QueryClientProvider>
  );
}

const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name='Home' component={Home} options={{ headerShown: false }} />
      <HomeStack.Screen name='Profile' component={Profile} options={{headerShown: false, animation: 'slide_from_right'}} />
    </HomeStack.Navigator>
  )
}
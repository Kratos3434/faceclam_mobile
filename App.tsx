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
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RespondBottomSheet from './components/RespondBottomSheet';
import Posts from './screens/Posts';
import Photos from './screens/Photos';
import CreateStatus from './screens/CreateStatus';
import AddPost from './screens/AddPost';
import Post from './screens/Post';
import { httpToHTTPS } from './helpers';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { UserProps } from './types';
import Friends from './screens/Friends';
import Saved from './screens/Saved';

const HomeStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const ProfileStack = createNativeStackNavigator();
const Stack = createNativeStackNavigator();
const MenuStack = createNativeStackNavigator();

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
        const val = await fetch(`${userBaseURL}/authenticate`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
          }
        });
        if (val.status === 401) {
          isLoading(false)
          isLoggedIn(false);
        } else {
          if (!currentUser) {
            setCurrentUser(await getCurrentUser(token));
          }
          isLoading(false);
          isLoggedIn(true);
        }
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
      <BottomSheetModalProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          {
            loggedIn ?
              (
                <NavigationContainer>
                  <Stack.Navigator>
                    <Stack.Screen name='HomeTabs' options={{ headerShown: false, animation: 'slide_from_right' }}>
                      {(props) => <HomeTabs {...props} currentUser={currentUser} />}
                    </Stack.Screen>
                    <Stack.Screen name='AddPost' component={AddPost} options={{ headerShown: false, animation: 'slide_from_bottom' }} />
                    <Stack.Screen name='Post' component={Post} options={{ headerShown: false, animation: 'slide_from_right' }} />
                    <Stack.Screen name='CreateStatus' component={CreateStatus} options={{ headerShown: false, animation: 'slide_from_bottom' }} />
                  </Stack.Navigator>
                </NavigationContainer>
              ) :
              (
                <Login />
              )
          }
          {/** This is opened when pressing respond button */}
          <RespondBottomSheet />
        </GestureHandlerRootView>
      </BottomSheetModalProvider>
    </QueryClientProvider>
  );
}

const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name='HomeScreen' component={Home} options={{ headerShown: false }} />
      <HomeStack.Screen name='Profile' component={ProfileStackScreen} options={{ headerShown: false, animation: 'slide_from_right' }} />
    </HomeStack.Navigator>
  )
}


const ProfileStackScreen = () => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name='Posts' component={Posts} options={{ headerShown: false, animation: 'none' }} />
      <ProfileStack.Screen name='Photos' component={Photos} options={{ headerShown: false, animation: 'none' }} />
      <ProfileStack.Screen name='Friends' component={Friends} options={{ headerShown: false, animation: 'slide_from_right' }} />
    </ProfileStack.Navigator>
  )
}

const MenuStackScreen = () => {
  return (
    <MenuStack.Navigator>
      <MenuStack.Screen name='MenuScreen' component={Menu} options={{ headerShown: false, animation: 'none' }} />
      <MenuStack.Screen name='Profile' component={ProfileStackScreen} options={{ headerShown: false, animation: 'slide_from_right' }} />
      <MenuStack.Screen name='Saved' component={Saved} options={{ headerShown: false, animation: 'slide_from_right' }} />
      <MenuStack.Screen name='Post' component={Post} options={{ headerShown: false, animation: 'slide_from_right' }} />
    </MenuStack.Navigator>
  )
}

const HomeTabs = ({ currentUser }: { currentUser: UserProps | null }) => {
  // const [currentUser, setCurrentUser] = useAtom(currentUserAtom);

  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        switch (route.name) {
          case 'Home':
            return <Feather name='home' size={size} color={color} />;
          case 'Menu':
            return <Image source={currentUser?.profilePicture ? { uri: httpToHTTPS(currentUser?.profilePicture) } : require('./assets/placeholder.jpg')} width={30} height={30} style={{ borderRadius: 1000, borderWidth: focused ? 1 : 0, borderColor: focused ? color : 'white' }} />
        }

      }
    })}>
      <Tab.Screen name='Home' component={HomeStackScreen} options={{ headerShown: false }} />
      <Tab.Screen name='Menu' component={MenuStackScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  )
}
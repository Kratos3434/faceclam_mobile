import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const Stack = createNativeStackNavigator();

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name='Home' component={Home} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}
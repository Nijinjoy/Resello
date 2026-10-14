import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BootSplash from 'react-native-bootsplash';
import { bootstrapApp } from '../app/bootstrap';
import { HomeScreen } from '../screens/HomeScreen';
import { SplashScreen } from '../screens/SplashScreen';

export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

bootstrapApp().catch(error => {
  // A failed startup task must not trap users on the splash screen;
  // the screens that depend on it are responsible for recovering.
  console.error('App bootstrap failed', error);
});

// Auto-navigation to Home is disabled: the app stays on the splash screen.
function SplashRoute() {
  return <SplashScreen />;
}

export function RootNavigator() {
  return (
    <NavigationContainer onReady={() => BootSplash.hide({ fade: true })}>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashRoute} />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ animation: 'fade' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

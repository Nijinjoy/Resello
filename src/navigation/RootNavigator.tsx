import { useCallback, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';
import BootSplash from 'react-native-bootsplash';
import { bootstrapApp } from '../app/bootstrap';
import { HomeScreen } from '../screens/HomeScreen';
import { SplashScreen } from '../screens/SplashScreen';
import { WelcomeScreen } from '../screens/WelcomeScreen';

export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const bootstrap = bootstrapApp().catch(error => {
  // A failed startup task must not trap users on the splash screen;
  // the screens that depend on it are responsible for recovering.
  console.error('App bootstrap failed', error);
});

function SplashRoute({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Splash'>) {
  const [introDone, setIntroDone] = useState(false);
  const handleIntroFinish = useCallback(() => setIntroDone(true), []);

  useEffect(() => {
    if (!introDone) {
      return;
    }
    let cancelled = false;
    bootstrap.then(() => {
      if (!cancelled) {
        navigation.replace('Welcome');
      }
    });
    return () => {
      cancelled = true;
    };
  }, [introDone, navigation]);

  return <SplashScreen onFinish={handleIntroFinish} />;
}

function WelcomeRoute({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Welcome'>) {
  // Both actions go to Home until sign-up and sign-in screens exist.
  const goHome = () => navigation.replace('Home');
  return <WelcomeScreen onGetStarted={goHome} onSignIn={goHome} />;
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
          name="Welcome"
          component={WelcomeRoute}
          options={{ animation: 'fade' }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ animation: 'fade' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

import { useCallback, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';
import BootSplash from 'react-native-bootsplash';
import { bootstrapApp } from '../app/bootstrap';
import { DashboardTabs, type DashboardTabParamList } from './DashboardTabs';
import { ChatScreen } from '../screens/ChatScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { HelpScreen } from '../screens/HelpScreen';
import { LegalScreen } from '../screens/LegalScreen';
import { ListingDetailsScreen } from '../screens/ListingDetailsScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { MyListingsScreen } from '../screens/MyListingsScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { OtpScreen } from '../screens/OtpScreen';
import { PlaceholderScreen } from '../screens/PlaceholderScreen';
import { PurchasesScreen } from '../screens/PurchasesScreen';
import { SoldScreen } from '../screens/SoldScreen';
import { SplashScreen } from '../screens/SplashScreen';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { CartProvider } from '../state/cart';
import { FavoritesProvider } from '../state/favorites';
import { NotificationsProvider } from '../state/notifications';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Login: undefined;
  Otp: { phoneNumber: string };
  // `screen` switches the tab when navigating back to an open Dashboard.
  Dashboard: { phoneNumber?: string; screen?: keyof DashboardTabParamList };
  Notifications: undefined;
  MyListings: undefined;
  Favorites: undefined;
  Purchases: undefined;
  Sold: undefined;
  Legal: undefined;
  Help: undefined;
  ListingDetails: { listingId: string };
  // Conversation with the seller of a listing.
  Chat: { listingId: string; sellerName: string };
  ComingSoon: { title: string };
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
  // Both actions open Login until a separate sign-up screen exists.
  const goToLogin = () => navigation.navigate('Login');
  return <WelcomeScreen onGetStarted={goToLogin} onSignIn={goToLogin} />;
}

function LoginRoute({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Login'>) {
  return (
    <LoginScreen
      onContinue={phoneNumber => navigation.navigate('Otp', { phoneNumber })}
    />
  );
}

function OtpRoute({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, 'Otp'>) {
  // No auth backend yet: any 6-digit code goes to Dashboard, and resend is a
  // no-op. Hook both up to the SMS verification API.
  return (
    <OtpScreen
      phoneNumber={route.params.phoneNumber}
      onVerify={() =>
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'Dashboard',
              params: { phoneNumber: route.params.phoneNumber },
            },
          ],
        })
      }
      onChangeNumber={navigation.goBack}
    />
  );
}

function ComingSoonRoute({
  route,
}: NativeStackScreenProps<RootStackParamList, 'ComingSoon'>) {
  return <PlaceholderScreen title={route.params.title} />;
}

export function RootNavigator() {
  return (
    <NavigationContainer onReady={() => BootSplash.hide({ fade: true })}>
      <NotificationsProvider>
        {/* Above the tabs so listing details share saved items and the cart
            with them. */}
        <FavoritesProvider>
          <CartProvider>
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
              <Stack.Screen name="Login" component={LoginRoute} />
              <Stack.Screen name="Otp" component={OtpRoute} />
              <Stack.Screen
                name="Dashboard"
                component={DashboardTabs}
                options={{ animation: 'fade' }}
              />
              <Stack.Screen
                name="ListingDetails"
                component={ListingDetailsScreen}
              />
              <Stack.Screen
                name="Chat"
                component={ChatScreen}
                options={({ route }) => ({
                  headerShown: true,
                  title: route.params.sellerName,
                  headerBackTitle: 'Back',
                  headerTintColor: colors.primary,
                  headerTitleStyle: { fontFamily: fonts.semiBold },
                })}
              />
              <Stack.Screen
                name="MyListings"
                component={MyListingsScreen}
                options={{
                  headerShown: true,
                  title: 'My listings',
                  headerBackTitle: 'Back',
                  headerTintColor: colors.primary,
                  headerTitleStyle: { fontFamily: fonts.semiBold },
                }}
              />
              <Stack.Screen
                name="Favorites"
                component={FavoritesScreen}
                options={{
                  headerShown: true,
                  title: 'Favorites',
                  headerBackTitle: 'Back',
                  headerTintColor: colors.primary,
                  headerTitleStyle: { fontFamily: fonts.semiBold },
                }}
              />
              <Stack.Screen
                name="Purchases"
                component={PurchasesScreen}
                options={{
                  headerShown: true,
                  title: 'Purchases',
                  headerBackTitle: 'Back',
                  headerTintColor: colors.primary,
                  headerTitleStyle: { fontFamily: fonts.semiBold },
                }}
              />
              <Stack.Screen
                name="Sold"
                component={SoldScreen}
                options={{
                  headerShown: true,
                  title: 'Sold',
                  headerBackTitle: 'Back',
                  headerTintColor: colors.primary,
                  headerTitleStyle: { fontFamily: fonts.semiBold },
                }}
              />
              <Stack.Screen
                name="Legal"
                component={LegalScreen}
                options={{
                  headerShown: true,
                  title: 'Terms & privacy',
                  headerBackTitle: 'Back',
                  headerTintColor: colors.primary,
                  headerTitleStyle: { fontFamily: fonts.semiBold },
                }}
              />
              <Stack.Screen
                name="Help"
                component={HelpScreen}
                options={{
                  headerShown: true,
                  title: 'Help & support',
                  headerBackTitle: 'Back',
                  headerTintColor: colors.primary,
                  headerTitleStyle: { fontFamily: fonts.semiBold },
                }}
              />
              <Stack.Screen
                name="ComingSoon"
                component={ComingSoonRoute}
                options={({ route }) => ({
                  headerShown: true,
                  title: route.params.title,
                  headerBackTitle: 'Back',
                  headerTintColor: colors.primary,
                  headerTitleStyle: { fontFamily: fonts.semiBold },
                })}
              />
              <Stack.Screen
                name="Notifications"
                component={NotificationsScreen}
                options={{
                  headerShown: true,
                  title: 'Notifications',
                  headerBackTitle: 'Back',
                  headerTintColor: colors.primary,
                  headerTitleStyle: { fontFamily: fonts.semiBold },
                }}
              />
            </Stack.Navigator>
          </CartProvider>
        </FavoritesProvider>
      </NotificationsProvider>
    </NavigationContainer>
  );
}

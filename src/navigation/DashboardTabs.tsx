import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TabIcon, type TabIconName } from '../components/TabIcon';
import type { ItemCategory } from '../data/categories';
import { CartScreen } from '../screens/CartScreen';
import { ChatsScreen } from '../screens/ChatsScreen';
import { ExploreScreen } from '../screens/ExploreScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { SellScreen } from '../screens/SellScreen';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { ProfileDrawer } from './ProfileDrawer';
import type { RootStackParamList } from './RootNavigator';

export type DashboardTabParamList = {
  Home: undefined;
  // Set when Home opens Explore from its search bar or a category.
  Explore: { category?: ItemCategory; focusSearch?: boolean } | undefined;
  Sell: undefined;
  Chats: undefined;
  Cart: undefined;
};

const Tab = createBottomTabNavigator<DashboardTabParamList>();

// Drawer items with a screen of their own; the rest open the placeholder.
type ScreenWithoutParams = {
  [Name in keyof RootStackParamList]: undefined extends RootStackParamList[Name]
    ? Name
    : never;
}[keyof RootStackParamList];

const DRAWER_SCREENS: Record<string, ScreenWithoutParams> = {
  Notifications: 'Notifications',
  'My listings': 'MyListings',
  Favorites: 'Favorites',
  Purchases: 'Purchases',
  Sold: 'Sold',
  'Terms & privacy': 'Legal',
  'Help & support': 'Help',
};

const icons: Record<keyof DashboardTabParamList, TabIconName> = {
  Home: 'home',
  Explore: 'explore',
  Sell: 'sell',
  Chats: 'chats',
  Cart: 'cart',
};

function tabBarIcon(routeName: keyof DashboardTabParamList) {
  return ({ color, size }: { color: string; size: number }) => (
    <TabIcon name={icons[routeName]} color={color} size={size} />
  );
}

export function DashboardTabs({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, 'Dashboard'>) {
  // No session to clear yet; logging out just returns to Welcome.
  const logout = () =>
    navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });

  return (
    <ProfileDrawer
      phoneNumber={route.params.phoneNumber}
      onSelect={title => {
        const screen = DRAWER_SCREENS[title];
        if (screen) {
          navigation.navigate(screen);
        } else {
          navigation.navigate('ComingSoon', { title });
        }
      }}
      onLogout={logout}
    >
      <Tab.Navigator
        screenOptions={({ route: tab }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.muted,
          tabBarLabelStyle: { fontFamily: fonts.medium, fontSize: 12 },
          tabBarStyle: { backgroundColor: colors.white },
          tabBarIcon: tabBarIcon(tab.name),
          tabBarButtonTestID: `tab-${tab.name}`,
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Explore" component={ExploreScreen} />
        <Tab.Screen name="Sell" component={SellScreen} />
        <Tab.Screen name="Chats" component={ChatsScreen} />
        <Tab.Screen name="Cart" component={CartScreen} />
      </Tab.Navigator>
    </ProfileDrawer>
  );
}

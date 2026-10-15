import { useCallback, useState, type ReactNode } from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import {
  useNavigation,
  useRoute,
  type NavigationProp,
} from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader } from '../components/AppHeader';
import { useProfileDrawer } from '../navigation/ProfileDrawer';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { useFavorites } from '../state/favorites';
import { useNotifications } from '../state/notifications';
import { colors } from '../theme/colors';

// Tracks whether a tab's main list is scrolled. Pass `onScroll` (with
// scrollEventThrottle) to the list and `scrolled` to TabScreen, so the header
// shows its divider once content scrolls under it.
export function useTabScroll() {
  const [scrolled, setScrolled] = useState(false);
  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const next = event.nativeEvent.contentOffset.y > 1;
      setScrolled(current => (current === next ? current : next));
    },
    [],
  );
  return { scrolled, onScroll };
}

type TabScreenProps = {
  // Defaults to the tab's route name.
  title?: string;
  // Shown under the header row, e.g. a search bar.
  headerBottom?: ReactNode;
  // From useTabScroll: content is scrolled under the header.
  scrolled?: boolean;
  children?: ReactNode;
};

// Frame shared by the dashboard tabs: safe area, drawer menu and one header
// design, so every tab has the same layout and actions; only the title
// changes.
// The tab bar pads for the bottom inset, so only the top inset is applied here.
export function TabScreen({
  title,
  headerBottom,
  scrolled,
  children,
}: TabScreenProps) {
  const routeName = useRoute().name;
  const insets = useSafeAreaInsets();
  const { openDrawer } = useProfileDrawer();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { unreadCount } = useNotifications();
  const { count: favoritesCount } = useFavorites();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      <AppHeader
        title={title ?? routeName}
        onMenuPress={openDrawer}
        scrolled={scrolled}
        actions={[
          {
            icon: 'heart',
            label: 'Favorites',
            onPress: () => navigation.navigate('Favorites'),
            badge: favoritesCount,
            badgeLabel: 'saved',
          },
          {
            icon: 'bell',
            label: 'Notifications',
            onPress: () => navigation.navigate('Notifications'),
            badge: unreadCount,
          },
        ]}
      >
        {headerBottom}
      </AppHeader>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
  },
});

import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import type { CurrentLocation } from '../hooks/useCurrentLocation';
import type { PickedPlace } from '../services/places';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { formatInternational } from '../utils/phone';
import { DrawerLocation } from './DrawerLocation';

type ProfileDrawerContentProps = {
  phoneNumber?: string;
  location: CurrentLocation;
  chosenPlace?: PickedPlace;
  onChoosePlace: (place?: PickedPlace) => void;
  onRefreshLocation: () => void;
  onSelect?: (title: string) => void;
  onLogout?: () => void;
};

type ItemIconName =
  | 'listings'
  | 'favorites'
  | 'purchases'
  | 'sold'
  | 'notifications'
  | 'help'
  | 'terms'
  | 'logout';

const DANGER = '#C2410C';

// No profile backend yet: the name is a dummy.
// Replace with the signed-in user's data once the API exists.
const userName = 'Muhammed Shamsudeen';

export function ProfileDrawerContent({
  phoneNumber,
  location,
  chosenPlace,
  onChoosePlace,
  onRefreshLocation,
  onSelect,
  onLogout,
}: ProfileDrawerContentProps) {
  const insets = useSafeAreaInsets();
  const displayNumber = phoneNumber
    ? formatInternational(phoneNumber)
    : undefined;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.avatar}>
          <Svg width={34} height={34} viewBox="0 0 24 24">
            <Circle cx={12} cy={8} r={4} fill={colors.primary} />
            <Path d="M4 21a8 8 0 0 1 16 0z" fill={colors.primary} />
          </Svg>
        </View>

        <View style={styles.nameRow}>
          <Text
            style={styles.name}
            accessibilityRole="header"
            maxFontSizeMultiplier={1.4}
          >
            {userName}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Edit profile"
            onPress={() => onSelect?.('Edit profile')}
            hitSlop={6}
            style={({ pressed }) => [
              styles.editButton,
              pressed && styles.pressed,
            ]}
          >
            <Svg width={18} height={18} viewBox="0 0 24 24">
              <Path
                d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z M13.5 6.5l4 4"
                fill="none"
                stroke={colors.primaryDark}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </Pressable>
        </View>
        {displayNumber && (
          <Text style={styles.phone} maxFontSizeMultiplier={1.4}>
            {displayNumber}
          </Text>
        )}
        <DrawerLocation
          location={location}
          chosen={chosenPlace}
          onChoose={onChoosePlace}
          onRefresh={onRefreshLocation}
        />
      </View>

      <ScrollView
        style={styles.menu}
        contentContainerStyle={styles.menuContent}
        showsVerticalScrollIndicator={false}
      >
        <Item
          icon="listings"
          label="My listings"
          onPress={() => onSelect?.('My listings')}
        />
        <Item
          icon="favorites"
          label="Favorites"
          onPress={() => onSelect?.('Favorites')}
        />
        <Item
          icon="purchases"
          label="Purchases"
          onPress={() => onSelect?.('Purchases')}
        />
        <Item icon="sold" label="Sold" onPress={() => onSelect?.('Sold')} />
        <View style={styles.divider} />
        <Item
          icon="notifications"
          label="Notifications"
          onPress={() => onSelect?.('Notifications')}
        />
        <View style={styles.divider} />
        <Item
          icon="help"
          label="Help & support"
          onPress={() => onSelect?.('Help & support')}
        />
        <Item
          icon="terms"
          label="Terms & privacy"
          onPress={() => onSelect?.('Terms & privacy')}
        />
      </ScrollView>

      <View
        style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}
      >
        <Item icon="logout" label="Log out" onPress={onLogout} danger />
      </View>
    </View>
  );
}

type ItemProps = {
  icon: ItemIconName;
  label: string;
  onPress?: () => void;
  danger?: boolean;
};

function Item({ icon, label, onPress, danger }: ItemProps) {
  const color = danger ? DANGER : colors.charcoal;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
    >
      <ItemIcon name={icon} color={color} />
      <Text style={[styles.itemLabel, { color }]} maxFontSizeMultiplier={1.5}>
        {label}
      </Text>
    </Pressable>
  );
}

function ItemIcon({ name, color }: { name: ItemIconName; color: string }) {
  const stroke = {
    fill: 'none',
    stroke: color,
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24">
      {name === 'listings' && (
        <>
          <Rect x={4} y={3} width={16} height={18} rx={3} {...stroke} />
          <Path d="M8 8h8M8 12h8M8 16h5" {...stroke} />
        </>
      )}
      {name === 'favorites' && (
        <Path
          d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"
          {...stroke}
        />
      )}
      {name === 'purchases' && (
        <>
          <Path d="M5 8h14l-1 12H6z" {...stroke} />
          <Path d="M9 8V6a3 3 0 0 1 6 0v2" {...stroke} />
        </>
      )}
      {name === 'sold' && (
        <>
          <Path d="M3 12V4h8l10 10-8 8z" {...stroke} />
          <Circle cx={7.5} cy={8.5} r={1.5} {...stroke} />
        </>
      )}
      {name === 'notifications' && (
        <>
          <Path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z" {...stroke} />
          <Path d="M10 21h4" {...stroke} />
        </>
      )}
      {name === 'help' && (
        <>
          <Circle cx={12} cy={12} r={9} {...stroke} />
          <Path
            d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5V14"
            {...stroke}
          />
          <Circle cx={12} cy={17} r={0.6} {...stroke} />
        </>
      )}
      {name === 'terms' && (
        <>
          <Path d="M7 3h7l4 4v14H7z" {...stroke} />
          <Path d="M14 3v4h4M10 12h5M10 16h5" {...stroke} />
        </>
      )}
      {name === 'logout' && (
        <Path
          d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4M10 16l-4-4 4-4M6 12h10"
          {...stroke}
        />
      )}
    </Svg>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'flex-start',
    backgroundColor: colors.primary,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.sand,
    borderWidth: 3,
    borderColor: colors.accent,
    marginBottom: 14,
  },
  nameRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    flexShrink: 1,
    fontSize: 20,
    fontFamily: fonts.semiBold,
    color: colors.white,
  },
  phone: {
    marginTop: 2,
    fontSize: 15,
    fontFamily: fonts.regular,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
  },
  menu: {
    flex: 1,
  },
  menuContent: {
    paddingVertical: 8,
  },
  item: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 20,
  },
  itemPressed: {
    backgroundColor: colors.offWhite,
  },
  itemLabel: {
    flex: 1,
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.charcoal,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 8,
    marginHorizontal: 20,
    backgroundColor: colors.beige,
  },
  footer: {
    paddingTop: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.beige,
  },
  pressed: {
    opacity: 0.7,
  },
});

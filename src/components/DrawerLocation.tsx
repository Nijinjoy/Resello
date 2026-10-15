import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import type { CurrentLocation } from '../hooks/useCurrentLocation';
import type { PickedPlace } from '../services/places';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { LocationPicker } from './LocationPicker';

type DrawerLocationProps = {
  location: CurrentLocation;
  // A place the user searched for; unset means the device location.
  chosen?: PickedPlace;
  onChoose: (place?: PickedPlace) => void;
  onRefresh: () => void;
};

// The user's area in the drawer header. Tap to search for a different one.
export function DrawerLocation({
  location,
  chosen,
  onChoose,
  onRefresh,
}: DrawerLocationProps) {
  const [picking, setPicking] = useState(false);

  let label = 'Your location';
  let title: string;
  switch (location.status) {
    case 'loading':
      title = 'Finding location…';
      break;
    case 'ready':
      title =
        location.place?.name ??
        `${location.coords.latitude.toFixed(
          4,
        )}, ${location.coords.longitude.toFixed(4)}`;
      break;
    case 'denied':
      label = 'Location access is off';
      title = 'Choose your area';
      break;
    case 'error':
      label = "Couldn't find you";
      title = 'Choose your area';
      break;
  }
  if (chosen) {
    label = 'Your location';
    title = chosen.name;
  }

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${title}`}
        accessibilityHint="Double tap to change your location"
        onPress={() => setPicking(true)}
        style={({ pressed }) => [styles.pill, pressed && styles.pressed]}
      >
        <View style={styles.icon}>
          {location.status === 'loading' && !chosen ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Svg width={16} height={16} viewBox="0 0 24 24">
              <Path
                d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"
                fill="none"
                stroke={colors.white}
                strokeWidth={2.2}
                strokeLinejoin="round"
              />
              <Circle cx={12} cy={9.5} r={2.5} fill={colors.white} />
            </Svg>
          )}
        </View>
        <View style={styles.text}>
          <Text style={styles.label} maxFontSizeMultiplier={1.3}>
            {label}
          </Text>
          <Text
            style={styles.title}
            numberOfLines={1}
            maxFontSizeMultiplier={1.3}
          >
            {title}
          </Text>
        </View>
        <Svg width={18} height={18} viewBox="0 0 24 24">
          <Path
            d="m6 9 6 6 6-6"
            fill="none"
            stroke={colors.white}
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </Pressable>
      <LocationPicker
        visible={picking}
        currentLabel={
          location.status === 'ready'
            ? location.place?.name ?? 'Current location'
            : undefined
        }
        near={location.status === 'ready' ? location.coords : undefined}
        onSelect={place => {
          onChoose(place);
          setPicking(false);
        }}
        onUseCurrent={() => {
          onChoose(undefined);
          onRefresh();
          setPicking(false);
        }}
        onClose={() => setPicking(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: colors.primaryDark,
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
  },
  text: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    fontFamily: fonts.medium,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  title: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: colors.white,
  },
  pressed: {
    opacity: 0.75,
  },
});

import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import {
  getPlace,
  newSessionToken,
  searchPlaces,
  type PickedPlace,
  type PlaceSuggestion,
} from '../services/places';
import type { Coordinates } from '../services/location';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

const SEARCH_DELAY = 300;
const MIN_QUERY = 2;

type LocationPickerProps = {
  visible: boolean;
  // Shown on the "Use current location" row, and used to rank results.
  currentLabel?: string;
  near?: Coordinates;
  onSelect: (place: PickedPlace) => void;
  onUseCurrent: () => void;
  onClose: () => void;
};

type SearchState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'done'; results: PlaceSuggestion[] }
  | { status: 'error' };

export function LocationPicker({
  visible,
  currentLabel,
  near,
  onSelect,
  onUseCurrent,
  onClose,
}: LocationPickerProps) {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState<SearchState>({ status: 'idle' });
  const [choosing, setChoosing] = useState<string>();
  const [chooseError, setChooseError] = useState(false);
  const sessionToken = useRef(newSessionToken());

  // Fresh search and billing session every time the picker opens.
  useEffect(() => {
    if (visible) {
      sessionToken.current = newSessionToken();
      setQuery('');
      setSearch({ status: 'idle' });
      setChoosing(undefined);
      setChooseError(false);
    }
  }, [visible]);

  useEffect(() => {
    const text = query.trim();
    if (text.length < MIN_QUERY) {
      setSearch({ status: 'idle' });
      return;
    }
    let cancelled = false;
    setSearch({ status: 'loading' });
    const timer = setTimeout(() => {
      searchPlaces(text, sessionToken.current, near)
        .then(results => !cancelled && setSearch({ status: 'done', results }))
        .catch(error => {
          console.warn('Place search failed', error);
          if (!cancelled) {
            setSearch({ status: 'error' });
          }
        });
    }, SEARCH_DELAY);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, near]);

  const choose = async (suggestion: PlaceSuggestion) => {
    setChoosing(suggestion.placeId);
    setChooseError(false);
    try {
      const place = await getPlace(suggestion.placeId, sessionToken.current);
      onSelect(place);
    } catch (error) {
      console.warn('Place details failed', error);
      setChooseError(true);
    } finally {
      setChoosing(undefined);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        <View style={styles.header}>
          <Text style={styles.title} accessibilityRole="header">
            Pickup location
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={onClose}
            hitSlop={8}
            style={({ pressed }) => pressed && styles.pressed}
          >
            <Text style={styles.cancel}>Cancel</Text>
          </Pressable>
        </View>

        <View style={styles.search}>
          <Svg width={18} height={18} viewBox="0 0 24 24">
            <Circle
              cx={11}
              cy={11}
              r={7}
              fill="none"
              stroke={colors.muted}
              strokeWidth={2}
            />
            <Path
              d="m20 20-3.5-3.5"
              stroke={colors.muted}
              strokeWidth={2}
              strokeLinecap="round"
            />
          </Svg>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search area, building or street"
            placeholderTextColor={colors.muted}
            accessibilityLabel="Search places"
            autoFocus
            autoCorrect={false}
            returnKeyType="search"
            clearButtonMode="while-editing"
            style={styles.searchInput}
          />
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={onUseCurrent}
          style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
        >
          <View style={[styles.rowIcon, styles.rowIconCurrent]}>
            <Svg width={20} height={20} viewBox="0 0 24 24">
              <Circle
                cx={12}
                cy={12}
                r={7}
                fill="none"
                stroke={colors.white}
                strokeWidth={2}
              />
              <Circle cx={12} cy={12} r={2.5} fill={colors.white} />
              <Path
                d="M12 2v3M12 19v3M2 12h3M19 12h3"
                stroke={colors.white}
                strokeWidth={2}
                strokeLinecap="round"
              />
            </Svg>
          </View>
          <View style={styles.rowText}>
            <Text style={[styles.rowTitle, styles.currentTitle]}>
              Use current location
            </Text>
            {currentLabel && (
              <Text style={styles.rowSubtitle} numberOfLines={1}>
                {currentLabel}
              </Text>
            )}
          </View>
        </Pressable>

        {chooseError && (
          <Text style={styles.error} accessibilityLiveRegion="polite">
            Couldn't load that place. Try again.
          </Text>
        )}

        <FlatList
          data={search.status === 'done' ? search.results : []}
          keyExtractor={item => item.placeId}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={[item.mainText, item.secondaryText]
                .filter(Boolean)
                .join(', ')}
              disabled={!!choosing}
              onPress={() => choose(item)}
              style={({ pressed }) => [
                styles.row,
                pressed && styles.rowPressed,
              ]}
            >
              <View style={styles.rowIcon}>
                {choosing === item.placeId ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <Svg width={18} height={18} viewBox="0 0 24 24">
                    <Path
                      d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"
                      fill="none"
                      stroke={colors.primary}
                      strokeWidth={1.8}
                      strokeLinejoin="round"
                    />
                    <Circle cx={12} cy={9.5} r={2.5} fill={colors.primary} />
                  </Svg>
                )}
              </View>
              <View style={styles.rowText}>
                <Text style={styles.rowTitle} numberOfLines={1}>
                  {item.mainText}
                </Text>
                {item.secondaryText && (
                  <Text style={styles.rowSubtitle} numberOfLines={1}>
                    {item.secondaryText}
                  </Text>
                )}
              </View>
            </Pressable>
          )}
          ListEmptyComponent={<SearchStatus search={search} />}
        />
        <Text style={styles.attribution}>Powered by Google</Text>
      </View>
    </Modal>
  );
}

function SearchStatus({ search }: { search: SearchState }) {
  if (search.status === 'loading') {
    return <ActivityIndicator style={styles.status} color={colors.primary} />;
  }
  const message =
    search.status === 'error'
      ? "Couldn't search places. Check your connection."
      : search.status === 'done'
      ? 'No places found. Try a different search.'
      : 'Type at least 2 letters to search.';
  return <Text style={[styles.status, styles.statusText]}>{message}</Text>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.charcoal,
  },
  cancel: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: colors.primary,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    minHeight: 46,
    borderRadius: 14,
    backgroundColor: colors.offWhite,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.beige,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.charcoal,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  rowPressed: {
    backgroundColor: colors.offWhite,
  },
  rowIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.sand,
  },
  rowIconCurrent: {
    backgroundColor: colors.primary,
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.charcoal,
  },
  currentTitle: {
    fontFamily: fonts.semiBold,
    color: colors.primary,
  },
  rowSubtitle: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  error: {
    marginHorizontal: 16,
    marginBottom: 4,
    fontSize: 13,
    fontFamily: fonts.regular,
    color: '#C2410C',
  },
  status: {
    marginTop: 32,
  },
  statusText: {
    paddingHorizontal: 32,
    textAlign: 'center',
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  attribution: {
    paddingVertical: 8,
    textAlign: 'center',
    fontSize: 11,
    fontFamily: fonts.regular,
    color: colors.muted,
  },
  pressed: {
    opacity: 0.7,
  },
});

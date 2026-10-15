import {
  FlatList,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Svg, { Path } from 'react-native-svg';
import { PrimaryButton } from '../components/Button';
import { ListingCard } from '../components/ListingCard';
import { listings } from '../data/listings';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { useFavorites } from '../state/favorites';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

const SCREEN_PADDING = 16;
const GRID_GAP = 12;

type Props = NativeStackScreenProps<RootStackParamList, 'Favorites'>;

// Saved listings as a two-column grid, most recently saved first. Tapping a
// card's heart unsaves it, which removes it from the grid.
export function FavoritesScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const { ids } = useFavorites();
  const cardWidth = (width - SCREEN_PADDING * 2 - GRID_GAP) / 2;

  const saved = [...ids]
    .reverse()
    .map(id => listings.find(listing => listing.id === id))
    .filter(listing => listing !== undefined);

  return (
    <View style={styles.container}>
      <FlatList
        data={saved}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          saved.length > 0 ? (
            <Text style={styles.count}>
              {`${saved.length} saved ${saved.length === 1 ? 'item' : 'items'}`}
            </Text>
          ) : undefined
        }
        renderItem={({ item }) => (
          <ListingCard
            listing={item}
            width={cardWidth}
            onPress={() =>
              navigation.navigate('ListingDetails', { listingId: item.id })
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Svg width={30} height={30} viewBox="0 0 24 24">
                <Path
                  d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"
                  fill="none"
                  stroke={colors.primary}
                  strokeWidth={2}
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
            <Text style={styles.emptyTitle}>No favorites yet</Text>
            <Text style={styles.emptyBody}>
              Tap the heart on any item to save it here.
            </Text>
            <View style={styles.emptyAction}>
              <PrimaryButton
                label="Explore items"
                onPress={() =>
                  navigation.popTo(
                    'Dashboard',
                    { screen: 'Explore' },
                    { merge: true },
                  )
                }
              />
            </View>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  grid: {
    flexGrow: 1,
    padding: SCREEN_PADDING,
    paddingBottom: 32,
    gap: GRID_GAP,
  },
  gridRow: {
    gap: GRID_GAP,
  },
  count: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.textMuted,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 24,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.sand,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: fonts.semiBold,
    color: colors.ink,
  },
  emptyBody: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    textAlign: 'center',
  },
  emptyAction: {
    alignSelf: 'stretch',
    marginTop: 16,
  },
});

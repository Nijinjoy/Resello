import {
  FlatList,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';
import { EmptyState } from '../components/EmptyState';
import { ListingCard } from '../components/ListingCard';
import { listings } from '../data/listings';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { useFavorites } from '../state/favorites';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

const SCREEN_PADDING = 16;
const GRID_GAP = 12;

const STEPS = [
  {
    title: 'Tap the heart',
    body: 'On any item in Home, Explore, or its details.',
  },
  { title: 'Find it here', body: 'Everything you save, newest first.' },
  {
    title: 'Decide when you’re ready',
    body: 'Chat with the seller or add it to your cart.',
  },
];

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

  if (saved.length === 0) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <EmptyState
          illustration={<EmptyHeartIllustration />}
          title="No favorites yet"
          body="Save items you love and come back to them any time."
          steps={STEPS}
          primaryAction={{
            label: 'Start exploring',
            onPress: () =>
              navigation.popTo(
                'Dashboard',
                { screen: 'Explore' },
                { merge: true },
              ),
          }}
        />
      </View>
    );
  }

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
          <Text style={styles.count}>
            {`${saved.length} saved ${saved.length === 1 ? 'item' : 'items'}`}
          </Text>
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
  emptyContainer: {
    paddingHorizontal: SCREEN_PADDING,
  },
});

// A heart with a price tag: things you'd like to buy.
function EmptyHeartIllustration() {
  return (
    <Svg
      width={180}
      height={150}
      viewBox="0 0 180 150"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Circle cx={90} cy={72} r={64} fill={colors.sand} />
      <Ellipse cx={90} cy={136} rx={46} ry={6} fill="#EDE3D1" />
      {/* Heart */}
      <Path
        d="M90 124s-42-25-42-58a23 23 0 0 1 42-13 23 23 0 0 1 42 13c0 33-42 58-42 58z"
        fill={colors.primary}
      />
      <Path
        d="M64 58a12 12 0 0 1 12-10"
        fill="none"
        stroke="rgba(255, 255, 255, 0.45)"
        strokeWidth={5}
        strokeLinecap="round"
      />
      {/* Price tag tucked against the heart */}
      <Path
        d="M116 104l10-11h28a3 3 0 0 1 3 3v16a3 3 0 0 1-3 3h-28z"
        fill={colors.accent}
        transform="rotate(-24 136 104)"
      />
      <Circle
        cx={126}
        cy={104}
        r={2.8}
        fill={colors.white}
        transform="rotate(-24 136 104)"
      />
      <Rect
        x={133}
        y={102}
        width={16}
        height={3.5}
        rx={1.75}
        fill={colors.primaryDark}
        opacity={0.45}
        transform="rotate(-24 136 104)"
      />
      {/* Sparkles */}
      <Path
        d="M42 34v10M37 39h10"
        stroke={colors.accent}
        strokeWidth={2.4}
        strokeLinecap="round"
      />
      <Circle cx={146} cy={40} r={4} fill={colors.beige} />
      <Circle cx={34} cy={96} r={3} fill={colors.beige} />
    </Svg>
  );
}

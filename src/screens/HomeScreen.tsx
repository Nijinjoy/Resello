import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import Svg, { Circle, Path } from 'react-native-svg';
import { BannerCarousel } from '../components/BannerCarousel';
import { CategoryIcon } from '../components/CategoryIcon';
import { ListingCard } from '../components/ListingCard';
import { CATEGORIES } from '../data/categories';
import { listings } from '../data/listings';
import type { DashboardTabParamList } from '../navigation/DashboardTabs';
import { useComingSoon } from '../navigation/useComingSoon';
import { useOpenListing } from '../navigation/useOpenListing';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { TabScreen, useTabScroll } from './TabScreen';

const GRID_GAP = 12;
const SCREEN_PADDING = 16;
const NEARBY_KM = 5;

export function HomeScreen() {
  const navigation =
    useNavigation<BottomTabNavigationProp<DashboardTabParamList>>();
  const comingSoon = useComingSoon();
  const { scrolled, onScroll } = useTabScroll();
  const { width } = useWindowDimensions();

  const gridCardWidth = (width - SCREEN_PADDING * 2 - GRID_GAP) / 2;
  const nearby = listings
    .filter(listing => listing.distanceKm <= NEARBY_KM)
    .sort((a, b) => a.distanceKm - b.distanceKm);

  const explore = (params: DashboardTabParamList['Explore']) =>
    navigation.navigate('Explore', params);

  const openListing = useOpenListing();

  return (
    <TabScreen title="Resello" scrolled={scrolled}>
      <FlatList
        data={listings}
        keyExtractor={listing => listing.id}
        numColumns={2}
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={styles.list}
        contentContainerStyle={styles.content}
        columnWrapperStyle={styles.gridRow}
        ItemSeparatorComponent={RowGap}
        showsVerticalScrollIndicator={false}
        // Everything above the Fresh finds grid scrolls with it.
        ListHeaderComponent={
          <>
            <Pressable
              accessibilityRole="search"
              accessibilityLabel="Search for items"
              onPress={() => explore({ focusSearch: true })}
              style={({ pressed }) => [
                styles.search,
                pressed && styles.pressed,
              ]}
            >
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
              <Text style={styles.searchText}>
                Search phones, sofas, bikes…
              </Text>
            </Pressable>

            <View style={styles.banners}>
              <BannerCarousel
                banners={[
                  {
                    id: 'sell',
                    eyebrow: 'Turn clutter into cash',
                    title: 'Sell in under a minute',
                    cta: 'Start selling',
                    image: require('../../assets/banners/sell.jpg'),
                    tone: 'green',
                    onPress: () => navigation.navigate('Sell'),
                  },
                  {
                    id: 'protection',
                    eyebrow: 'Shop with confidence',
                    title: "Full refund if it's not as described",
                    cta: 'How it works',
                    image: require('../../assets/banners/protection.jpg'),
                    tone: 'charcoal',
                    onPress: () => comingSoon('Buyer protection'),
                  },
                  {
                    id: 'nearby',
                    eyebrow: 'Fresh near you',
                    title: 'New deals within 5 km',
                    cta: 'Explore nearby',
                    image: require('../../assets/banners/nearby.jpg'),
                    tone: 'teal',
                    onPress: () => explore({}),
                  },
                ]}
              />
            </View>

            <SectionHeader title="Categories" onSeeAll={() => explore({})} />
            <FlatList
              horizontal
              data={CATEGORIES}
              keyExtractor={category => category.value}
              showsHorizontalScrollIndicator={false}
              style={styles.bleed}
              contentContainerStyle={styles.categories}
              renderItem={({ item: category }) => (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => explore({ category: category.value })}
                  style={({ pressed }) => [
                    styles.category,
                    pressed && styles.pressed,
                  ]}
                >
                  <View style={styles.categoryIcon}>
                    <CategoryIcon category={category.value} size={26} />
                  </View>
                  <Text style={styles.categoryLabel} numberOfLines={1}>
                    {category.label}
                  </Text>
                </Pressable>
              )}
            />

            <SectionHeader title="Near you" onSeeAll={() => explore({})} />
            <FlatList
              horizontal
              data={nearby}
              keyExtractor={listing => listing.id}
              showsHorizontalScrollIndicator={false}
              style={styles.bleed}
              contentContainerStyle={styles.nearby}
              renderItem={({ item: listing }) => (
                <ListingCard
                  listing={listing}
                  width={160}
                  onPress={() => openListing(listing.id)}
                />
              )}
            />

            <SectionHeader title="Fresh finds" />
          </>
        }
        renderItem={({ item: listing }) => (
          <ListingCard
            listing={listing}
            width={gridCardWidth}
            onPress={() => openListing(listing.id)}
          />
        )}
      />
    </TabScreen>
  );
}

function RowGap() {
  return <View style={styles.rowGap} />;
}

function SectionHeader({
  title,
  onSeeAll,
}: {
  title: string;
  onSeeAll?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle} accessibilityRole="header">
        {title}
      </Text>
      {onSeeAll && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`See all ${title.toLowerCase()}`}
          onPress={onSeeAll}
          hitSlop={8}
          style={({ pressed }) => pressed && styles.pressed}
        >
          <Text style={styles.seeAll}>See all</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    marginHorizontal: -SCREEN_PADDING,
  },
  content: {
    paddingHorizontal: SCREEN_PADDING,
    paddingTop: 4,
    paddingBottom: 32,
  },
  banners: {
    marginTop: 16,
  },
  bleed: {
    marginHorizontal: -SCREEN_PADDING,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 48,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: colors.offWhite,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.beige,
  },
  searchText: {
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.muted,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.charcoal,
  },
  seeAll: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.primary,
  },
  categories: {
    paddingHorizontal: SCREEN_PADDING,
    gap: 12,
  },
  category: {
    width: 76,
    alignItems: 'center',
    gap: 6,
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.sand,
  },
  categoryLabel: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.charcoal,
  },
  nearby: {
    paddingHorizontal: SCREEN_PADDING,
    gap: GRID_GAP,
  },
  gridRow: {
    gap: GRID_GAP,
  },
  rowGap: {
    height: GRID_GAP,
  },
  pressed: {
    opacity: 0.75,
  },
});

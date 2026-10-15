import { useEffect, useMemo, useRef, useState, type ComponentRef } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { useRoute, type RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import { ListingCard } from '../components/ListingCard';
import { CATEGORIES, type ItemCategory } from '../data/categories';
import { listings, type Listing } from '../data/listings';
import type { DashboardTabParamList } from '../navigation/DashboardTabs';
import { useOpenListing } from '../navigation/useOpenListing';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { TabScreen, useTabScroll } from './TabScreen';

const SCREEN_PADDING = 16;
const GRID_GAP = 12;

type Sort = 'nearest' | 'newest' | 'priceLow' | 'priceHigh';

const SORTS: { value: Sort; label: string }[] = [
  { value: 'nearest', label: 'Nearest' },
  { value: 'newest', label: 'Newest' },
  { value: 'priceLow', label: 'Price: low to high' },
  { value: 'priceHigh', label: 'Price: high to low' },
];

const CONDITIONS = ['New', 'Like new', 'Good', 'Fair'];
const DISTANCES = [1, 5, 10];

type Filters = {
  sort: Sort;
  conditions: string[];
  maxKm?: number;
  minPrice?: number;
  maxPrice?: number;
};

const DEFAULT_FILTERS: Filters = { sort: 'nearest', conditions: [] };

const SORTERS: Record<Sort, (a: Listing, b: Listing) => number> = {
  nearest: (a, b) => a.distanceKm - b.distanceKm,
  newest: (a, b) => a.minutesAgo - b.minutesAgo,
  priceLow: (a, b) => a.price - b.price,
  priceHigh: (a, b) => b.price - a.price,
};

function applyFilters(
  query: string,
  category: ItemCategory | undefined,
  filters: Filters,
) {
  const q = query.trim().toLowerCase();
  return listings
    .filter(
      listing =>
        (!q ||
          listing.title.toLowerCase().includes(q) ||
          listing.area.toLowerCase().includes(q)) &&
        (!category || listing.category === category) &&
        (filters.conditions.length === 0 ||
          filters.conditions.includes(listing.condition)) &&
        (filters.maxKm === undefined || listing.distanceKm <= filters.maxKm) &&
        (filters.minPrice === undefined || listing.price >= filters.minPrice) &&
        (filters.maxPrice === undefined || listing.price <= filters.maxPrice),
    )
    .sort(SORTERS[filters.sort]);
}

function activeFilterCount(filters: Filters) {
  return (
    (filters.conditions.length > 0 ? 1 : 0) +
    (filters.maxKm !== undefined ? 1 : 0) +
    (filters.minPrice !== undefined || filters.maxPrice !== undefined ? 1 : 0)
  );
}

const plural = (count: number, word: string) =>
  `${count} ${word}${count === 1 ? '' : 's'}`;

export function ExploreScreen() {
  const route = useRoute<RouteProp<DashboardTabParamList, 'Explore'>>();
  const openListing = useOpenListing();
  const { scrolled, onScroll } = useTabScroll();
  const { width } = useWindowDimensions();
  const searchRef = useRef<ComponentRef<typeof TextInput>>(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<ItemCategory>();
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Home opens Explore with a category or a request to focus search.
  useEffect(() => {
    const params = route.params;
    if (params?.category) {
      setCategory(params.category);
    } else if (params) {
      setCategory(undefined);
    }
    if (params?.focusSearch) {
      searchRef.current?.focus();
    }
  }, [route.params]);

  const results = useMemo(
    () => applyFilters(query, category, filters),
    [query, category, filters],
  );
  const filterCount = activeFilterCount(filters);
  const cardWidth = (width - SCREEN_PADDING * 2 - GRID_GAP) / 2;
  const sortLabel = SORTS.find(s => s.value === filters.sort)!.label;

  const clearAll = () => {
    setQuery('');
    setCategory(undefined);
    setFilters(DEFAULT_FILTERS);
  };

  return (
    <TabScreen
      scrolled={scrolled}
      headerBottom={
        <>
          <View style={styles.searchRow}>
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
                ref={searchRef}
                value={query}
                onChangeText={setQuery}
                placeholder="Search items or areas"
                placeholderTextColor={colors.muted}
                accessibilityLabel="Search listings"
                returnKeyType="search"
                clearButtonMode="while-editing"
                autoCorrect={false}
                style={styles.searchInput}
              />
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                filterCount ? `Filters, ${filterCount} active` : 'Filters'
              }
              onPress={() => setFiltersOpen(true)}
              style={({ pressed }) => [
                styles.filterButton,
                filterCount > 0 && styles.filterButtonOn,
                pressed && styles.pressed,
              ]}
            >
              <Svg width={20} height={20} viewBox="0 0 24 24">
                <Path
                  d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12"
                  fill="none"
                  stroke={filterCount ? colors.white : colors.charcoal}
                  strokeWidth={2}
                  strokeLinecap="round"
                />
                {[
                  [16, 6],
                  [10, 12],
                  [18, 18],
                ].map(([cx, cy]) => (
                  <Circle
                    key={`${cx}-${cy}`}
                    cx={cx}
                    cy={cy}
                    r={2}
                    fill="none"
                    stroke={filterCount ? colors.white : colors.charcoal}
                    strokeWidth={2}
                  />
                ))}
              </Svg>
              {filterCount > 0 && (
                <View style={styles.filterBadge}>
                  <Text style={styles.filterBadgeText}>{filterCount}</Text>
                </View>
              )}
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipScroll}
            contentContainerStyle={styles.chips}
          >
            <Chip
              label="All"
              accessibilityLabel="All categories"
              selected={!category}
              onPress={() => setCategory(undefined)}
            />
            {CATEGORIES.map(option => (
              <Chip
                key={option.value}
                label={option.label}
                accessibilityLabel={`${option.label} category`}
                selected={category === option.value}
                onPress={() =>
                  setCategory(current =>
                    current === option.value ? undefined : option.value,
                  )
                }
              />
            ))}
          </ScrollView>

          <View style={styles.resultsBar}>
            <Text style={styles.resultsCount} accessibilityLiveRegion="polite">
              {plural(results.length, 'result')}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Sorted by ${sortLabel}. Change sort`}
              onPress={() => setFiltersOpen(true)}
              hitSlop={8}
              style={({ pressed }) => [
                styles.sortButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.sortText}>{sortLabel}</Text>
              <Svg width={14} height={14} viewBox="0 0 24 24">
                <Path
                  d="m6 9 6 6 6-6"
                  fill="none"
                  stroke={colors.primary}
                  strokeWidth={2.4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </Pressable>
          </View>
        </>
      }
    >
      <FlatList
        data={results}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyExtractor={item => item.id}
        numColumns={2}
        style={styles.list}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.grid}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ListingCard
            listing={item}
            width={cardWidth}
            onPress={() => openListing(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No items match</Text>
            <Text style={styles.emptyBody}>
              Try a different search, or clear your filters.
            </Text>
            <SecondaryButton label="Clear all" onPress={clearAll} />
          </View>
        }
      />

      <FilterSheet
        visible={filtersOpen}
        filters={filters}
        countFor={draft => applyFilters(query, category, draft).length}
        onApply={next => {
          setFilters(next);
          setFiltersOpen(false);
        }}
        onClose={() => setFiltersOpen(false)}
      />
    </TabScreen>
  );
}

function Chip({
  label,
  accessibilityLabel,
  selected,
  onPress,
}: {
  label: string;
  accessibilityLabel?: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.chip, selected && styles.chipOn]}
    >
      <Text
        style={[styles.chipText, selected && styles.chipTextOn]}
        maxFontSizeMultiplier={1.3}
      >
        {label}
      </Text>
    </Pressable>
  );
}

type FilterSheetProps = {
  visible: boolean;
  filters: Filters;
  // Live result count for the draft, shown on the apply button.
  countFor: (draft: Filters) => number;
  onApply: (filters: Filters) => void;
  onClose: () => void;
};

function FilterSheet({
  visible,
  filters,
  countFor,
  onApply,
  onClose,
}: FilterSheetProps) {
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState(filters);

  // Start from the applied filters each time the sheet opens.
  useEffect(() => {
    if (visible) {
      setDraft(filters);
    }
  }, [visible, filters]);

  const update = (patch: Partial<Filters>) =>
    setDraft(current => ({ ...current, ...patch }));

  const toggleCondition = (condition: string) =>
    update({
      conditions: draft.conditions.includes(condition)
        ? draft.conditions.filter(c => c !== condition)
        : [...draft.conditions, condition],
    });

  const parsePrice = (text: string) => {
    const digits = text.replace(/[^0-9]/g, '');
    return digits ? Number(digits) : undefined;
  };

  const count = countFor(draft);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.sheetRoot}>
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close filters"
        />
        <View
          style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}
        >
          <View style={styles.handle} />
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle} accessibilityRole="header">
              Filters
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Reset filters"
              onPress={() => setDraft(DEFAULT_FILTERS)}
              hitSlop={8}
              style={({ pressed }) => pressed && styles.pressed}
            >
              <Text style={styles.reset}>Reset</Text>
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={styles.sheetContent}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.sheetLabel}>Sort by</Text>
            <View style={styles.wrapChips}>
              {SORTS.map(option => (
                <Chip
                  key={option.value}
                  label={option.label}
                  accessibilityLabel={`Sort by ${option.label}`}
                  selected={draft.sort === option.value}
                  onPress={() => update({ sort: option.value })}
                />
              ))}
            </View>

            <Text style={styles.sheetLabel}>Condition</Text>
            <View style={styles.wrapChips}>
              {CONDITIONS.map(condition => (
                <Chip
                  key={condition}
                  label={condition}
                  accessibilityLabel={`${condition} condition`}
                  selected={draft.conditions.includes(condition)}
                  onPress={() => toggleCondition(condition)}
                />
              ))}
            </View>

            <Text style={styles.sheetLabel}>Distance</Text>
            <View style={styles.wrapChips}>
              <Chip
                label="Any"
                accessibilityLabel="Any distance"
                selected={draft.maxKm === undefined}
                onPress={() => update({ maxKm: undefined })}
              />
              {DISTANCES.map(km => (
                <Chip
                  key={km}
                  label={`Within ${km} km`}
                  accessibilityLabel={`Within ${km} km`}
                  selected={draft.maxKm === km}
                  onPress={() => update({ maxKm: km })}
                />
              ))}
            </View>

            <Text style={styles.sheetLabel}>Price (AED)</Text>
            <View style={styles.priceRow}>
              <TextInput
                value={draft.minPrice?.toString() ?? ''}
                onChangeText={text => update({ minPrice: parsePrice(text) })}
                placeholder="Min"
                placeholderTextColor={colors.muted}
                accessibilityLabel="Minimum price"
                keyboardType="number-pad"
                style={styles.priceInput}
              />
              <Text style={styles.priceDash}>–</Text>
              <TextInput
                value={draft.maxPrice?.toString() ?? ''}
                onChangeText={text => update({ maxPrice: parsePrice(text) })}
                placeholder="Max"
                placeholderTextColor={colors.muted}
                accessibilityLabel="Maximum price"
                keyboardType="number-pad"
                style={styles.priceInput}
              />
            </View>
          </ScrollView>

          <View style={styles.sheetFooter}>
            <PrimaryButton
              label={
                count === 0 ? 'No results' : `Show ${plural(count, 'result')}`
              }
              onPress={() => onApply(draft)}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  searchRow: {
    flexDirection: 'row',
    gap: 10,
  },
  search: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 48,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: colors.offWhite,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.beige,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.charcoal,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.sand,
  },
  filterButtonOn: {
    backgroundColor: colors.primary,
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.white,
  },
  filterBadgeText: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: colors.primaryDark,
  },
  chipScroll: {
    flexGrow: 0,
    marginHorizontal: -SCREEN_PADDING,
  },
  chips: {
    paddingHorizontal: SCREEN_PADDING,
    gap: 8,
  },
  chip: {
    minHeight: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: '#E6DDCC',
  },
  chipOn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.charcoal,
  },
  chipTextOn: {
    color: colors.white,
  },
  resultsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultsCount: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.textMuted,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sortText: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.primary,
  },
  list: {
    flex: 1,
    marginHorizontal: -SCREEN_PADDING,
  },
  grid: {
    paddingHorizontal: SCREEN_PADDING,
    paddingTop: 4,
    paddingBottom: 24,
    gap: GRID_GAP,
    flexGrow: 1,
  },
  gridRow: {
    gap: GRID_GAP,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 6,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: fonts.semiBold,
    color: colors.charcoal,
  },
  emptyBody: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    textAlign: 'center',
  },
  sheetRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(17, 17, 17, 0.4)',
  },
  sheet: {
    maxHeight: '85%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: colors.white,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    marginTop: 8,
    backgroundColor: colors.beige,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  sheetTitle: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.charcoal,
  },
  reset: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: colors.primary,
  },
  sheetContent: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  sheetLabel: {
    marginTop: 18,
    marginBottom: 10,
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.charcoal,
  },
  wrapChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  priceInput: {
    flex: 1,
    minHeight: 48,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E6DDCC',
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.charcoal,
  },
  priceDash: {
    fontSize: 16,
    color: colors.textMuted,
  },
  sheetFooter: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  pressed: {
    opacity: 0.7,
  },
});

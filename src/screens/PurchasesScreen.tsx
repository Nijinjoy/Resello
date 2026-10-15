import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { OrderRow, type OrderTone } from '../components/OrderRow';
import { purchases, type PurchaseStatus } from '../data/orders';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { formatAED } from '../utils/money';
import { formatAgo } from '../utils/time';

type Filter = 'all' | 'inProgress' | 'completed';

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'inProgress', label: 'In progress' },
  { value: 'completed', label: 'Completed' },
];

const STATUS: Record<PurchaseStatus, { label: string; tone: OrderTone }> = {
  onTheWay: { label: 'On the way', tone: 'progress' },
  readyForPickup: { label: 'Ready for pickup', tone: 'ready' },
  completed: { label: 'Completed', tone: 'done' },
};

// Items the signed-in user has bought, newest first.
export function PurchasesScreen() {
  const [filter, setFilter] = useState<Filter>('all');
  const shown = purchases.filter(order =>
    filter === 'all'
      ? true
      : filter === 'completed'
      ? order.status === 'completed'
      : order.status !== 'completed',
  );
  const spent = purchases.reduce((sum, order) => sum + order.price, 0);

  return (
    <View style={styles.container}>
      <FlatList
        data={shown}
        keyExtractor={order => order.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.summary}>
              {`${purchases.length} orders · ${formatAED(spent)} spent`}
            </Text>
            <View style={styles.filters}>
              {FILTERS.map(option => {
                const selected = filter === option.value;
                return (
                  <Pressable
                    key={option.value}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => setFilter(option.value)}
                    style={[styles.chip, selected && styles.chipOn]}
                  >
                    <Text
                      style={[styles.chipText, selected && styles.chipTextOn]}
                      maxFontSizeMultiplier={1.3}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <OrderRow
            title={item.title}
            price={item.price}
            category={item.category}
            image={item.image}
            party={`Seller: ${item.sellerName}`}
            date={`Ordered ${formatAgo(item.minutesAgo).toLowerCase()}`}
            status={STATUS[item.status].label}
            tone={STATUS[item.status].tone}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No orders here</Text>
            <Text style={styles.emptyBody}>
              Things you buy on Resello will show up here.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.offWhite,
  },
  list: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 32,
    gap: 12,
  },
  header: {
    gap: 12,
    marginBottom: 2,
  },
  summary: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.textMuted,
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    minHeight: 34,
    paddingHorizontal: 14,
    borderRadius: 17,
    justifyContent: 'center',
    backgroundColor: colors.sand,
  },
  chipOn: {
    backgroundColor: colors.primary,
  },
  chipText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.charcoal,
  },
  chipTextOn: {
    color: colors.white,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 6,
  },
  emptyTitle: {
    fontSize: 17,
    fontFamily: fonts.semiBold,
    color: colors.ink,
  },
  emptyBody: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    textAlign: 'center',
  },
});

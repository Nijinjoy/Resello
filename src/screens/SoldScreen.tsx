import { FlatList, StyleSheet, Text, View } from 'react-native';
import { OrderRow, type OrderTone } from '../components/OrderRow';
import { sales, type SaleStatus } from '../data/orders';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { formatAED } from '../utils/money';
import { formatAgo } from '../utils/time';

const STATUS: Record<SaleStatus, { label: string; tone: OrderTone }> = {
  payoutPending: { label: 'Payout pending', tone: 'progress' },
  paidOut: { label: 'Paid out', tone: 'done' },
};

// Items the signed-in user has sold, with payout status, newest first.
export function SoldScreen() {
  const earned = sales.reduce((sum, sale) => sum + sale.price, 0);
  const pending = sales
    .filter(sale => sale.status === 'payoutPending')
    .reduce((sum, sale) => sum + sale.price, 0);

  return (
    <View style={styles.container}>
      <FlatList
        data={sales}
        keyExtractor={sale => sale.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.stats}>
            <Stat label="Items sold" value={String(sales.length)} />
            <Stat label="Earned" value={formatAED(earned)} />
            <Stat label="Pending" value={formatAED(pending)} />
          </View>
        }
        renderItem={({ item }) => (
          <OrderRow
            title={item.title}
            price={item.price}
            category={item.category}
            image={item.image}
            party={`Buyer: ${item.buyerName}`}
            date={`Sold ${formatAgo(item.minutesAgo).toLowerCase()}`}
            status={STATUS[item.status].label}
            tone={STATUS[item.status].tone}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No sales yet</Text>
            <Text style={styles.emptyBody}>
              Items you sell will show up here with their payout status.
            </Text>
          </View>
        }
      />
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
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
  stats: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 2,
  },
  stat: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    backgroundColor: colors.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.beige,
  },
  statValue: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.ink,
  },
  statLabel: {
    marginTop: 2,
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.textMuted,
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

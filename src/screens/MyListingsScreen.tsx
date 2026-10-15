import { useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Svg, { Circle, Path } from 'react-native-svg';
import { CategoryIcon } from '../components/CategoryIcon';
import { initialMyListings, type MyListing } from '../data/myListings';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { formatAED } from '../utils/money';
import { formatAgo } from '../utils/time';

const SOLD_GREEN = '#1F8A4C';

type Filter = MyListing['status'];

type Props = NativeStackScreenProps<RootStackParamList, 'MyListings'>;

// The signed-in user's listings: what's for sale, how it's doing, and what
// has sold. Changes stay on this screen until the listings backend exists.
export function MyListingsScreen({ navigation }: Props) {
  const [items, setItems] = useState(initialMyListings);
  const [filter, setFilter] = useState<Filter>('active');

  const active = items.filter(item => item.status === 'active');
  const sold = items.filter(item => item.status === 'sold');
  const shown = filter === 'active' ? active : sold;
  const totalViews = active.reduce((sum, item) => sum + item.views, 0);
  const earned = sold.reduce((sum, item) => sum + item.price, 0);

  const setStatus = (id: string, status: Filter) =>
    setItems(current =>
      current.map(item =>
        item.id === id ? { ...item, status, minutesAgo: 0 } : item,
      ),
    );

  const markSold = (item: MyListing) =>
    Alert.alert('Mark as sold?', `${item.title} will move to Sold.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Mark as sold', onPress: () => setStatus(item.id, 'sold') },
    ]);

  const remove = (item: MyListing) =>
    Alert.alert('Delete listing?', `${item.title} will be removed.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () =>
          setItems(current => current.filter(other => other.id !== item.id)),
      },
    ]);

  const goToSell = () =>
    navigation.popTo('Dashboard', { screen: 'Sell' }, { merge: true });

  return (
    <View style={styles.container}>
      <FlatList
        data={shown}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.stats}>
              <Stat label="Active" value={String(active.length)} />
              <Stat label="Views" value={totalViews.toLocaleString('en-US')} />
              <Stat label="Earned" value={formatAED(earned)} />
            </View>
            <View style={styles.filters}>
              {(['active', 'sold'] as const).map(value => {
                const selected = filter === value;
                const count = value === 'active' ? active.length : sold.length;
                return (
                  <Pressable
                    key={value}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => setFilter(value)}
                    style={[styles.chip, selected && styles.chipOn]}
                  >
                    <Text
                      style={[styles.chipText, selected && styles.chipTextOn]}
                      maxFontSizeMultiplier={1.3}
                    >
                      {`${value === 'active' ? 'Active' : 'Sold'} (${count})`}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <ListingRow
            item={item}
            onEdit={() =>
              navigation.navigate('ComingSoon', { title: 'Edit listing' })
            }
            onMarkSold={() => markSold(item)}
            onRelist={() => setStatus(item.id, 'active')}
            onDelete={() => remove(item)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>
              {filter === 'active' ? 'Nothing for sale yet' : 'No sales yet'}
            </Text>
            <Text style={styles.emptyBody}>
              {filter === 'active'
                ? 'Post an item and it will show up here.'
                : 'Items you sell will show up here.'}
            </Text>
          </View>
        }
        ListFooterComponent={
          filter === 'active' ? (
            <Pressable
              accessibilityRole="button"
              onPress={goToSell}
              style={({ pressed }) => [
                styles.newButton,
                pressed && styles.pressed,
              ]}
            >
              <Svg width={18} height={18} viewBox="0 0 24 24">
                <Path
                  d="M12 5v14M5 12h14"
                  stroke={colors.white}
                  strokeWidth={2.2}
                  strokeLinecap="round"
                />
              </Svg>
              <Text style={styles.newButtonText}>Post a new item</Text>
            </Pressable>
          ) : undefined
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

function ListingRow({
  item,
  onEdit,
  onMarkSold,
  onRelist,
  onDelete,
}: {
  item: MyListing;
  onEdit: () => void;
  onMarkSold: () => void;
  onRelist: () => void;
  onDelete: () => void;
}) {
  const isSold = item.status === 'sold';
  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.thumb}>
          {item.image ? (
            <Image
              source={item.image}
              style={[styles.thumbImage, isSold && styles.faded]}
              accessibilityIgnoresInvertColors
            />
          ) : (
            <CategoryIcon category={item.category} size={30} />
          )}
          {isSold && (
            <View style={styles.soldTag}>
              <Text style={styles.soldTagText}>SOLD</Text>
            </View>
          )}
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={[styles.price, isSold && styles.priceSold]}>
            {formatAED(item.price)}
          </Text>
          <Text style={styles.meta}>
            {`${isSold ? 'Sold' : 'Posted'} ${formatAgo(
              item.minutesAgo,
            ).toLowerCase()} · ${item.condition}`}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Delete ${item.title}`}
          onPress={onDelete}
          hitSlop={8}
          style={({ pressed }) => [
            styles.iconButton,
            pressed && styles.pressed,
          ]}
        >
          <Svg width={18} height={18} viewBox="0 0 24 24">
            <Path
              d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"
              fill="none"
              stroke={colors.textMuted}
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </Pressable>
      </View>

      <View style={styles.insights}>
        <Insight icon="eye" value={item.views} label="views" />
        <Insight icon="heart" value={item.saves} label="saves" />
        <Insight icon="chat" value={item.chats} label="chats" />
      </View>

      <View style={styles.actions}>
        {isSold ? (
          <ActionButton label="Relist" onPress={onRelist} primary />
        ) : (
          <>
            <ActionButton label="Edit" onPress={onEdit} />
            <ActionButton label="Mark as sold" onPress={onMarkSold} primary />
          </>
        )}
      </View>
    </View>
  );
}

function Insight({
  icon,
  value,
  label,
}: {
  icon: 'eye' | 'heart' | 'chat';
  value: number;
  label: string;
}) {
  const stroke = {
    fill: 'none',
    stroke: colors.textMuted,
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  return (
    <View
      style={styles.insight}
      accessible
      accessibilityLabel={`${value} ${label}`}
    >
      <Svg width={16} height={16} viewBox="0 0 24 24">
        {icon === 'eye' && (
          <>
            <Path
              d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"
              {...stroke}
            />
            <Circle cx={12} cy={12} r={3} {...stroke} />
          </>
        )}
        {icon === 'heart' && (
          <Path
            d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"
            {...stroke}
          />
        )}
        {icon === 'chat' && <Path d="M4 5h16v11H9l-5 4V5z" {...stroke} />}
      </Svg>
      <Text style={styles.insightText}>{`${value} ${label}`}</Text>
    </View>
  );
}

function ActionButton({
  label,
  onPress,
  primary,
}: {
  label: string;
  onPress: () => void;
  primary?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.action,
        primary && styles.actionPrimary,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.actionText, primary && styles.actionTextPrimary]}>
        {label}
      </Text>
    </Pressable>
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
    gap: 14,
    marginBottom: 2,
  },
  stats: {
    flexDirection: 'row',
    gap: 10,
  },
  stat: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
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
  card: {
    padding: 12,
    gap: 12,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#EFE7D8',
  },
  cardTop: {
    flexDirection: 'row',
    gap: 12,
  },
  thumb: {
    width: 84,
    height: 84,
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.sand,
  },
  thumbImage: {
    width: 84,
    height: 84,
  },
  faded: {
    opacity: 0.55,
  },
  soldTag: {
    position: 'absolute',
    left: 6,
    bottom: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: SOLD_GREEN,
  },
  soldTagText: {
    fontSize: 10,
    fontFamily: fonts.bold,
    letterSpacing: 0.6,
    color: colors.white,
  },
  cardBody: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: fonts.semiBold,
    color: colors.ink,
  },
  price: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  priceSold: {
    color: colors.textMuted,
  },
  meta: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insights: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.beige,
  },
  insight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  insightText: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.charcoal,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  action: {
    flex: 1,
    minHeight: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  actionPrimary: {
    backgroundColor: colors.primary,
  },
  actionText: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.primary,
  },
  actionTextPrimary: {
    color: colors.white,
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 50,
    marginTop: 4,
    borderRadius: 25,
    backgroundColor: colors.primary,
  },
  newButtonText: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
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
  pressed: {
    opacity: 0.75,
  },
});

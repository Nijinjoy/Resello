import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import { PrimaryButton } from '../components/Button';
import { CategoryIcon } from '../components/CategoryIcon';
import { EmptyCart } from '../components/EmptyCart';
import { PLATFORM_FEE, type CartItem } from '../data/cart';
import { useCart } from '../state/cart';
import { useFavorites } from '../state/favorites';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { avatarColor, initials } from '../utils/avatar';
import { formatAED } from '../utils/money';
import { TabScreen, useTabScroll } from './TabScreen';

const DANGER = '#C2410C';
const UNDO_TIMEOUT = 4000;

type SellerGroup = {
  sellerName: string;
  area: string;
  items: CartItem[];
};

function groupBySeller(items: CartItem[]): SellerGroup[] {
  const groups = new Map<string, SellerGroup>();
  for (const item of items) {
    const group = groups.get(item.sellerName) ?? {
      sellerName: item.sellerName,
      area: item.area,
      items: [],
    };
    group.items.push(item);
    groups.set(item.sellerName, group);
  }
  return [...groups.values()];
}

const plural = (count: number, word: string) =>
  `${count} ${word}${count === 1 ? '' : 's'}`;

export function CartScreen() {
  const navigation = useNavigation();
  const { scrolled, onScroll } = useTabScroll();
  const { items, setItems } = useCart();
  const { count: favoritesCount } = useFavorites();
  // Last removal, kept briefly so it can be undone.
  const [removed, setRemoved] = useState<{
    previous: CartItem[];
    label: string;
  }>();

  useEffect(() => {
    if (!removed) {
      return;
    }
    const timer = setTimeout(() => setRemoved(undefined), UNDO_TIMEOUT);
    return () => clearTimeout(timer);
  }, [removed]);

  const available = items.filter(item => !item.sold);
  const unavailable = items.filter(item => item.sold);
  const groups = groupBySeller(available);

  const subtotal = available.reduce((sum, item) => sum + item.price, 0);
  const platformFee = available.length > 0 ? PLATFORM_FEE : 0;
  const total = subtotal + platformFee;

  const removeItems = (toRemove: CartItem[], label: string) => {
    const ids = new Set(toRemove.map(item => item.id));
    setRemoved({ previous: items, label });
    setItems(current => current.filter(item => !ids.has(item.id)));
  };

  const undo = () => {
    if (removed) {
      setItems(removed.previous);
      setRemoved(undefined);
    }
  };

  const goToChats = () => navigation.navigate('Chats' as never);

  // No orders backend yet.
  const checkout = () =>
    Alert.alert(
      'Checkout coming soon',
      `Your order of ${formatAED(total)} will be placed here.`,
    );

  const undoToast = removed && (
    <View style={styles.toast} accessibilityLiveRegion="polite">
      <Text style={styles.toastText} numberOfLines={1}>
        {removed.label}
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={undo}
        hitSlop={8}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <Text style={styles.toastAction}>Undo</Text>
      </Pressable>
    </View>
  );

  if (items.length === 0) {
    return (
      <TabScreen scrolled={scrolled}>
        <EmptyCart
          onExplore={() => navigation.navigate('Explore' as never)}
          favoritesCount={favoritesCount}
          onFavorites={() => navigation.navigate('Favorites' as never)}
        />
        {undoToast}
      </TabScreen>
    );
  }

  return (
    <TabScreen scrolled={scrolled}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {unavailable.length > 0 && (
          <View style={styles.notice}>
            <AlertIcon />
            <Text style={styles.noticeText}>
              {`${plural(unavailable.length, 'item')} sold out and ${
                unavailable.length === 1 ? "isn't" : "aren't"
              } included in your total.`}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Remove sold out items"
              onPress={() =>
                removeItems(
                  unavailable,
                  `Removed ${plural(unavailable.length, 'sold out item')}`,
                )
              }
              hitSlop={8}
              style={({ pressed }) => pressed && styles.pressed}
            >
              <Text style={styles.noticeAction}>Remove</Text>
            </Pressable>
          </View>
        )}

        {groups.map(group => (
          <View key={group.sellerName} style={styles.card}>
            <View style={styles.sellerRow}>
              <View
                style={[
                  styles.sellerAvatar,
                  { backgroundColor: avatarColor(group.sellerName) },
                ]}
              >
                <Text style={styles.sellerInitials}>
                  {initials(group.sellerName)}
                </Text>
              </View>
              <View style={styles.sellerText}>
                <Text style={styles.sellerName} numberOfLines={1}>
                  {group.sellerName}
                </Text>
                <Text style={styles.sellerArea} numberOfLines={1}>
                  {`Pickup in ${group.area}`}
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Message ${group.sellerName}`}
                onPress={goToChats}
                style={({ pressed }) => [
                  styles.messageButton,
                  pressed && styles.pressed,
                ]}
              >
                <Svg width={16} height={16} viewBox="0 0 24 24">
                  <Path
                    d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.1A8 8 0 1 1 20 12z"
                    fill="none"
                    stroke={colors.primary}
                    strokeWidth={2}
                    strokeLinejoin="round"
                  />
                </Svg>
                <Text style={styles.messageText}>Message</Text>
              </Pressable>
            </View>

            {group.items.map(item => (
              <ItemRow
                key={item.id}
                item={item}
                onRemove={() => removeItems([item], `Removed ${item.title}`)}
              />
            ))}
          </View>
        ))}

        {unavailable.length > 0 && (
          <View style={[styles.card, styles.cardMuted]}>
            <Text style={styles.cardTitle}>Sold out</Text>
            {unavailable.map(item => (
              <ItemRow
                key={item.id}
                item={item}
                onRemove={() => removeItems([item], `Removed ${item.title}`)}
              />
            ))}
          </View>
        )}

        {available.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Order summary</Text>
            <SummaryLine
              label={`Items (${available.length})`}
              value={formatAED(subtotal)}
            />
            <SummaryLine
              label="Platform fee"
              hint="Per order, buyer protection included"
              value={formatAED(platformFee)}
            />
            <SummaryLine label="Delivery" value="Arranged with seller" muted />
            <View style={styles.divider} />
            <View style={styles.totalLine}>
              <Text style={styles.totalLineLabel}>Total</Text>
              <Text style={styles.totalLineValue}>{formatAED(total)}</Text>
            </View>
          </View>
        )}

        <View style={styles.trust}>
          <ShieldIcon />
          <View style={styles.trustText}>
            <Text style={styles.trustTitle}>Protected purchase</Text>
            <Text style={styles.trustBody}>
              Get a full refund if an item isn't as described. Pay only when
              you've seen it.
            </Text>
          </View>
        </View>
      </ScrollView>

      {undoToast}

      {available.length > 0 && (
        <View style={styles.checkoutBar}>
          <View>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue} accessibilityLiveRegion="polite">
              {formatAED(total)}
            </Text>
          </View>
          <View style={styles.checkoutButton}>
            <PrimaryButton
              label={`Checkout (${available.length})`}
              onPress={checkout}
            />
          </View>
        </View>
      )}
    </TabScreen>
  );
}

function ItemRow({ item, onRemove }: { item: CartItem; onRemove: () => void }) {
  return (
    <View style={styles.item}>
      <View style={[styles.thumb, item.sold && styles.faded]}>
        {item.image ? (
          <Image source={item.image} style={styles.thumbImage} />
        ) : (
          <CategoryIcon category={item.category} size={30} />
        )}
      </View>
      <View style={styles.itemBody}>
        <Text
          style={[styles.itemTitle, item.sold && styles.faded]}
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <View style={styles.itemMeta}>
          {item.sold ? (
            <View style={[styles.tag, styles.tagSold]}>
              <Text style={[styles.tagText, styles.tagSoldText]}>Sold out</Text>
            </View>
          ) : (
            <View style={styles.tag}>
              <Text style={styles.tagText}>{item.condition}</Text>
            </View>
          )}
        </View>
        <View style={styles.itemBottom}>
          <Text style={[styles.price, item.sold && styles.priceSold]}>
            {formatAED(item.price)}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Remove ${item.title}`}
            onPress={onRemove}
            hitSlop={10}
            style={({ pressed }) => [styles.remove, pressed && styles.pressed]}
          >
            <Svg width={15} height={15} viewBox="0 0 24 24">
              <Path
                d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"
                fill="none"
                stroke={colors.textMuted}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text style={styles.removeText}>Remove</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function SummaryLine({
  label,
  hint,
  value,
  muted,
}: {
  label: string;
  hint?: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <View style={styles.summaryLine}>
      <View style={styles.summaryText}>
        <Text style={styles.summaryLabel}>{label}</Text>
        {hint && <Text style={styles.summaryHint}>{hint}</Text>}
      </View>
      <Text style={[styles.summaryValue, muted && styles.summaryMuted]}>
        {value}
      </Text>
    </View>
  );
}

function AlertIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      <Path
        d="M12 3 2 20h20L12 3zM12 10v4M12 17h.01"
        fill="none"
        stroke={DANGER}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ShieldIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24">
      <Path
        d="M12 3 4.5 6v5.5c0 4.5 3.2 8.4 7.5 9.5 4.3-1.1 7.5-5 7.5-9.5V6L12 3z"
        fill="none"
        stroke={colors.primary}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <Path
        d="m8.8 12.2 2.2 2.2 4.3-4.6"
        fill="none"
        stroke={colors.primary}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    marginHorizontal: -16,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 24,
    gap: 14,
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#FBE9E1',
  },
  noticeText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.medium,
    color: '#7C2D12',
  },
  noticeAction: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: DANGER,
  },
  card: {
    padding: 14,
    gap: 14,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#EFE7D8',
    shadowColor: colors.ink,
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  cardMuted: {
    backgroundColor: colors.offWhite,
    shadowOpacity: 0,
    elevation: 0,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: colors.charcoal,
  },
  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.beige,
  },
  sellerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sellerInitials: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.white,
  },
  sellerText: {
    flex: 1,
  },
  sellerName: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: colors.charcoal,
  },
  sellerArea: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 34,
    paddingHorizontal: 12,
    borderRadius: 17,
    backgroundColor: '#E6F0EC',
  },
  messageText: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.primary,
  },
  item: {
    flexDirection: 'row',
    gap: 12,
  },
  thumb: {
    width: 84,
    height: 84,
    borderRadius: 14,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.sand,
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  faded: {
    opacity: 0.5,
  },
  itemBody: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: fonts.semiBold,
    color: colors.charcoal,
  },
  itemMeta: {
    flexDirection: 'row',
    marginTop: 4,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: '#E6F0EC',
  },
  tagText: {
    fontSize: 12,
    fontFamily: fonts.semiBold,
    color: colors.primaryDark,
  },
  tagSold: {
    backgroundColor: '#FBE9E1',
  },
  tagSoldText: {
    color: DANGER,
  },
  itemBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  price: {
    fontSize: 17,
    fontFamily: fonts.bold,
    color: colors.ink,
  },
  priceSold: {
    color: colors.muted,
    textDecorationLine: 'line-through',
  },
  remove: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minHeight: 32,
  },
  removeText: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.textMuted,
  },
  summaryLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  summaryText: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.charcoal,
  },
  summaryHint: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  summaryValue: {
    fontSize: 15,
    fontFamily: fonts.medium,
    color: colors.charcoal,
  },
  summaryMuted: {
    color: colors.textMuted,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.beige,
  },
  totalLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLineLabel: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: colors.charcoal,
  },
  totalLineValue: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.ink,
  },
  trust: {
    flexDirection: 'row',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#EEF5F2',
  },
  trustText: {
    flex: 1,
    gap: 2,
  },
  trustTitle: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.primaryDark,
  },
  trustBody: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  toast: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 96,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: colors.charcoal,
    shadowColor: colors.ink,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  toastText: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.white,
  },
  toastAction: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.accent,
  },
  checkoutBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginHorizontal: -16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.beige,
    backgroundColor: colors.white,
  },
  totalLabel: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.textMuted,
  },
  totalValue: {
    fontSize: 22,
    fontFamily: fonts.bold,
    color: colors.ink,
  },
  checkoutButton: {
    flex: 1,
  },
  pressed: {
    opacity: 0.7,
  },
});

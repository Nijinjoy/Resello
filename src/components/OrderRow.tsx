import {
  Image,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
} from 'react-native';
import type { ItemCategory } from '../data/categories';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { formatAED } from '../utils/money';
import { CategoryIcon } from './CategoryIcon';

export type OrderTone = 'progress' | 'ready' | 'done';

const TONES: Record<OrderTone, { bg: string; fg: string }> = {
  progress: { bg: '#FBF1DD', fg: '#9A6B16' },
  ready: { bg: '#EAF0FB', fg: '#3B5BA9' },
  done: { bg: '#E3F4EA', fg: '#1F8A4C' },
};

type OrderRowProps = {
  title: string;
  price: number;
  category: ItemCategory;
  image?: ImageSourcePropType;
  // e.g. "Seller: Sara Mitchell".
  party: string;
  // e.g. "Ordered 2d ago".
  date: string;
  status: string;
  tone: OrderTone;
};

// One purchase or sale: photo, item, the other person, and its status.
export function OrderRow({
  title,
  price,
  category,
  image,
  party,
  date,
  status,
  tone,
}: OrderRowProps) {
  const colorsForTone = TONES[tone];
  return (
    <View
      style={styles.card}
      accessible
      accessibilityLabel={`${title}, ${formatAED(
        price,
      )}, ${status}. ${party}. ${date}`}
    >
      <View style={styles.thumb}>
        {image ? (
          <Image
            source={image}
            style={styles.thumbImage}
            accessibilityIgnoresInvertColors
          />
        ) : (
          <CategoryIcon category={category} size={28} />
        )}
      </View>
      <View style={styles.body}>
        <View style={styles.top}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.price}>{formatAED(price)}</Text>
        </View>
        <Text style={styles.meta} numberOfLines={1}>
          {party}
        </Text>
        <View style={styles.bottom}>
          <View style={[styles.status, { backgroundColor: colorsForTone.bg }]}>
            <Text style={[styles.statusText, { color: colorsForTone.fg }]}>
              {status}
            </Text>
          </View>
          <Text style={styles.date}>{date}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#EFE7D8',
  },
  thumb: {
    width: 76,
    height: 76,
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.sand,
  },
  thumbImage: {
    width: 76,
    height: 76,
  },
  body: {
    flex: 1,
    gap: 4,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: colors.ink,
  },
  price: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: colors.ink,
  },
  meta: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 2,
  },
  status: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontFamily: fonts.semiBold,
  },
  date: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
});

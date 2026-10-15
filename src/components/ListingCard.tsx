import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import type { Listing } from '../data/listings';
import { useFavorites } from '../state/favorites';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { formatAED } from '../utils/money';
import { formatAgo, formatDistance } from '../utils/time';
import { CategoryIcon } from './CategoryIcon';

const FAVORITE_RED = '#E5484D';

type ListingCardProps = {
  listing: Listing;
  width: number;
  onPress: () => void;
};

export function ListingCard({ listing, width, onPress }: ListingCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(listing.id);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${listing.title}, ${formatAED(listing.price)}, ${
        listing.condition
      }, ${listing.area}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { width },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.image}>
        {listing.images.length > 0 ? (
          <Image
            source={listing.images[0]}
            style={styles.photo}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
          />
        ) : (
          <CategoryIcon category={listing.category} size={40} />
        )}
        <View style={styles.conditionTag}>
          <Text style={styles.conditionText}>{listing.condition}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            favorite
              ? `Remove ${listing.title} from favorites`
              : `Save ${listing.title} to favorites`
          }
          accessibilityState={{ selected: favorite }}
          onPress={() => toggleFavorite(listing.id)}
          hitSlop={6}
          style={styles.heart}
        >
          <Svg width={18} height={18} viewBox="0 0 24 24">
            <Path
              d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"
              fill={favorite ? FAVORITE_RED : 'none'}
              stroke={favorite ? FAVORITE_RED : colors.charcoal}
              strokeWidth={2}
              strokeLinejoin="round"
            />
          </Svg>
        </Pressable>
      </View>
      <View style={styles.body}>
        <Text style={styles.price}>{formatAED(listing.price)}</Text>
        <Text style={styles.title} numberOfLines={1}>
          {listing.title}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {`${listing.area} · ${formatDistance(
            listing.distanceKm,
          )} · ${formatAgo(listing.minutesAgo)}`}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#EFE7D8',
    overflow: 'hidden',
  },
  image: {
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.sand,
  },
  photo: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  conditionTag: {
    position: 'absolute',
    left: 8,
    bottom: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
  },
  conditionText: {
    fontSize: 11,
    fontFamily: fonts.semiBold,
    color: colors.primaryDark,
  },
  heart: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
  },
  body: {
    padding: 10,
    gap: 2,
  },
  price: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.ink,
  },
  title: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.charcoal,
  },
  meta: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  pressed: {
    opacity: 0.75,
  },
});

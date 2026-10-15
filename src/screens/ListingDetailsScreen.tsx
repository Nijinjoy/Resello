import { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type ImageSourcePropType,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import { CategoryIcon } from '../components/CategoryIcon';
import { CATEGORIES } from '../data/categories';
import { listings } from '../data/listings';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { useCart } from '../state/cart';
import { useFavorites } from '../state/favorites';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { avatarColor, initials } from '../utils/avatar';
import { formatAED } from '../utils/money';
import { formatAgo, formatDistance } from '../utils/time';

const FAVORITE_RED = '#E5484D';
const SCREEN_PADDING = 16;

export function ListingDetailsScreen({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, 'ListingDetails'>) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { isInCart, addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const listing = listings.find(item => item.id === route.params.listingId);

  if (!listing) {
    return (
      <View style={[styles.missing, { paddingTop: insets.top }]}>
        <Text style={styles.missingTitle}>This item is no longer listed</Text>
        <Pressable
          accessibilityRole="button"
          onPress={navigation.goBack}
          style={({ pressed }) => [styles.primary, pressed && styles.pressed]}
        >
          <Text style={styles.primaryText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const favorite = isFavorite(listing.id);
  const inCart = isInCart(listing.id);
  const goToCart = () => navigation.navigate('Dashboard', { screen: 'Cart' });
  const handleCart = () =>
    inCart
      ? goToCart()
      : addToCart({
          id: listing.id,
          title: listing.title,
          price: listing.price,
          condition: listing.condition,
          category: listing.category,
          image: listing.images[0],
          sellerName: listing.sellerName,
          area: listing.area,
        });
  const category = CATEGORIES.find(c => c.value === listing.category);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {listing.images.length > 0 ? (
          <PhotoGallery
            images={listing.images}
            size={width}
            title={listing.title}
          />
        ) : (
          <View style={[styles.photoFrame, { width, height: width }]}>
            <CategoryIcon category={listing.category} size={72} />
          </View>
        )}

        <View style={styles.body}>
          <Text
            style={styles.title}
            accessibilityRole="header"
            maxFontSizeMultiplier={1.4}
          >
            {listing.title}
          </Text>
          <Text style={styles.price}>{formatAED(listing.price)}</Text>

          <View style={styles.chips}>
            <View style={[styles.chip, styles.chipAccent]}>
              <Text style={[styles.chipText, styles.chipAccentText]}>
                {listing.condition}
              </Text>
            </View>
            {category && (
              <View style={styles.chip}>
                <Text style={styles.chipText}>{category.label}</Text>
              </View>
            )}
          </View>

          <View style={styles.location}>
            <Svg width={18} height={18} viewBox="0 0 24 24">
              <Path
                d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"
                fill="none"
                stroke={colors.primary}
                strokeWidth={2}
                strokeLinejoin="round"
              />
              <Circle
                cx={12}
                cy={9.5}
                r={2.5}
                fill="none"
                stroke={colors.primary}
                strokeWidth={2}
              />
            </Svg>
            <Text style={styles.locationText}>
              {`${listing.area} · ${formatDistance(
                listing.distanceKm,
              )} away · Listed ${formatAgo(listing.minutesAgo).toLowerCase()}`}
            </Text>
          </View>

          <View style={styles.seller}>
            <View
              style={[
                styles.avatar,
                { backgroundColor: avatarColor(listing.sellerName) },
              ]}
            >
              <Text style={styles.avatarText} maxFontSizeMultiplier={1.2}>
                {initials(listing.sellerName)}
              </Text>
            </View>
            <View style={styles.sellerBody}>
              <Text style={styles.sellerName} numberOfLines={1}>
                {listing.sellerName}
              </Text>
              <Text style={styles.sellerMeta} numberOfLines={1}>
                {`Seller · ${listing.area}`}
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Chat with ${listing.sellerName}`}
              onPress={() =>
                navigation.navigate('Chat', {
                  listingId: listing.id,
                  sellerName: listing.sellerName,
                })
              }
              style={({ pressed }) => [
                styles.chatButton,
                pressed && styles.pressed,
              ]}
            >
              <Svg width={18} height={18} viewBox="0 0 24 24">
                <Path
                  d="M4 5h16v11H9l-5 4V5z"
                  fill="none"
                  stroke={colors.primary}
                  strokeWidth={2}
                  strokeLinejoin="round"
                />
              </Svg>
              <Text style={styles.chatButtonText}>Chat</Text>
            </Pressable>
          </View>

          {listing.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{listing.description}</Text>
            </View>
          )}

          <View style={styles.protection}>
            <Text style={styles.protectionTitle}>Buyer protection</Text>
            <Text style={styles.protectionBody}>
              Full refund if the item isn't as described.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Floating over the photo, below the status bar. */}
      <View
        style={[styles.topBar, { top: insets.top + 8 }]}
        pointerEvents="box-none"
      >
        <RoundButton label="Back" onPress={navigation.goBack}>
          <Path
            d="M15 5l-7 7 7 7"
            fill="none"
            stroke={colors.charcoal}
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </RoundButton>
        <RoundButton
          label={
            favorite
              ? `Remove ${listing.title} from favorites`
              : `Save ${listing.title} to favorites`
          }
          selected={favorite}
          onPress={() => toggleFavorite(listing.id)}
        >
          <Path
            d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"
            fill={favorite ? FAVORITE_RED : 'none'}
            stroke={favorite ? FAVORITE_RED : colors.charcoal}
            strokeWidth={2}
            strokeLinejoin="round"
          />
        </RoundButton>
      </View>

      <View style={[styles.actionBar, { paddingBottom: insets.bottom + 12 }]}>
        <View style={styles.actionPrice}>
          <Text style={styles.actionPriceLabel}>Price</Text>
          <Text style={styles.actionPriceValue}>
            {formatAED(listing.price)}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityHint={inCart ? 'Opens your cart' : undefined}
          onPress={handleCart}
          style={({ pressed }) => [
            styles.primary,
            styles.actionButton,
            inCart && styles.inCart,
            pressed && styles.pressed,
          ]}
        >
          <Svg width={20} height={20} viewBox="0 0 24 24">
            {inCart ? (
              <Path
                d="M5 12.5l4.5 4.5L19 7.5"
                fill="none"
                stroke={colors.primary}
                strokeWidth={2.4}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              <Path
                d="M3 4h2l2.4 11h10.2L20 8H6.3M10 20h.01M17 20h.01"
                fill="none"
                stroke={colors.white}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </Svg>
          <Text style={[styles.primaryText, inCart && styles.inCartText]}>
            {inCart ? 'In cart · View' : 'Add to cart'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

// Swipeable full-width photos with dots over the bottom edge.
function PhotoGallery({
  images,
  size,
  title,
}: {
  images: ImageSourcePropType[];
  size: number;
  title: string;
}) {
  const [index, setIndex] = useState(0);
  const handleMomentumEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const settled = Math.round(event.nativeEvent.contentOffset.x / size);
    setIndex(Math.min(Math.max(settled, 0), images.length - 1));
  };

  return (
    <View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumEnd}
        style={[styles.gallery, { width: size, height: size }]}
      >
        {images.map((source, photoIndex) => (
          <Image
            key={photoIndex}
            source={source}
            style={{ width: size, height: size }}
            resizeMode="cover"
            accessible
            accessibilityLabel={`${title}, photo ${photoIndex + 1} of ${
              images.length
            }`}
            accessibilityIgnoresInvertColors
          />
        ))}
      </ScrollView>
      {images.length > 1 && (
        <View
          style={styles.dots}
          pointerEvents="none"
          accessible
          accessibilityLabel={`Photo ${index + 1} of ${images.length}`}
        >
          {images.map((_, dotIndex) => (
            <View
              key={dotIndex}
              style={[styles.dot, dotIndex === index && styles.dotActive]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

function RoundButton({
  label,
  selected,
  onPress,
  children,
}: {
  label: string;
  selected?: boolean;
  onPress: () => void;
  children: React.ReactNode;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={selected === undefined ? undefined : { selected }}
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => [styles.roundButton, pressed && styles.pressed]}
    >
      <Svg width={22} height={22} viewBox="0 0 24 24">
        {children}
      </Svg>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scroll: {
    paddingBottom: 24,
  },
  photoFrame: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.sand,
  },
  gallery: {
    backgroundColor: colors.sand,
  },
  dots: {
    position: 'absolute',
    bottom: 14,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
  },
  dotActive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.white,
  },
  body: {
    padding: SCREEN_PADDING,
    gap: 12,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontFamily: fonts.bold,
    color: colors.ink,
  },
  price: {
    marginTop: -6,
    fontSize: 22,
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: colors.offWhite,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.beige,
  },
  chipAccent: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.charcoal,
  },
  chipAccentText: {
    color: colors.white,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  section: {
    gap: 6,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.beige,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: colors.ink,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: fonts.regular,
    color: colors.charcoal,
  },
  seller: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.beige,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: colors.white,
  },
  sellerBody: {
    flex: 1,
  },
  sellerName: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: colors.ink,
  },
  sellerMeta: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 40,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  chatButtonText: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: colors.primary,
  },
  protection: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: colors.sand,
    gap: 2,
  },
  protectionTitle: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.primaryDark,
  },
  protectionBody: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  topBar: {
    position: 'absolute',
    left: SCREEN_PADDING,
    right: SCREEN_PADDING,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roundButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingTop: 12,
    paddingHorizontal: SCREEN_PADDING,
    backgroundColor: colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.beige,
  },
  actionPrice: {
    flexShrink: 1,
  },
  actionPriceLabel: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  actionPriceValue: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.ink,
  },
  primary: {
    minHeight: 50,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
  inCart: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  inCartText: {
    color: colors.primary,
  },
  primaryText: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: colors.white,
  },
  missing: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 24,
    backgroundColor: colors.white,
  },
  missingTitle: {
    fontSize: 18,
    fontFamily: fonts.semiBold,
    color: colors.ink,
  },
  pressed: {
    opacity: 0.75,
  },
});

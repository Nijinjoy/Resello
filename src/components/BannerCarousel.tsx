import { useEffect, useRef, useState, type ComponentRef } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type ImageSourcePropType,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { PaginationDots } from './PaginationDots';

const AUTOPLAY_INTERVAL = 4000;
const SCREEN_PADDING = 16;
const BANNER_HEIGHT = 168;

export type Banner = {
  id: string;
  eyebrow: string;
  title: string;
  cta: string;
  // Background photo; the left side is tinted so the text stays readable.
  image: ImageSourcePropType;
  tone: 'green' | 'charcoal' | 'teal';
  onPress: () => void;
};

const TONES = {
  green: {
    tint: colors.primaryDark,
    eyebrow: colors.accent,
    button: colors.accent,
    buttonText: colors.primaryDark,
  },
  charcoal: {
    tint: colors.charcoal,
    eyebrow: colors.accent,
    button: colors.white,
    buttonText: colors.charcoal,
  },
  teal: {
    tint: colors.primary,
    eyebrow: '#CDE8DF',
    button: colors.white,
    buttonText: colors.primary,
  },
};

// Swipeable promo banners that advance on their own. Autoplay pauses while
// the user is swiping, when the tab isn't visible, and with Reduce Motion on.
export function BannerCarousel({ banners }: { banners: Banner[] }) {
  const { width } = useWindowDimensions();
  // Each page spans the full screen with the card inset inside it, so native
  // paging always settles on whole pages and neighbours never peek in.
  const cardWidth = width - SCREEN_PADDING * 2;
  const page = width;
  const scrollRef = useRef<ComponentRef<typeof Animated.ScrollView>>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [index, setIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduceMotion,
    );
    return () => subscription.remove();
  }, []);

  // Restarts whenever the page changes, so a manual swipe gets a full
  // interval before the next automatic one.
  useEffect(() => {
    if (dragging || !isFocused || reduceMotion || banners.length < 2) {
      return;
    }
    const timer = setTimeout(() => {
      const next = (index + 1) % banners.length;
      scrollRef.current?.scrollTo({ x: next * page, animated: true });
      setIndex(next);
    }, AUTOPLAY_INTERVAL);
    return () => clearTimeout(timer);
  }, [index, dragging, isFocused, reduceMotion, banners.length, page]);

  const handleMomentumEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const settled = Math.round(event.nativeEvent.contentOffset.x / page);
    setIndex(Math.min(Math.max(settled, 0), banners.length - 1));
    setDragging(false);
  };

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        style={styles.scroll}
        onScrollBeginDrag={() => setDragging(true)}
        onMomentumScrollEnd={handleMomentumEnd}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
      >
        {banners.map(banner => (
          <View key={banner.id} style={[styles.page, { width: page }]}>
            <BannerCard banner={banner} width={cardWidth} />
          </View>
        ))}
      </Animated.ScrollView>
      <PaginationDots
        count={banners.length}
        activeIndex={index}
        scrollX={scrollX}
        pageWidth={page}
        accessibilityLabel={`Banner ${index + 1} of ${banners.length}`}
      />
    </View>
  );
}

function BannerCard({ banner, width }: { banner: Banner; width: number }) {
  const tone = TONES[banner.tone];
  const gradientId = `banner-tint-${banner.id}`;
  return (
    <View style={[styles.card, { width, backgroundColor: tone.tint }]}>
      <Image
        source={banner.image}
        style={[styles.photo, { width, height: BANNER_HEIGHT }]}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
      />
      <Svg style={styles.overlay} width={width} height={BANNER_HEIGHT}>
        <Defs>
          <LinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor={tone.tint} stopOpacity={0.94} />
            <Stop offset="0.55" stopColor={tone.tint} stopOpacity={0.6} />
            <Stop offset="1" stopColor={tone.tint} stopOpacity={0.05} />
          </LinearGradient>
        </Defs>
        <Rect
          width={width}
          height={BANNER_HEIGHT}
          fill={`url(#${gradientId})`}
        />
      </Svg>
      <View style={styles.text}>
        <Text
          style={[styles.eyebrow, { color: tone.eyebrow }]}
          numberOfLines={1}
        >
          {banner.eyebrow}
        </Text>
        <Text
          style={styles.title}
          numberOfLines={2}
          maxFontSizeMultiplier={1.3}
        >
          {banner.title}
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={banner.onPress}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: tone.button },
            pressed && styles.pressed,
          ]}
        >
          <Text style={[styles.buttonText, { color: tone.buttonText }]}>
            {banner.cta}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  scroll: {
    marginHorizontal: -SCREEN_PADDING,
  },
  page: {
    paddingHorizontal: SCREEN_PADDING,
  },
  card: {
    justifyContent: 'center',
    height: BANNER_HEIGHT,
    borderRadius: 22,
    overflow: 'hidden',
  },
  // Sized to the card in pixels: percentage sizes would resolve inside
  // padding and leave a gap.
  photo: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  text: {
    width: '72%',
    padding: 18,
    alignItems: 'flex-start',
    gap: 4,
  },
  eyebrow: {
    fontSize: 12,
    fontFamily: fonts.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 19,
    lineHeight: 25,
    fontFamily: fonts.bold,
    color: colors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  button: {
    marginTop: 10,
    minHeight: 38,
    paddingHorizontal: 16,
    borderRadius: 19,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
  },
  pressed: {
    opacity: 0.75,
  },
});

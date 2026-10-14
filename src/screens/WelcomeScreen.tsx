import { useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import {
  discoverIllustration,
  greenerIllustration,
  sellIllustration,
} from '../components/illustrations/welcomeIllustrations';
import { PaginationDots } from '../components/PaginationDots';
import { useLanguage } from '../i18n/LanguageContext';
import type { OnboardingPageCopy } from '../i18n/strings';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

const ILLUSTRATIONS = [
  discoverIllustration,
  sellIllustration,
  greenerIllustration,
];
const PAGE_COUNT = ILLUSTRATIONS.length;

type PageProps = {
  index: number;
  copy: OnboardingPageCopy;
  scrollX: Animated.Value;
  pageWidth: number;
  imageSize: number;
  isRTL: boolean;
};

function OnboardingPage({
  index,
  copy,
  scrollX,
  pageWidth,
  imageSize,
  isRTL,
}: PageProps) {
  // Illustration and text swipe together with the page as one unit; they
  // only share a soft fade as they leave and enter.
  const opacity = scrollX.interpolate({
    inputRange: [
      (index - 1) * pageWidth,
      index * pageWidth,
      (index + 1) * pageWidth,
    ],
    outputRange: [0.3, 1, 0.3],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[
        styles.page,
        isRTL ? styles.rtl : styles.ltr,
        { width: pageWidth, opacity },
      ]}
    >
      <View
        style={{ width: imageSize, height: imageSize }}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <SvgXml xml={ILLUSTRATIONS[index]} width="100%" height="100%" />
      </View>
      <View style={styles.copy}>
        <Text
          style={[styles.eyebrow, !isRTL && styles.eyebrowLatin]}
          maxFontSizeMultiplier={1.4}
        >
          {copy.eyebrow}
        </Text>
        <Text
          style={styles.headline}
          accessibilityRole="header"
          maxFontSizeMultiplier={1.5}
        >
          {copy.headline}
        </Text>
        <Text style={styles.body} maxFontSizeMultiplier={1.7}>
          {copy.body}
        </Text>
      </View>
    </Animated.View>
  );
}

type WelcomeScreenProps = {
  onGetStarted?: () => void;
  onSignIn?: () => void;
};

export function WelcomeScreen({ onGetStarted, onSignIn }: WelcomeScreenProps) {
  const insets = useSafeAreaInsets();
  const { width, height, fontScale } = useWindowDimensions();
  const { t, isRTL } = useLanguage();
  // Square illustration, kept compact (about 60% of the screen width). It
  // shrinks further on short screens and with larger text so the copy and
  // buttons still fit.
  const imageSize = Math.max(
    140,
    Math.min(width * 0.62, height * 0.3 - (fontScale - 1) * 120),
  );
  const listRef = useRef<FlatList<OnboardingPageCopy>>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [scrollX] = useState(() => new Animated.Value(0));

  const isLastPage = pageIndex === PAGE_COUNT - 1;

  const goToPage = (index: number) => {
    setPageIndex(index);
    listRef.current?.scrollToIndex({ index, animated: true });
  };

  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    setPageIndex(Math.round(event.nativeEvent.contentOffset.x / width));
  };

  const handlePrimaryPress = () => {
    if (isLastPage) {
      onGetStarted?.();
    } else {
      goToPage(pageIndex + 1);
    }
  };

  return (
    <View
      style={[
        styles.container,
        isRTL ? styles.rtl : styles.ltr,
        {
          paddingTop: insets.top + 12,
          paddingBottom: Math.max(insets.bottom, 16) + 12,
        },
      ]}
    >
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        {!isLastPage && (
          <Pressable
            accessibilityRole="button"
            onPress={() => goToPage(PAGE_COUNT - 1)}
            style={({ pressed }) => [styles.skip, pressed && styles.pressed]}
          >
            <Text style={styles.skipLabel} maxFontSizeMultiplier={1.4}>
              {t.skip}
            </Text>
          </Pressable>
        )}
      </View>

      <Animated.FlatList
        ref={listRef}
        data={t.onboarding}
        keyExtractor={(_, index) => String(index)}
        horizontal
        pagingEnabled
        bounces={false}
        // Arabic pages run right-to-left. The list itself stays LTR and is
        // mirrored with `inverted`, which keeps offsets and scrollToIndex simple.
        inverted={isRTL}
        style={styles.pager}
        showsHorizontalScrollIndicator={false}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        renderItem={({ item, index }) => (
          <OnboardingPage
            index={index}
            copy={item}
            scrollX={scrollX}
            pageWidth={width}
            imageSize={imageSize}
            isRTL={isRTL}
          />
        )}
      />

      <View style={styles.footer}>
        <PaginationDots
          count={PAGE_COUNT}
          activeIndex={pageIndex}
          scrollX={scrollX}
          pageWidth={width}
          accessibilityLabel={t.pageOf(pageIndex + 1, PAGE_COUNT)}
        />
        <View style={styles.actions}>
          <PrimaryButton
            label={isLastPage ? t.getStarted : t.continue}
            onPress={handlePrimaryPress}
          />
          {/* Fixed-height slot so the layout doesn't jump when the link appears. */}
          <View style={styles.secondarySlot}>
            {isLastPage && (
              <SecondaryButton label={t.haveAccount} onPress={onSignIn} />
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.offWhite,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    minHeight: 44,
  },
  skip: {
    minWidth: 44,
    minHeight: 44,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipLabel: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: colors.charcoal,
  },
  pager: {
    flex: 1,
    direction: 'ltr',
  },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  copy: {
    marginTop: 32,
    alignItems: 'center',
  },
  eyebrow: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: colors.primary,
    textAlign: 'center',
  },
  eyebrowLatin: {
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  headline: {
    marginTop: 10,
    fontSize: 28,
    lineHeight: 36,
    fontFamily: fonts.bold,
    color: colors.charcoal,
    textAlign: 'center',
  },
  body: {
    marginTop: 12,
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 24,
    color: colors.textMuted,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 24,
    gap: 24,
  },
  actions: {
    gap: 4,
  },
  secondarySlot: {
    minHeight: 44,
  },
  pressed: {
    opacity: 0.7,
  },
  ltr: {
    direction: 'ltr',
  },
  rtl: {
    direction: 'rtl',
  },
});

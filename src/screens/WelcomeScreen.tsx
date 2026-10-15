import { useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import {
  discoverIllustration,
  greenerIllustration,
  sellIllustration,
} from '../components/illustrations/welcomeIllustrations';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

// Each illustration fades in together with its own text.
const SLIDES = [
  {
    illustration: discoverIllustration,
    title: 'Discover great deals',
    body: 'Quality pre-loved finds near you.',
  },
  {
    illustration: sellIllustration,
    title: 'Sell in minutes',
    body: 'Snap a photo, set a price, done.',
  },
  {
    illustration: greenerIllustration,
    title: 'Shop greener',
    body: 'Give great things a second life.',
  },
];
const ROTATE_INTERVAL = 3500;
const FADE_DURATION = 600;

type WelcomeScreenProps = {
  onGetStarted?: () => void;
  onSignIn?: () => void;
};

export function WelcomeScreen({ onGetStarted, onSignIn }: WelcomeScreenProps) {
  const insets = useSafeAreaInsets();
  const { width, height, fontScale } = useWindowDimensions();
  const imageSize = Math.max(
    180,
    Math.min(width * 0.82, height * 0.42 - (fontScale - 1) * 120),
  );

  const [index, setIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  // Height of the tallest text block, so the layout doesn't jump as the
  // texts change.
  const [textHeight, setTextHeight] = useState(0);
  const opacities = useRef(
    SLIDES.map((_, i) => new Animated.Value(i === 0 ? 1 : 0)),
  ).current;

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduceMotion,
    );
    return () => subscription.remove();
  }, []);

  // Cross-fades to the next slide on a timer. Stays on the first one when
  // Reduce Motion is on.
  useEffect(() => {
    if (reduceMotion) {
      return;
    }
    const timer = setTimeout(() => {
      const next = (index + 1) % SLIDES.length;
      Animated.parallel([
        Animated.timing(opacities[index], {
          toValue: 0,
          duration: FADE_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(opacities[next], {
          toValue: 1,
          duration: FADE_DURATION,
          useNativeDriver: true,
        }),
      ]).start();
      setIndex(next);
    }, ROTATE_INTERVAL);
    return () => clearTimeout(timer);
  }, [index, reduceMotion, opacities]);

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: Math.max(insets.bottom, 16) + 12,
        },
      ]}
    >
      <StatusBar barStyle="dark-content" />

      <View style={styles.middle}>
        <View
          style={{ width: imageSize, height: imageSize }}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          {SLIDES.map((slide, i) => (
            <Animated.View
              key={slide.title}
              style={[StyleSheet.absoluteFill, { opacity: opacities[i] }]}
            >
              <SvgXml xml={slide.illustration} width="100%" height="100%" />
            </Animated.View>
          ))}
        </View>

        <View style={[styles.texts, { height: textHeight }]}>
          {SLIDES.map((slide, i) => (
            <Animated.View
              key={slide.title}
              testID={`welcome-slide-${i}`}
              style={[styles.text, { opacity: opacities[i] }]}
              onLayout={event => {
                const measured = event.nativeEvent.layout.height;
                setTextHeight(current => Math.max(current, measured));
              }}
              // Only the visible text is read out; no live announcements, so
              // the timer doesn't interrupt screen reader users.
              accessibilityElementsHidden={i !== index}
              importantForAccessibility={
                i === index ? 'auto' : 'no-hide-descendants'
              }
            >
              <Text
                style={styles.title}
                accessibilityRole="header"
                maxFontSizeMultiplier={1.5}
              >
                {slide.title}
              </Text>
              <Text style={styles.body} maxFontSizeMultiplier={1.6}>
                {slide.body}
              </Text>
            </Animated.View>
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        <PrimaryButton label="Get started" onPress={onGetStarted} />
        <SecondaryButton label="I already have an account" onPress={onSignIn} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: colors.offWhite,
  },
  middle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: {
    alignSelf: 'stretch',
    marginTop: 24,
  },
  // Stacked on top of each other; the container takes the tallest height.
  text: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    lineHeight: 32,
    fontFamily: fonts.bold,
    color: colors.charcoal,
    textAlign: 'center',
  },
  body: {
    marginTop: 8,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    textAlign: 'center',
  },
  actions: {
    gap: 4,
  },
});

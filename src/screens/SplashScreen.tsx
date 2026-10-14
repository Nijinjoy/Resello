import { useEffect, useState } from 'react';
import {
  Animated,
  Easing,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Logo } from '../components/Logo';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

// Gap between the logo and the wordmark (also used to centre the logo).
const WORDMARK_GAP = 10;
// Close estimate of the wordmark block height, replaced by the measured value
// after the first layout.
const ESTIMATED_WORDMARK_HEIGHT = 72;

type SplashScreenProps = {
  onFinish?: () => void;
};

export function SplashScreen({ onFinish }: SplashScreenProps) {
  // Lazy initializers create each Animated.Value once instead of on every render.
  const [spin] = useState(() => new Animated.Value(0));
  const [textOpacity] = useState(() => new Animated.Value(0));
  const [footerOpacity] = useState(() => new Animated.Value(0));
  const [wordmarkHeight, setWordmarkHeight] = useState(
    ESTIMATED_WORDMARK_HEIGHT,
  );

  // Derived values: driven by the timings above, so they need no animations of their own.
  const backdropOpacity = spin.interpolate({
    inputRange: [0, 0.9],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  // Logo and wordmark move as one group: it starts shifted down so the logo
  // sits exactly where the native splash logo was, then rises into place as
  // the wordmark fades in.
  const brandOffset = textOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: [(wordmarkHeight + WORDMARK_GAP) / 2, 0],
  });

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.timing(spin, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(200),
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(footerOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]);

    animation.start(({ finished }) => {
      if (finished) {
        onFinish?.();
      }
    });
    return () => animation.stop();
  }, [footerOpacity, onFinish, spin, textOpacity]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Animated.View
        style={[StyleSheet.absoluteFill, { opacity: backdropOpacity }]}
      >
        <View style={[styles.glow, styles.glowTop]} />
        <View style={[styles.glow, styles.glowBottom]} />
      </Animated.View>

      <Animated.View
        style={[styles.brand, { transform: [{ translateY: brandOffset }] }]}
      >
        <Logo spin={spin} />

        <Animated.View
          style={[styles.wordmarkGroup, { opacity: textOpacity }]}
          onLayout={event => setWordmarkHeight(event.nativeEvent.layout.height)}
        >
          <Text style={styles.wordmark}>Resello</Text>
          <Text style={styles.caption}>Resell. Rediscover.</Text>
        </Animated.View>
      </Animated.View>

      <Animated.View style={[styles.footer, { opacity: footerOpacity }]}>
        <Text style={styles.region}>🇦🇪 Made for the UAE</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    width: 420,
    height: 420,
    borderRadius: 210,
    backgroundColor: colors.primaryLight,
    opacity: 0.35,
  },
  glowTop: {
    top: -180,
    right: -160,
  },
  glowBottom: {
    bottom: -220,
    left: -180,
    backgroundColor: colors.primaryDark,
    opacity: 0.6,
  },
  brand: {
    alignItems: 'center',
  },
  wordmarkGroup: {
    marginTop: WORDMARK_GAP,
    alignItems: 'center',
  },
  wordmark: {
    fontFamily: 'KronaOne-Regular',
    fontSize: 34,
    color: colors.white,
    letterSpacing: 1,
  },
  caption: {
    marginTop: 8,
    paddingHorizontal: 32,
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: colors.accent,
    textAlign: 'center',
    letterSpacing: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 56,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  region: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.sand,
    opacity: 0.6,
    letterSpacing: 0.5,
  },
});

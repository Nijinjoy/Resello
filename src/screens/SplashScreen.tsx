import { useEffect, useState } from 'react';
import {
  Animated,
  Easing,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

const colors = {
  primary: '#0E5E4E',
  primaryDark: '#0A4539',
  primaryLight: '#1C7A66',
  accent: '#D9A94A',
  sand: '#F6EFE2',
  white: '#FFFFFF',
};

const LOGO_SIZE = 120;

type LogoProps = {
  size?: number;
  spin?: Animated.Value;
};

function Logo({ size = LOGO_SIZE, spin }: LogoProps) {
  const rotate = spin
    ? spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] })
    : '0deg';

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 120 120">
        <Rect width={120} height={120} rx={33.6} fill={colors.white} />
        <Path
          d="M51 49 V73 M51 59 Q54 49 67 49"
          fill="none"
          stroke={colors.primary}
          strokeWidth={10}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Circle cx={96} cy={24} r={7.2} fill={colors.accent} />
      </Svg>
      <Animated.View
        style={[StyleSheet.absoluteFill, { transform: [{ rotate }] }]}
      >
        <Svg width={size} height={size} viewBox="0 0 120 120">
          <Path
            d="M87.577 87.577 A39 39 0 0 1 32.423 32.423"
            fill="none"
            stroke={colors.primary}
            strokeWidth={8.4}
          />
          <Path
            d="M32.423 32.423 A39 39 0 0 1 87.577 32.423"
            fill="none"
            stroke={colors.accent}
            strokeWidth={8.4}
          />
        </Svg>
      </Animated.View>
    </View>
  );
}

export function SplashScreen() {
  // Lazy initializers create each Animated.Value once instead of on every render.
  const [spin] = useState(() => new Animated.Value(0));
  const [textOpacity] = useState(() => new Animated.Value(0));
  const [footerOpacity] = useState(() => new Animated.Value(0));

  // Derived values: driven by the timings above, so they need no animations of their own.
  const backdropOpacity = spin.interpolate({
    inputRange: [0, 0.9],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const textOffset = textOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: [12, 0],
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

    animation.start();
    return () => animation.stop();
  }, [footerOpacity, spin, textOpacity]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Animated.View
        style={[StyleSheet.absoluteFill, { opacity: backdropOpacity }]}
      >
        <View style={[styles.glow, styles.glowTop]} />
        <View style={[styles.glow, styles.glowBottom]} />
      </Animated.View>

      <View style={styles.brand}>
        <Logo spin={spin} />

        <Animated.View
          style={[
            styles.wordmarkGroup,
            { opacity: textOpacity, transform: [{ translateY: textOffset }] },
          ]}
        >
          <Text style={styles.wordmark}>Resello</Text>
          <Text style={styles.caption}>Resell. Rediscover.</Text>
        </Animated.View>
      </View>

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
    marginTop: 10,
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
    fontWeight: '600',
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
    fontSize: 12,
    color: colors.sand,
    opacity: 0.6,
    letterSpacing: 0.5,
  },
});

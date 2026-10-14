import { Animated, StyleSheet, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { colors } from '../theme/colors';

const DEFAULT_SIZE = 120;

export type LogoProps = {
  size?: number;
  spin?: Animated.Value;
};

export function Logo({ size = DEFAULT_SIZE, spin }: LogoProps) {
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

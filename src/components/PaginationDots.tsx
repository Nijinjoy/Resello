import { Animated, StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';

const DOT_SIZE = 8;
const PILL_WIDTH = 24;

type PaginationDotsProps = {
  count: number;
  activeIndex: number;
  // Optional horizontal scroll offset of the pager, so the indicator follows
  // the swipe. Without it the dots snap to `activeIndex`.
  scrollX?: Animated.Value;
  pageWidth?: number;
  accessibilityLabel?: string;
};

export function PaginationDots({
  count,
  activeIndex,
  scrollX,
  pageWidth = 1,
  accessibilityLabel,
}: PaginationDotsProps) {
  return (
    <View
      style={styles.row}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
    >
      {Array.from({ length: count }, (_, index) => {
        // Each slot cross-fades between a small dot and the elongated pill.
        // Opacity only, so it can run on the native driver.
        const inputRange = [
          (index - 1) * pageWidth,
          index * pageWidth,
          (index + 1) * pageWidth,
        ];
        const pillOpacity = scrollX
          ? scrollX.interpolate({
              inputRange,
              outputRange: [0, 1, 0],
              extrapolate: 'clamp',
            })
          : index === activeIndex
          ? 1
          : 0;
        const dotOpacity = scrollX
          ? scrollX.interpolate({
              inputRange,
              outputRange: [1, 0, 1],
              extrapolate: 'clamp',
            })
          : index === activeIndex
          ? 0
          : 1;

        return (
          <View key={index} style={styles.slot}>
            <Animated.View style={[styles.dot, { opacity: dotOpacity }]} />
            <Animated.View style={[styles.pill, { opacity: pillOpacity }]} />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  slot: {
    width: PILL_WIDTH,
    height: DOT_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: colors.beige,
  },
  pill: {
    position: 'absolute',
    width: PILL_WIDTH,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: colors.primary,
  },
});

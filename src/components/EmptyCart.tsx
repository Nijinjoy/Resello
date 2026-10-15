import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';
import { colors } from '../theme/colors';
import { EmptyState } from './EmptyState';

const STEPS = [
  { title: 'Find a deal', body: 'Browse pre-loved items near you.' },
  { title: 'Add to cart', body: 'Keep items from several sellers together.' },
  {
    title: 'Pay with protection',
    body: "Full refund if it isn't as described.",
  },
];

type EmptyCartProps = {
  onExplore: () => void;
  // Shown only when the user has saved items.
  favoritesCount: number;
  onFavorites: () => void;
};

// Cart tab when there's nothing in it: an illustration, how buying works,
// and ways to start shopping.
export function EmptyCart({
  onExplore,
  favoritesCount,
  onFavorites,
}: EmptyCartProps) {
  return (
    <EmptyState
      illustration={<EmptyBagIllustration />}
      title="Your cart is empty"
      body="Pre-loved finds you add will wait for you here."
      steps={STEPS}
      primaryAction={{ label: 'Start exploring', onPress: onExplore }}
      secondaryAction={
        favoritesCount > 0
          ? {
              label: `View saved items (${favoritesCount})`,
              onPress: onFavorites,
            }
          : undefined
      }
    />
  );
}

// An open shopping bag with a leaf: empty, and second-hand.
function EmptyBagIllustration() {
  return (
    <Svg
      width={180}
      height={150}
      viewBox="0 0 180 150"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Circle cx={90} cy={72} r={64} fill={colors.sand} />
      <Ellipse cx={90} cy={136} rx={46} ry={6} fill="#EDE3D1" />
      {/* Bag */}
      <Path
        d="M52 58h76l-6 70a6 6 0 0 1-6 5H64a6 6 0 0 1-6-5z"
        fill={colors.primary}
      />
      <Rect
        x={52}
        y={56}
        width={76}
        height={10}
        rx={3}
        fill={colors.primaryDark}
      />
      {/* Handles */}
      <Path
        d="M72 58V46a18 18 0 0 1 36 0v12"
        fill="none"
        stroke={colors.primaryDark}
        strokeWidth={5}
        strokeLinecap="round"
      />
      {/* Leaf on the bag */}
      <Path
        d="M90 112c-12-4-16-16-12-28 12 2 18 12 12 28z"
        fill={colors.accent}
      />
      <Path
        d="M90 112c-4-8-7-15-11-24"
        fill="none"
        stroke={colors.primaryDark}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      {/* Sparkles */}
      <Path
        d="M140 30v10M135 35h10"
        stroke={colors.accent}
        strokeWidth={2.4}
        strokeLinecap="round"
      />
      <Circle cx={38} cy={44} r={4} fill={colors.beige} />
      <Circle cx={148} cy={92} r={3} fill={colors.beige} />
    </Svg>
  );
}

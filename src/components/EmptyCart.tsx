import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { PrimaryButton, SecondaryButton } from './Button';

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
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <EmptyBagIllustration />
      <Text style={styles.title} accessibilityRole="header">
        Your cart is empty
      </Text>
      <Text style={styles.body}>
        Pre-loved finds you add will wait for you here.
      </Text>

      <View style={styles.steps}>
        {STEPS.map((step, index) => (
          <View key={step.title} style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{index + 1}</Text>
            </View>
            <View style={styles.stepBody}>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepText}>{step.body}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <PrimaryButton label="Start exploring" onPress={onExplore} />
        {favoritesCount > 0 && (
          <SecondaryButton
            label={`View saved items (${favoritesCount})`}
            onPress={onFavorites}
          />
        )}
      </View>
    </ScrollView>
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

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    paddingBottom: 32,
  },
  title: {
    marginTop: 8,
    fontSize: 22,
    fontFamily: fonts.bold,
    color: colors.charcoal,
  },
  body: {
    marginTop: 6,
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    textAlign: 'center',
  },
  steps: {
    alignSelf: 'stretch',
    marginTop: 24,
    padding: 16,
    gap: 14,
    borderRadius: 18,
    backgroundColor: colors.offWhite,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.beige,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  stepNumberText: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  stepBody: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: colors.ink,
  },
  stepText: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  actions: {
    alignSelf: 'stretch',
    marginTop: 24,
    gap: 4,
  },
});

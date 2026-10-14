import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

type ButtonProps = {
  label: string;
  onPress?: () => void;
};

export function PrimaryButton({ label, onPress }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.primary, pressed && styles.pressed]}
    >
      <Text style={styles.primaryLabel} maxFontSizeMultiplier={1.6}>
        {label}
      </Text>
    </Pressable>
  );
}

export function SecondaryButton({ label, onPress }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}
    >
      <Text style={styles.secondaryLabel} maxFontSizeMultiplier={1.6}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  primary: {
    minHeight: 56,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  primaryLabel: {
    fontSize: 17,
    fontFamily: fonts.semiBold,
    color: colors.white,
    textAlign: 'center',
  },
  secondary: {
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryLabel: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: colors.primary,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
});

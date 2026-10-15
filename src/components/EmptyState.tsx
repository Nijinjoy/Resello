import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { PrimaryButton, SecondaryButton } from './Button';

type Action = { label: string; onPress: () => void };

type EmptyStateProps = {
  illustration: ReactNode;
  title: string;
  body: string;
  // Numbered tips shown in a card under the text.
  steps: { title: string; body: string }[];
  primaryAction: Action;
  secondaryAction?: Action;
};

// Full-screen empty state: an illustration, a short explanation, numbered
// steps, and actions. Scrolls on small screens.
export function EmptyState({
  illustration,
  title,
  body,
  steps,
  primaryAction,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {illustration}
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      <Text style={styles.body}>{body}</Text>

      <View style={styles.steps}>
        {steps.map((step, index) => (
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
        <PrimaryButton {...primaryAction} />
        {secondaryAction && <SecondaryButton {...secondaryAction} />}
      </View>
    </ScrollView>
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

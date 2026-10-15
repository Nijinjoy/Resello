import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

type PlaceholderScreenProps = {
  title: string;
};

// Stand-in for screens opened from the profile drawer until each is built.
export function PlaceholderScreen({ title }: PlaceholderScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title} maxFontSizeMultiplier={1.5}>
        {title}
      </Text>
      <Text style={styles.body} maxFontSizeMultiplier={1.7}>
        This screen is coming soon.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 8,
    backgroundColor: colors.offWhite,
  },
  title: {
    fontSize: 22,
    fontFamily: fonts.semiBold,
    color: colors.charcoal,
  },
  body: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
});

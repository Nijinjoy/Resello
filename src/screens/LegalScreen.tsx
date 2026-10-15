import { useRef, useState, type ComponentRef } from 'react';
import {
  FlatList,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  LEGAL_LAST_UPDATED,
  PRIVACY,
  SUPPORT_EMAIL,
  TERMS,
  type LegalSection,
} from '../data/legal';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

type Doc = 'terms' | 'privacy';

const DOCS: { value: Doc; label: string }[] = [
  { value: 'terms', label: 'Terms of use' },
  { value: 'privacy', label: 'Privacy policy' },
];

// Terms of use and privacy policy, switched with a segmented control.
export function LegalScreen() {
  const [doc, setDoc] = useState<Doc>('terms');
  const listRef = useRef<ComponentRef<typeof FlatList<LegalSection>>>(null);
  const sections = doc === 'terms' ? TERMS : PRIVACY;

  const select = (value: Doc) => {
    setDoc(value);
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  };

  return (
    <View style={styles.container}>
      <View style={styles.segments} accessibilityRole="tablist">
        {DOCS.map(option => {
          const selected = doc === option.value;
          return (
            <Pressable
              key={option.value}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              onPress={() => select(option.value)}
              style={[styles.segment, selected && styles.segmentOn]}
            >
              <Text
                style={[styles.segmentText, selected && styles.segmentTextOn]}
                maxFontSizeMultiplier={1.3}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <FlatList
        ref={listRef}
        data={sections}
        keyExtractor={section => section.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Text style={styles.updated}>
            {`Last updated ${LEGAL_LAST_UPDATED}`}
          </Text>
        }
        renderItem={({ item, index }) => (
          <View style={styles.section}>
            <Text style={styles.sectionTitle} accessibilityRole="header">
              {`${index + 1}. ${item.title}`}
            </Text>
            {item.paragraphs.map((paragraph, paragraphIndex) => (
              <Text key={paragraphIndex} style={styles.paragraph}>
                {paragraph}
              </Text>
            ))}
          </View>
        )}
        ListFooterComponent={
          <View style={styles.contact}>
            <Text style={styles.contactTitle}>Need help?</Text>
            <Text style={styles.contactBody}>
              Our team usually replies within one working day.
            </Text>
            <Pressable
              accessibilityRole="link"
              onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}`)}
              hitSlop={6}
              style={({ pressed }) => pressed && styles.pressed}
            >
              <Text style={styles.contactLink}>{SUPPORT_EMAIL}</Text>
            </Pressable>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  segments: {
    flexDirection: 'row',
    margin: 16,
    marginBottom: 4,
    padding: 4,
    borderRadius: 14,
    backgroundColor: colors.sand,
  },
  segment: {
    flex: 1,
    minHeight: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentOn: {
    backgroundColor: colors.white,
    shadowColor: colors.charcoal,
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  segmentText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.textMuted,
  },
  segmentTextOn: {
    fontFamily: fonts.semiBold,
    color: colors.primary,
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
    gap: 20,
  },
  updated: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: fonts.semiBold,
    color: colors.ink,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 23,
    fontFamily: fonts.regular,
    color: colors.charcoal,
  },
  contact: {
    marginTop: 4,
    padding: 16,
    gap: 4,
    borderRadius: 16,
    backgroundColor: colors.sand,
  },
  contactTitle: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: colors.primaryDark,
  },
  contactBody: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  contactLink: {
    marginTop: 4,
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  pressed: {
    opacity: 0.7,
  },
});

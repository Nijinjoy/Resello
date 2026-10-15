import { useState } from 'react';
import {
  FlatList,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Svg, { Circle, Path } from 'react-native-svg';
import { FAQS, HELP_TOPICS, type Faq, type HelpTopic } from '../data/help';
import { SUPPORT_EMAIL } from '../data/legal';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'Help'>;

const mailto = (subject: string) =>
  Linking.openURL(
    `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}`,
  );

// Searchable FAQs by topic, with ways to contact support underneath.
export function HelpScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState<HelpTopic | 'all'>('all');
  const [openId, setOpenId] = useState<string>();

  const search = query.trim().toLowerCase();
  const shown = FAQS.filter(
    faq =>
      (topic === 'all' || faq.topic === topic) &&
      (!search ||
        faq.question.toLowerCase().includes(search) ||
        faq.answer.toLowerCase().includes(search)),
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={shown}
        keyExtractor={faq => faq.id}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.heading} accessibilityRole="header">
              How can we help?
            </Text>
            <View style={styles.search}>
              <Svg width={18} height={18} viewBox="0 0 24 24">
                <Circle
                  cx={11}
                  cy={11}
                  r={7}
                  fill="none"
                  stroke={colors.muted}
                  strokeWidth={2}
                />
                <Path
                  d="m20 20-3.5-3.5"
                  stroke={colors.muted}
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              </Svg>
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search help articles"
                placeholderTextColor={colors.textMuted}
                accessibilityLabel="Search help articles"
                returnKeyType="search"
                style={styles.searchInput}
              />
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.topicsScroll}
              contentContainerStyle={styles.topics}
            >
              {[{ value: 'all' as const, label: 'All' }, ...HELP_TOPICS].map(
                option => {
                  const selected = topic === option.value;
                  return (
                    <Pressable
                      key={option.value}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                      onPress={() => setTopic(option.value)}
                      style={[styles.chip, selected && styles.chipOn]}
                    >
                      <Text
                        style={[styles.chipText, selected && styles.chipTextOn]}
                        maxFontSizeMultiplier={1.3}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                },
              )}
            </ScrollView>
            <Text style={styles.sectionTitle}>Frequently asked</Text>
          </View>
        }
        renderItem={({ item }) => (
          <FaqRow
            faq={item}
            open={openId === item.id}
            onToggle={() =>
              setOpenId(current => (current === item.id ? undefined : item.id))
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No articles found</Text>
            <Text style={styles.emptyBody}>
              Try different words, or contact us below.
            </Text>
          </View>
        }
        ListFooterComponent={
          <View style={styles.contact}>
            <Text style={styles.sectionTitle}>Still need help?</Text>
            <ContactOption
              icon="mail"
              title="Email us"
              body="We usually reply within one working day."
              onPress={() => mailto('Help with Resello')}
            />
            <ContactOption
              icon="flag"
              title="Report a problem"
              body="A listing, a user, an order, or a bug in the app."
              onPress={() => mailto('Report a problem')}
            />
            <ContactOption
              icon="doc"
              title="Terms & privacy"
              body="How Resello works and how we use your data."
              onPress={() => navigation.navigate('Legal')}
            />
          </View>
        }
      />
    </View>
  );
}

function FaqRow({
  faq,
  open,
  onToggle,
}: {
  faq: Faq;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <View style={[styles.faq, open && styles.faqOpen]}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        onPress={onToggle}
        style={({ pressed }) => [styles.faqHeader, pressed && styles.pressed]}
      >
        <Text style={styles.question}>{faq.question}</Text>
        <Svg width={18} height={18} viewBox="0 0 24 24">
          <Path
            d={open ? 'M6 15l6-6 6 6' : 'M6 9l6 6 6-6'}
            fill="none"
            stroke={open ? colors.primary : colors.textMuted}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </Pressable>
      {open && <Text style={styles.answer}>{faq.answer}</Text>}
    </View>
  );
}

function ContactOption({
  icon,
  title,
  body,
  onPress,
}: {
  icon: 'mail' | 'flag' | 'doc';
  title: string;
  body: string;
  onPress: () => void;
}) {
  const stroke = {
    fill: 'none',
    stroke: colors.primary,
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityHint={body}
      onPress={onPress}
      style={({ pressed }) => [styles.option, pressed && styles.pressed]}
    >
      <View style={styles.optionIcon}>
        <Svg width={20} height={20} viewBox="0 0 24 24">
          {icon === 'mail' && (
            <>
              <Path d="M4 6h16v12H4z" {...stroke} />
              <Path d="m4 7 8 6 8-6" {...stroke} />
            </>
          )}
          {icon === 'flag' && <Path d="M5 21V4h11l-2 4 2 4H5" {...stroke} />}
          {icon === 'doc' && (
            <>
              <Path d="M6 3h8l4 4v14H6z" {...stroke} />
              <Path d="M9 12h6M9 16h6" {...stroke} />
            </>
          )}
        </Svg>
      </View>
      <View style={styles.optionBody}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionText}>{body}</Text>
      </View>
      <Svg width={16} height={16} viewBox="0 0 24 24">
        <Path
          d="m9 6 6 6-6 6"
          fill="none"
          stroke={colors.textMuted}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 10,
  },
  header: {
    paddingTop: 16,
    gap: 14,
  },
  heading: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.ink,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 48,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: colors.offWhite,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.beige,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.ink,
  },
  topicsScroll: {
    marginHorizontal: -16,
  },
  topics: {
    gap: 8,
    paddingHorizontal: 16,
  },
  chip: {
    minHeight: 34,
    paddingHorizontal: 14,
    borderRadius: 17,
    justifyContent: 'center',
    backgroundColor: colors.sand,
  },
  chipOn: {
    backgroundColor: colors.primary,
  },
  chipText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.charcoal,
  },
  chipTextOn: {
    color: colors.white,
  },
  sectionTitle: {
    marginTop: 6,
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  faq: {
    borderRadius: 14,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#EFE7D8',
  },
  faqOpen: {
    borderColor: colors.primary,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 52,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  question: {
    flex: 1,
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: colors.ink,
  },
  answer: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    fontSize: 14,
    lineHeight: 21,
    fontFamily: fonts.regular,
    color: colors.charcoal,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 6,
  },
  emptyTitle: {
    fontSize: 17,
    fontFamily: fonts.semiBold,
    color: colors.ink,
  },
  emptyBody: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  contact: {
    marginTop: 14,
    gap: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    backgroundColor: colors.offWhite,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.beige,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.sand,
  },
  optionBody: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: colors.ink,
  },
  optionText: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  pressed: {
    opacity: 0.75,
  },
});

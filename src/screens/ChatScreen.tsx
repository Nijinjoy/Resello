import { useState } from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { CategoryIcon } from '../components/CategoryIcon';
import { listings } from '../data/listings';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { formatAED } from '../utils/money';

const QUICK_REPLIES = [
  'Is this still available?',
  'Is the price negotiable?',
  'Where can I pick it up?',
];

type Message = {
  id: string;
  text: string;
  time: string;
};

const timeNow = () =>
  new Date().toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });

// Conversation with a listing's seller. Messages stay on this screen until
// the chat backend exists, so they're only ever the buyer's own.
export function ChatScreen({
  route,
}: NativeStackScreenProps<RootStackParamList, 'Chat'>) {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const listing = listings.find(item => item.id === route.params.listingId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');

  if (!listing) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>This item is no longer listed</Text>
      </View>
    );
  }

  const firstName = listing.sellerName.split(' ')[0];

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }
    setMessages(current => [
      { id: String(Date.now()), text: trimmed, time: timeNow() },
      ...current,
    ]);
    setDraft('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={headerHeight}
    >
      <View style={styles.item}>
        <View style={styles.thumb}>
          {listing.images.length > 0 ? (
            <Image
              source={listing.images[0]}
              style={styles.thumbImage}
              accessibilityIgnoresInvertColors
            />
          ) : (
            <CategoryIcon category={listing.category} size={24} />
          )}
        </View>
        <View style={styles.itemBody}>
          <Text style={styles.itemTitle} numberOfLines={1}>
            {listing.title}
          </Text>
          <Text style={styles.itemPrice}>{formatAED(listing.price)}</Text>
        </View>
      </View>

      <FlatList
        data={messages}
        keyExtractor={message => message.id}
        // Newest at the bottom, next to the input.
        inverted={messages.length > 0}
        style={styles.list}
        contentContainerStyle={
          messages.length > 0 ? styles.messages : styles.emptyMessages
        }
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        renderItem={({ item }) => (
          <View style={styles.bubble}>
            <Text style={styles.bubbleText}>{item.text}</Text>
            <Text style={styles.bubbleTime}>{item.time}</Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.starter}>
            <Text style={styles.starterTitle}>
              {`Ask ${firstName} about this item`}
            </Text>
            <View style={styles.quickReplies}>
              {QUICK_REPLIES.map(reply => (
                <Pressable
                  key={reply}
                  accessibilityRole="button"
                  onPress={() => send(reply)}
                  style={({ pressed }) => [
                    styles.quickReply,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.quickReplyText}>{reply}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        }
      />

      <View style={[styles.composer, { paddingBottom: insets.bottom + 10 }]}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder={`Message ${firstName}…`}
          placeholderTextColor={colors.textMuted}
          accessibilityLabel={`Message ${firstName}`}
          multiline
          style={styles.input}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Send"
          accessibilityState={{ disabled: !draft.trim() }}
          disabled={!draft.trim()}
          onPress={() => send(draft)}
          style={({ pressed }) => [
            styles.send,
            !draft.trim() && styles.sendDisabled,
            pressed && styles.pressed,
          ]}
        >
          <Svg width={20} height={20} viewBox="0 0 24 24">
            <Path
              d="M4 12l16-8-6 16-2.5-6.5L4 12z"
              fill="none"
              stroke={colors.white}
              strokeWidth={2}
              strokeLinejoin="round"
            />
          </Svg>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.offWhite,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.beige,
  },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.sand,
  },
  thumbImage: {
    width: 48,
    height: 48,
  },
  itemBody: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: colors.ink,
  },
  itemPrice: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  list: {
    flex: 1,
  },
  messages: {
    padding: 16,
    gap: 8,
  },
  emptyMessages: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    padding: 16,
  },
  bubble: {
    alignSelf: 'flex-end',
    maxWidth: '80%',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 18,
    borderBottomRightRadius: 6,
    backgroundColor: colors.primary,
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 21,
    fontFamily: fonts.regular,
    color: colors.white,
  },
  bubbleTime: {
    alignSelf: 'flex-end',
    marginTop: 2,
    fontSize: 11,
    fontFamily: fonts.regular,
    color: 'rgba(255, 255, 255, 0.75)',
  },
  starter: {
    gap: 12,
  },
  starterTitle: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.textMuted,
  },
  quickReplies: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickReply: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 18,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.beige,
  },
  quickReplyText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.primaryDark,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingTop: 10,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.beige,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderRadius: 22,
    backgroundColor: colors.offWhite,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.beige,
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.ink,
  },
  send: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  sendDisabled: {
    opacity: 0.4,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.white,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: fonts.semiBold,
    color: colors.ink,
  },
  pressed: {
    opacity: 0.75,
  },
});

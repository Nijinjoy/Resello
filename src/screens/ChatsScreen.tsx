import { useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { CategoryIcon } from '../components/CategoryIcon';
import { avatarColor, initials } from '../utils/avatar';
import { conversations, type Conversation } from '../data/chats';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { TabScreen, useTabScroll } from './TabScreen';

type Filter = 'all' | 'unread' | 'buying' | 'selling';

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'unread', label: 'Unread' },
  { value: 'buying', label: 'Buying' },
  { value: 'selling', label: 'Selling' },
];

function matches(chat: Conversation, filter: Filter, query: string) {
  if (filter === 'unread' && chat.unread === 0) {
    return false;
  }
  if ((filter === 'buying' || filter === 'selling') && chat.role !== filter) {
    return false;
  }
  const q = query.trim().toLowerCase();
  return (
    !q ||
    chat.name.toLowerCase().includes(q) ||
    chat.itemTitle.toLowerCase().includes(q)
  );
}

export function ChatsScreen() {
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const { scrolled, onScroll } = useTabScroll();

  const visible = useMemo(
    () => conversations.filter(chat => matches(chat, filter, query)),
    [filter, query],
  );
  const unreadTotal = conversations.filter(chat => chat.unread > 0).length;

  return (
    <TabScreen
      scrolled={scrolled}
      headerBottom={
        <>
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
              placeholder="Search chats or items"
              placeholderTextColor={colors.muted}
              accessibilityLabel="Search chats"
              returnKeyType="search"
              clearButtonMode="while-editing"
              style={styles.searchInput}
            />
          </View>

          <View style={styles.filters}>
            {FILTERS.map(option => {
              const selected = option.value === filter;
              const count = option.value === 'unread' ? unreadTotal : 0;
              return (
                <Pressable
                  key={option.value}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => setFilter(option.value)}
                  style={[styles.chip, selected && styles.chipSelected]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selected && styles.chipTextSelected,
                    ]}
                    maxFontSizeMultiplier={1.3}
                  >
                    {option.label}
                  </Text>
                  {count > 0 && (
                    <View
                      style={[styles.chipCount, selected && styles.chipCountOn]}
                    >
                      <Text
                        style={[
                          styles.chipCountText,
                          selected && styles.chipCountTextOn,
                        ]}
                      >
                        {count}
                      </Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </>
      }
    >
      <FlatList
        data={visible}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyExtractor={chat => chat.id}
        renderItem={({ item }) => <ChatRow chat={item} />}
        ItemSeparatorComponent={Separator}
        ListEmptyComponent={EmptyState}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        style={styles.listView}
      />
    </TabScreen>
  );
}

function ChatRow({ chat }: { chat: Conversation }) {
  const unread = chat.unread > 0;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${chat.name}, about ${chat.itemTitle}. ${
        unread ? `${chat.unread} unread. ` : ''
      }${chat.lastMessage}`}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <View style={styles.thumbWrap}>
        <View
          style={[styles.avatar, { backgroundColor: avatarColor(chat.name) }]}
        >
          <Text style={styles.avatarText} maxFontSizeMultiplier={1.2}>
            {initials(chat.name)}
          </Text>
        </View>
        {chat.online && <View style={styles.onlineDot} />}
        <View style={styles.thumb}>
          {chat.itemImage ? (
            <Image source={{ uri: chat.itemImage }} style={styles.thumbImage} />
          ) : (
            <CategoryIcon category={chat.itemCategory} size={16} />
          )}
        </View>
      </View>

      <View style={styles.rowBody}>
        <View style={styles.rowTop}>
          <Text
            style={[styles.title, unread && styles.titleUnread]}
            numberOfLines={1}
            maxFontSizeMultiplier={1.4}
          >
            {chat.name}
          </Text>
          <Text
            style={[styles.time, unread && styles.timeUnread]}
            maxFontSizeMultiplier={1.3}
          >
            {chat.time}
          </Text>
        </View>

        <View style={styles.personLine}>
          <View
            style={[
              styles.roleTag,
              chat.role === 'selling' ? styles.roleSelling : styles.roleBuying,
            ]}
          >
            <Text style={styles.roleText} maxFontSizeMultiplier={1.2}>
              {chat.role === 'selling' ? 'Selling' : 'Buying'}
            </Text>
          </View>
          <Text
            style={styles.person}
            numberOfLines={1}
            maxFontSizeMultiplier={1.3}
          >
            {`${chat.itemTitle} · ${chat.itemPrice}`}
          </Text>
        </View>

        <View style={styles.rowBottom}>
          <Text
            style={[styles.message, unread && styles.messageUnread]}
            numberOfLines={1}
            maxFontSizeMultiplier={1.4}
          >
            {chat.fromMe ? `You: ${chat.lastMessage}` : chat.lastMessage}
          </Text>
          {unread && (
            <View style={styles.badge}>
              <Text style={styles.badgeText} maxFontSizeMultiplier={1.2}>
                {chat.unread}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

function EmptyState() {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Svg width={28} height={28} viewBox="0 0 24 24">
          <Path
            d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.1A8 8 0 1 1 20 12z"
            fill="none"
            stroke={colors.primary}
            strokeWidth={1.8}
            strokeLinejoin="round"
          />
        </Svg>
      </View>
      <Text style={styles.emptyTitle} maxFontSizeMultiplier={1.4}>
        No chats here yet
      </Text>
      <Text style={styles.emptyBody} maxFontSizeMultiplier={1.5}>
        Message a seller about an item, or try a different filter.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    minHeight: 44,
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
    color: colors.charcoal,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 34,
    paddingHorizontal: 14,
    borderRadius: 17,
    backgroundColor: colors.sand,
  },
  chipSelected: {
    backgroundColor: colors.primary,
  },
  chipText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.charcoal,
  },
  chipTextSelected: {
    color: colors.white,
  },
  chipCount: {
    minWidth: 18,
    height: 18,
    paddingHorizontal: 5,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  chipCountOn: {
    backgroundColor: colors.white,
  },
  chipCountText: {
    fontSize: 11,
    fontFamily: fonts.semiBold,
    color: colors.white,
  },
  chipCountTextOn: {
    color: colors.primary,
  },
  listView: {
    flex: 1,
    marginHorizontal: -16,
  },
  list: {
    paddingVertical: 8,
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  rowPressed: {
    backgroundColor: colors.offWhite,
  },
  thumbWrap: {
    width: 60,
    height: 60,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontFamily: fonts.semiBold,
    color: colors.white,
  },
  onlineDot: {
    position: 'absolute',
    top: 1,
    right: 3,
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: '#22A06B',
    borderWidth: 2,
    borderColor: colors.white,
  },
  thumb: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 28,
    height: 28,
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.sand,
    borderWidth: 2,
    borderColor: colors.white,
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  rowBody: {
    flex: 1,
    gap: 3,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.charcoal,
  },
  titleUnread: {
    fontFamily: fonts.semiBold,
    color: colors.ink,
  },
  time: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.muted,
  },
  timeUnread: {
    fontFamily: fonts.semiBold,
    color: colors.primary,
  },
  personLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  roleTag: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  roleBuying: {
    backgroundColor: colors.sand,
  },
  roleSelling: {
    backgroundColor: '#E6F0EC',
  },
  roleText: {
    fontSize: 11,
    fontFamily: fonts.semiBold,
    color: colors.primaryDark,
  },
  person: {
    flex: 1,
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.textMuted,
  },
  rowBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  messageUnread: {
    fontFamily: fonts.medium,
    color: colors.charcoal,
  },
  badge: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: colors.primaryDark,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 88,
    backgroundColor: colors.beige,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
    gap: 8,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.sand,
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 17,
    fontFamily: fonts.semiBold,
    color: colors.charcoal,
  },
  emptyBody: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    textAlign: 'center',
  },
});

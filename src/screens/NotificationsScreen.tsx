import { useMemo, useState } from 'react';
import { Pressable, SectionList, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Svg, { Circle, Path } from 'react-native-svg';
import type { AppNotification, NotificationKind } from '../data/notifications';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { useNotifications } from '../state/notifications';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { formatAgo } from '../utils/time';

const DAY = 24 * 60;

type Filter = 'all' | 'unread';

const KIND_STYLES: Record<NotificationKind, { bg: string; fg: string }> = {
  offer: { bg: '#FBF1DD', fg: '#B7862F' },
  message: { bg: '#E6F0EC', fg: colors.primary },
  priceDrop: { bg: '#FBE9E1', fg: '#C2410C' },
  views: { bg: '#EAF0FB', fg: '#3B5BA9' },
  sold: { bg: '#E3F4EA', fg: '#1F8A4C' },
  protection: { bg: colors.sand, fg: colors.primaryDark },
};

function groupByDay(items: AppNotification[]) {
  const sections = [
    { title: 'Today', data: items.filter(n => n.minutesAgo < DAY) },
    {
      title: 'Yesterday',
      data: items.filter(n => n.minutesAgo >= DAY && n.minutesAgo < 2 * DAY),
    },
    { title: 'Earlier', data: items.filter(n => n.minutesAgo >= 2 * DAY) },
  ];
  return sections.filter(section => section.data.length > 0);
}

type Props = NativeStackScreenProps<RootStackParamList, 'Notifications'>;

export function NotificationsScreen({ navigation }: Props) {
  const { notifications, unreadCount, markRead } = useNotifications();
  const [filter, setFilter] = useState<Filter>('all');

  const sections = useMemo(
    () =>
      groupByDay(
        filter === 'unread'
          ? notifications.filter(n => !n.read)
          : notifications,
      ),
    [notifications, filter],
  );

  const open = (notification: AppNotification) => {
    markRead(notification.id);
    const { target } = notification;
    if (target.type === 'tab') {
      // Go back to the open Dashboard (navigate would push a second one).
      // Merging keeps its other params; `screen` switches the tab.
      navigation.popTo('Dashboard', { screen: target.tab }, { merge: true });
    } else {
      navigation.navigate('ComingSoon', { title: target.title });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.filters}>
        {(['all', 'unread'] as const).map(value => {
          const selected = filter === value;
          const label =
            value === 'all'
              ? 'All'
              : unreadCount > 0
              ? `Unread (${unreadCount})`
              : 'Unread';
          return (
            <Pressable
              key={value}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => setFilter(value)}
              style={[styles.chip, selected && styles.chipOn]}
            >
              <Text
                style={[styles.chipText, selected && styles.chipTextOn]}
                maxFontSizeMultiplier={1.3}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.list}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionTitle} accessibilityRole="header">
            {section.title}
          </Text>
        )}
        renderItem={({ item }) => (
          <NotificationRow notification={item} onPress={() => open(item)} />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <KindIcon kind="message" color={colors.primary} size={28} />
            </View>
            <Text style={styles.emptyTitle}>You're all caught up</Text>
            <Text style={styles.emptyBody}>
              New offers, messages and price drops will show up here.
            </Text>
          </View>
        }
      />
    </View>
  );
}

function NotificationRow({
  notification,
  onPress,
}: {
  notification: AppNotification;
  onPress: () => void;
}) {
  const kind = KIND_STYLES[notification.kind];
  const unread = !notification.read;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${unread ? 'Unread. ' : ''}${notification.title}. ${
        notification.body
      } ${formatAgo(notification.minutesAgo)}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        unread && styles.rowUnread,
        pressed && styles.rowPressed,
      ]}
    >
      <View style={[styles.icon, { backgroundColor: kind.bg }]}>
        <KindIcon kind={notification.kind} color={kind.fg} size={20} />
      </View>
      <View style={styles.rowBody}>
        <View style={styles.rowTop}>
          <Text
            style={[styles.title, unread && styles.titleUnread]}
            numberOfLines={2}
          >
            {notification.title}
          </Text>
          <Text style={styles.time}>{formatAgo(notification.minutesAgo)}</Text>
        </View>
        <Text style={styles.body} numberOfLines={2}>
          {notification.body}
        </Text>
      </View>
      {unread && <View style={styles.unreadDot} />}
    </Pressable>
  );
}

function KindIcon({
  kind,
  color,
  size,
}: {
  kind: NotificationKind;
  color: string;
  size: number;
}) {
  const stroke = {
    fill: 'none',
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {kind === 'offer' && (
        <>
          <Path d="M3 12V4h8l10 10-8 8z" {...stroke} />
          <Circle cx={7.5} cy={8.5} r={1.5} fill={color} />
        </>
      )}
      {kind === 'message' && (
        <Path
          d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.1A8 8 0 1 1 20 12z"
          {...stroke}
        />
      )}
      {kind === 'priceDrop' && (
        <Path d="M3 7l6 6 4-4 8 8M21 11v6h-6" {...stroke} />
      )}
      {kind === 'views' && (
        <>
          <Path
            d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"
            {...stroke}
          />
          <Circle cx={12} cy={12} r={3} {...stroke} />
        </>
      )}
      {kind === 'sold' && (
        <>
          <Circle cx={12} cy={12} r={9} {...stroke} />
          <Path d="m8 12.5 2.8 2.8L16.5 9.5" {...stroke} />
        </>
      )}
      {kind === 'protection' && (
        <>
          <Path
            d="M12 3 4.5 6v5.5c0 4.5 3.2 8.4 7.5 9.5 4.3-1.1 7.5-5 7.5-9.5V6L12 3z"
            {...stroke}
          />
          <Path d="m8.8 12.2 2.2 2.2 4.3-4.6" {...stroke} />
        </>
      )}
    </Svg>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
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
  list: {
    paddingBottom: 32,
    flexGrow: 1,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 6,
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowUnread: {
    backgroundColor: '#F3F8F6',
  },
  rowPressed: {
    backgroundColor: colors.offWhite,
  },
  icon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBody: {
    flex: 1,
    gap: 3,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    fontFamily: fonts.medium,
    color: colors.charcoal,
  },
  titleUnread: {
    fontFamily: fonts.bold,
    color: colors.ink,
  },
  time: {
    fontSize: 12,
    lineHeight: 20,
    fontFamily: fonts.regular,
    color: colors.muted,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  unreadDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginTop: 6,
    backgroundColor: colors.accent,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
    gap: 8,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.sand,
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: fonts.semiBold,
    color: colors.charcoal,
  },
  emptyBody: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});

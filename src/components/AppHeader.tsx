import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

export type HeaderIconName = 'menu' | 'bell' | 'heart' | 'filter';

export type HeaderAction = {
  icon: HeaderIconName;
  // Read by screen readers; the button shows only the icon.
  label: string;
  onPress: () => void;
  // A number shows a count; `true` shows a dot.
  badge?: number | boolean;
  // What the count means to a screen reader, e.g. "3 saved". Defaults to "new".
  badgeLabel?: string;
};

type AppHeaderProps = {
  title: string;
  onMenuPress?: () => void;
  actions?: HeaderAction[];
  // Content is scrolled under the header: show the divider.
  scrolled?: boolean;
  // Shown under the header row, e.g. a search bar.
  children?: ReactNode;
};

// Shared header for the bottom tabs: menu on the left, title in the
// middle, icon actions on the right.
export function AppHeader({
  title,
  onMenuPress,
  actions = [],
  scrolled = false,
  children,
}: AppHeaderProps) {
  return (
    <View
      testID="tab-header"
      style={[styles.container, scrolled && styles.containerScrolled]}
    >
      <View style={styles.row}>
        {onMenuPress && (
          <IconButton
            icon="menu"
            label="Open profile menu"
            onPress={onMenuPress}
            filled
          />
        )}
        <Text
          style={styles.title}
          accessibilityRole="header"
          numberOfLines={1}
          maxFontSizeMultiplier={1.4}
        >
          {title}
        </Text>
        {actions.length > 0 && (
          <View style={styles.actions}>
            {actions.map(action => (
              <IconButton key={action.label} {...action} />
            ))}
          </View>
        )}
      </View>
      {children}
    </View>
  );
}

type IconButtonProps = HeaderAction & {
  filled?: boolean;
};

function IconButton({
  icon,
  label,
  onPress,
  badge,
  badgeLabel = 'new',
  filled,
}: IconButtonProps) {
  const count = typeof badge === 'number' && badge > 0 ? badge : undefined;
  const showBadge = count !== undefined || badge === true;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={count ? `${label}, ${count} ${badgeLabel}` : label}
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => [
        styles.iconButton,
        filled && styles.iconButtonFilled,
        pressed && styles.pressed,
      ]}
    >
      <HeaderIcon name={icon} />
      {showBadge && (
        <View style={[styles.badge, !count && styles.badgeDot]}>
          {count !== undefined && (
            <Text style={styles.badgeText} maxFontSizeMultiplier={1}>
              {count > 9 ? '9+' : count}
            </Text>
          )}
        </View>
      )}
    </Pressable>
  );
}

function HeaderIcon({ name }: { name: HeaderIconName }) {
  const stroke = {
    fill: 'none',
    stroke: colors.charcoal,
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24">
      {name === 'menu' && <Path d="M4 7h16M4 12h16M4 17h10" {...stroke} />}
      {name === 'bell' && (
        <>
          <Path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z" {...stroke} />
          <Path d="M10 21h4" {...stroke} />
        </>
      )}
      {name === 'heart' && (
        <Path
          d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"
          {...stroke}
        />
      )}
      {name === 'filter' && (
        <>
          <Path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" {...stroke} />
          <Circle cx={16} cy={6} r={2} {...stroke} />
          <Circle cx={10} cy={12} r={2} {...stroke} />
          <Circle cx={18} cy={18} r={2} {...stroke} />
        </>
      )}
    </Svg>
  );
}

const styles = StyleSheet.create({
  // Full width, so the divider runs edge to edge; the padding below keeps
  // scrolling content from touching the header.
  container: {
    gap: 12,
    paddingTop: 12,
    paddingBottom: 12,
    marginHorizontal: -16,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'transparent',
  },
  containerScrolled: {
    borderBottomColor: colors.beige,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 48,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.ink,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.offWhite,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.beige,
  },
  iconButtonFilled: {
    borderRadius: 14,
    borderWidth: 0,
    backgroundColor: colors.sand,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 3,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.white,
  },
  badgeDot: {
    top: 9,
    right: 10,
    minWidth: 10,
    width: 10,
    height: 10,
    paddingHorizontal: 0,
    borderRadius: 5,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: fonts.bold,
    color: colors.primaryDark,
  },
  pressed: {
    opacity: 0.7,
  },
});

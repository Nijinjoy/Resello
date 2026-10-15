import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  Animated,
  BackHandler,
  PanResponder,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
  type PanResponderGestureState,
} from 'react-native';
import { ProfileDrawerContent } from '../components/ProfileDrawerContent';
import { useCurrentLocation } from '../hooks/useCurrentLocation';
import type { PickedPlace } from '../services/places';
import { colors } from '../theme/colors';

const MAX_WIDTH = 340;
const DURATION = 250;
// Width of the strip along the left edge that starts a swipe-to-open.
const EDGE_WIDTH = 14;
// How far (as a share of the drawer width) or how fast a swipe has to go
// to open or close the drawer when released.
const DISTANCE_THRESHOLD = 1 / 3;
const VELOCITY_THRESHOLD = 0.5;

type ProfileDrawerValue = {
  openDrawer: () => void;
};

const ProfileDrawerContext = createContext<ProfileDrawerValue | null>(null);

type ProfileDrawerProps = {
  phoneNumber?: string;
  onSelect?: (title: string) => void;
  onLogout?: () => void;
  children: ReactNode;
};

const clamp = (value: number) => Math.min(1, Math.max(0, value));

const isHorizontalSwipe = (gesture: PanResponderGestureState) =>
  Math.abs(gesture.dx) > 8 && Math.abs(gesture.dx) > Math.abs(gesture.dy) * 1.5;

// A slide-in panel drawn over the dashboard with Animated + PanResponder, so
// it needs no native drawer dependencies. It opens from the menu button or a
// swipe in from the left edge, and follows the finger when dragged closed.
export function ProfileDrawer({
  phoneNumber,
  onSelect,
  onLogout,
  children,
}: ProfileDrawerProps) {
  const { width: screenWidth } = useWindowDimensions();
  const width = Math.min(MAX_WIDTH, screenWidth * 0.86);
  const progress = useRef(new Animated.Value(0)).current;
  // Mounted while open, animating or being dragged.
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  // Kept here, not in the drawer content, so the location is looked up once
  // and a chosen place survives closing the drawer.
  const { location, refresh: refreshLocation } = useCurrentLocation();
  const [chosenPlace, setChosenPlace] = useState<PickedPlace>();

  const animateTo = useCallback(
    (toValue: 0 | 1) => {
      setOpen(toValue === 1);
      Animated.timing(progress, {
        toValue,
        duration: DURATION,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished && toValue === 0) {
          setVisible(false);
        }
      });
    },
    [progress],
  );

  const openDrawer = useCallback(() => {
    setVisible(true);
    animateTo(1);
  }, [animateTo]);

  const closeDrawer = useCallback(() => animateTo(0), [animateTo]);

  // Hide at once, so the next screen isn't covered by a closing drawer.
  const hideNow = () => {
    progress.stopAnimation();
    progress.setValue(0);
    setOpen(false);
    setVisible(false);
  };

  const handleSelect = (title: string) => {
    hideNow();
    onSelect?.(title);
  };

  const handleLogout = () => {
    hideNow();
    onLogout?.();
  };

  useEffect(() => {
    if (!open) {
      return;
    }
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        closeDrawer();
        return true;
      },
    );
    return () => subscription.remove();
  }, [open, closeDrawer]);

  // Swipe in from the left edge to pull the drawer open.
  const edgeResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) =>
          gesture.dx > 0 && isHorizontalSwipe(gesture),
        onPanResponderGrant: () => {
          progress.stopAnimation();
          setVisible(true);
        },
        onPanResponderMove: (_, gesture) =>
          progress.setValue(clamp(gesture.dx / width)),
        onPanResponderRelease: (_, gesture) =>
          animateTo(
            gesture.dx > width * DISTANCE_THRESHOLD ||
              gesture.vx > VELOCITY_THRESHOLD
              ? 1
              : 0,
          ),
        onPanResponderTerminate: () => animateTo(0),
      }),
    [animateTo, progress, width],
  );

  // Drag the open drawer to the left to close it. Vertical drags are left to
  // the menu's ScrollView.
  const panelResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) =>
          gesture.dx < 0 && isHorizontalSwipe(gesture),
        onPanResponderGrant: () => progress.stopAnimation(),
        onPanResponderMove: (_, gesture) =>
          progress.setValue(clamp(1 + gesture.dx / width)),
        onPanResponderRelease: (_, gesture) =>
          animateTo(
            gesture.dx < -width * DISTANCE_THRESHOLD ||
              gesture.vx < -VELOCITY_THRESHOLD
              ? 0
              : 1,
          ),
        onPanResponderTerminate: () => animateTo(1),
      }),
    [animateTo, progress, width],
  );

  const value = useMemo(() => ({ openDrawer }), [openDrawer]);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, 0],
  });

  return (
    <ProfileDrawerContext.Provider value={value}>
      <View
        style={styles.root}
        // Keep screen readers inside the drawer while it is open.
        accessibilityElementsHidden={open}
        importantForAccessibility={open ? 'no-hide-descendants' : 'auto'}
      >
        {children}
      </View>

      {!visible && <View style={styles.edge} {...edgeResponder.panHandlers} />}

      {visible && (
        <View style={StyleSheet.absoluteFill} {...panelResponder.panHandlers}>
          <Animated.View style={[styles.backdrop, { opacity: progress }]}>
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={closeDrawer}
              accessibilityRole="button"
              accessibilityLabel="Close menu"
            />
          </Animated.View>
          <Animated.View
            style={[styles.panel, { width, transform: [{ translateX }] }]}
            accessibilityViewIsModal
            onAccessibilityEscape={closeDrawer}
          >
            <ProfileDrawerContent
              phoneNumber={phoneNumber}
              location={location}
              chosenPlace={chosenPlace}
              onChoosePlace={setChosenPlace}
              onRefreshLocation={refreshLocation}
              onSelect={handleSelect}
              onLogout={handleLogout}
            />
          </Animated.View>
        </View>
      )}
    </ProfileDrawerContext.Provider>
  );
}

export function useProfileDrawer() {
  const value = useContext(ProfileDrawerContext);
  if (!value) {
    throw new Error('useProfileDrawer must be used inside ProfileDrawer');
  }
  return value;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  edge: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: EDGE_WIDTH,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(17, 17, 17, 0.45)',
  },
  panel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    backgroundColor: colors.white,
    shadowColor: colors.ink,
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
    elevation: 16,
  },
});

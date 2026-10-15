import { useState, type ReactNode } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  type ImagePickerResponse,
} from 'react-native-image-picker';
import Svg, { Circle, Path } from 'react-native-svg';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import { LocationPicker } from '../components/LocationPicker';
import { TextField } from '../components/TextField';
import { useCurrentLocation } from '../hooks/useCurrentLocation';
import type { PickedPlace } from '../services/places';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { TabScreen, useTabScroll } from './TabScreen';

const MAX_PHOTOS = 6;
const MAX_DESCRIPTION = 1000;
const DANGER = '#C2410C';

const CATEGORIES = [
  'Phones',
  'Electronics',
  'Furniture',
  'Fashion',
  'Gaming',
  'Baby & kids',
  'Bikes',
  'Other',
];

const CONDITIONS = ['New', 'Like new', 'Good', 'Fair'];

type Errors = Partial<
  Record<'photos' | 'title' | 'category' | 'condition' | 'price', string>
>;

// Resized on device so uploads stay small.
const PICKER_OPTIONS = {
  mediaType: 'photo',
  quality: 0.8,
  maxWidth: 1600,
  maxHeight: 1600,
} as const;

function pickerErrorMessage(response: ImagePickerResponse) {
  switch (response.errorCode) {
    case 'camera_unavailable':
      return 'No camera is available on this device.';
    case 'permission':
      return 'Allow camera and photo access for Resello in Settings.';
    default:
      return response.errorMessage ?? 'Something went wrong. Try again.';
  }
}

function validate(fields: {
  photos: string[];
  title: string;
  category?: string;
  condition?: string;
  price: string;
}): Errors {
  const errors: Errors = {};
  if (fields.photos.length === 0) {
    errors.photos = 'Add at least one photo.';
  }
  if (fields.title.trim().length < 3) {
    errors.title = 'Enter a title of at least 3 characters.';
  }
  if (!fields.category) {
    errors.category = 'Choose a category.';
  }
  if (!fields.condition) {
    errors.condition = 'Choose the condition.';
  }
  if (!(Number(fields.price) > 0)) {
    errors.price = 'Enter a price above 0.';
  }
  return errors;
}

export function SellScreen() {
  const { scrolled, onScroll } = useTabScroll();
  const [photos, setPhotos] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>();
  const [condition, setCondition] = useState<string>();
  const [price, setPrice] = useState('');
  const [negotiable, setNegotiable] = useState(true);
  const [description, setDescription] = useState('');
  // Unset means the device's current location.
  const [pickup, setPickup] = useState<PickedPlace>();
  const [submitted, setSubmitted] = useState(false);
  const [posted, setPosted] = useState(false);

  const fields = { photos, title, category, condition, price };
  const errors = submitted ? validate(fields) : {};

  const addPhotos = async (source: 'camera' | 'library') => {
    const response =
      source === 'camera'
        ? await launchCamera(PICKER_OPTIONS)
        : await launchImageLibrary({
            ...PICKER_OPTIONS,
            selectionLimit: MAX_PHOTOS - photos.length,
          });
    if (response.didCancel) {
      return;
    }
    if (response.errorCode) {
      Alert.alert("Couldn't add photos", pickerErrorMessage(response));
      return;
    }
    const uris = (response.assets ?? []).flatMap(asset =>
      asset.uri ? [asset.uri] : [],
    );
    setPhotos(current => [...current, ...uris].slice(0, MAX_PHOTOS));
  };

  const choosePhotoSource = () =>
    Alert.alert('Add photos', undefined, [
      { text: 'Take photo', onPress: () => addPhotos('camera') },
      { text: 'Choose from library', onPress: () => addPhotos('library') },
      { text: 'Cancel', style: 'cancel' },
    ]);

  const removePhoto = (index: number) =>
    setPhotos(current => current.filter((_, i) => i !== index));

  const makeCover = (index: number) =>
    setPhotos(current => [
      current[index],
      ...current.filter((_, i) => i !== index),
    ]);

  const reset = () => {
    setPhotos([]);
    setTitle('');
    setCategory(undefined);
    setCondition(undefined);
    setPrice('');
    setNegotiable(true);
    setDescription('');
    setPickup(undefined);
    setSubmitted(false);
    setPosted(false);
  };

  // No listings backend yet: a valid form just shows the success state.
  const handlePost = () => {
    setSubmitted(true);
    if (Object.keys(validate(fields)).length) {
      return;
    }
    setPosted(true);
  };

  if (posted) {
    return (
      <TabScreen scrolled={scrolled}>
        <View style={styles.success}>
          <View style={styles.successIcon}>
            <Svg width={36} height={36} viewBox="0 0 24 24">
              <Path
                d="m5 12.5 4.5 4.5L19 7.5"
                fill="none"
                stroke={colors.white}
                strokeWidth={2.4}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
          <Text style={styles.successTitle} accessibilityRole="header">
            Your listing is live
          </Text>
          <Text style={styles.successBody}>
            {`${title.trim()} · AED ${Number(price).toLocaleString('en-US')}`}
          </Text>
          <View style={styles.successActions}>
            <PrimaryButton label="Sell another item" onPress={reset} />
          </View>
        </View>
      </TabScreen>
    );
  }

  return (
    <TabScreen scrolled={scrolled}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          onScroll={onScroll}
          scrollEventThrottle={16}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Section
            title="Photos"
            hint={`Add up to ${MAX_PHOTOS} photos`}
            error={errors.photos}
          >
            <PhotoSlots
              photos={photos}
              onAdd={choosePhotoSource}
              onRemove={removePhoto}
              onMakeCover={makeCover}
            />
          </Section>

          <TextField
            label="Title"
            placeholder="e.g. iPhone 13 Pro, 256GB"
            value={title}
            onChangeText={setTitle}
            error={errors.title}
            maxLength={70}
            returnKeyType="next"
          />

          <Section title="Category" error={errors.category}>
            <ChipGroup
              options={CATEGORIES}
              value={category}
              onChange={setCategory}
            />
          </Section>

          <Section title="Condition" error={errors.condition}>
            <View style={styles.segmented}>
              {CONDITIONS.map(option => {
                const selected = option === condition;
                return (
                  <Pressable
                    key={option}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => setCondition(option)}
                    style={[styles.segment, selected && styles.segmentOn]}
                  >
                    <Text
                      style={[
                        styles.segmentText,
                        selected && styles.segmentTextOn,
                      ]}
                      maxFontSizeMultiplier={1.3}
                    >
                      {option}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Section>

          <View style={styles.group}>
            <TextField
              label="Price"
              placeholder="0"
              value={price}
              onChangeText={text => setPrice(text.replace(/[^0-9]/g, ''))}
              error={errors.price}
              keyboardType="number-pad"
              maxLength={9}
              prefix={<Text style={styles.currency}>AED</Text>}
            />
            <View style={styles.switchRow}>
              <View style={styles.switchText}>
                <Text style={styles.switchLabel}>Open to offers</Text>
                <Text style={styles.switchHint}>
                  Buyers can suggest a lower price.
                </Text>
              </View>
              <Switch
                value={negotiable}
                onValueChange={setNegotiable}
                accessibilityLabel="Open to offers"
                trackColor={{ true: colors.primaryLight, false: colors.beige }}
                thumbColor={colors.white}
                ios_backgroundColor={colors.beige}
              />
            </View>
          </View>

          <Section
            title="Description"
            hint={`${description.length}/${MAX_DESCRIPTION}`}
          >
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Include details like size, age, any wear, and what's included."
              placeholderTextColor={colors.beige}
              accessibilityLabel="Description"
              multiline
              maxLength={MAX_DESCRIPTION}
              textAlignVertical="top"
              maxFontSizeMultiplier={1.6}
              style={styles.description}
            />
          </Section>

          <Section title="Pickup location">
            <PickupLocation value={pickup} onChange={setPickup} />
          </Section>

          <View style={styles.actions}>
            <PrimaryButton label="Post listing" onPress={handlePost} />
            <SecondaryButton label="Clear form" onPress={reset} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TabScreen>
  );
}

function Section({
  title,
  hint,
  error,
  children,
}: {
  title: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.group}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.5}>
          {title}
        </Text>
        {hint && (
          <Text style={styles.sectionHint} maxFontSizeMultiplier={1.4}>
            {hint}
          </Text>
        )}
      </View>
      {children}
      {error && (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      )}
    </View>
  );
}

type PhotoSlotsProps = {
  photos: string[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onMakeCover: (index: number) => void;
};

function PhotoSlots({ photos, onAdd, onRemove, onMakeCover }: PhotoSlotsProps) {
  const placeholders = Math.max(0, 3 - photos.length);
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.photos}
    >
      {photos.length < MAX_PHOTOS && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add photos"
          onPress={onAdd}
          style={({ pressed }) => [styles.addPhoto, pressed && styles.pressed]}
        >
          <Svg width={28} height={28} viewBox="0 0 24 24">
            <Path
              d="M4 8.5A2.5 2.5 0 0 1 6.5 6h1.8l1.4-2h4.6l1.4 2h1.8A2.5 2.5 0 0 1 20 8.5v9a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5z"
              fill="none"
              stroke={colors.primary}
              strokeWidth={1.8}
              strokeLinejoin="round"
            />
            <Circle
              cx={12}
              cy={12.5}
              r={3.5}
              fill="none"
              stroke={colors.primary}
              strokeWidth={1.8}
            />
          </Svg>
          <Text style={styles.addPhotoText}>Add photos</Text>
          <Text style={styles.addPhotoCount}>
            {`${photos.length}/${MAX_PHOTOS}`}
          </Text>
        </Pressable>
      )}
      {photos.map((uri, index) => (
        <Pressable
          key={uri}
          accessibilityRole="button"
          accessibilityLabel={
            index === 0 ? 'Cover photo' : `Photo ${index + 1}`
          }
          accessibilityHint={
            index === 0 ? undefined : 'Double tap to make it the cover'
          }
          onPress={() => onMakeCover(index)}
          style={styles.photoSlot}
        >
          <Image source={{ uri }} style={styles.photoImage} />
          {index === 0 && <Text style={styles.coverText}>Cover</Text>}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Remove photo ${index + 1}`}
            onPress={() => onRemove(index)}
            hitSlop={8}
            style={({ pressed }) => [
              styles.removePhoto,
              pressed && styles.pressed,
            ]}
          >
            <Svg width={12} height={12} viewBox="0 0 24 24">
              <Path
                d="M6 6l12 12M18 6 6 18"
                stroke={colors.white}
                strokeWidth={3}
                strokeLinecap="round"
              />
            </Svg>
          </Pressable>
        </Pressable>
      ))}
      {Array.from({ length: placeholders }, (_, index) => (
        <View key={`empty-${index}`} style={styles.photoSlot}>
          {photos.length === 0 && index === 0 && (
            <Text style={styles.coverText}>Cover</Text>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

function ChipGroup({
  options,
  value,
  onChange,
}: {
  options: string[];
  value?: string;
  onChange: (value: string) => void;
}) {
  return (
    <View style={styles.chips}>
      {options.map(option => {
        const selected = option === value;
        return (
          <Pressable
            key={option}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(option)}
            style={[styles.chip, selected && styles.chipOn]}
          >
            <Text
              style={[styles.chipText, selected && styles.chipTextOn]}
              maxFontSizeMultiplier={1.3}
            >
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

type PickupLocationProps = {
  value?: PickedPlace;
  onChange: (place?: PickedPlace) => void;
};

// Defaults to the device location; tap to search for another place.
function PickupLocation({ value, onChange }: PickupLocationProps) {
  const { location, refresh } = useCurrentLocation();
  const [picking, setPicking] = useState(false);

  const currentLabel =
    location.status === 'loading'
      ? 'Finding your location…'
      : location.status === 'ready'
      ? location.place?.name ?? 'Current location'
      : 'Location unavailable';
  const label = value?.name ?? currentLabel;
  const subtitle = value
    ? value.address
    : location.status === 'ready'
    ? 'Your current location'
    : undefined;

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Pickup location: ${label}`}
        accessibilityHint="Double tap to choose a different place"
        onPress={() => setPicking(true)}
        style={({ pressed }) => [styles.location, pressed && styles.pressed]}
      >
        <Svg width={20} height={20} viewBox="0 0 24 24">
          <Path
            d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"
            fill="none"
            stroke={colors.primary}
            strokeWidth={1.8}
            strokeLinejoin="round"
          />
          <Circle cx={12} cy={9.5} r={2.5} fill={colors.primary} />
        </Svg>
        <View style={styles.locationBody}>
          <Text style={styles.locationText} numberOfLines={1}>
            {label}
          </Text>
          {subtitle && (
            <Text style={styles.locationSubtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
        <Text style={styles.locationAction}>Change</Text>
      </Pressable>
      <LocationPicker
        visible={picking}
        currentLabel={currentLabel}
        near={location.status === 'ready' ? location.coords : undefined}
        onSelect={place => {
          onChange(place);
          setPicking(false);
        }}
        onUseCurrent={() => {
          onChange(undefined);
          refresh();
          setPicking(false);
        }}
        onClose={() => setPicking(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scroll: {
    marginHorizontal: -16,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 32,
    gap: 22,
  },
  group: {
    gap: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.charcoal,
  },
  sectionHint: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  error: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: DANGER,
  },
  photos: {
    gap: 10,
  },
  addPhoto: {
    width: 104,
    height: 104,
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.primaryLight,
    backgroundColor: '#EEF5F2',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  addPhotoText: {
    marginTop: 4,
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.primary,
  },
  addPhotoCount: {
    fontSize: 11,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  photoSlot: {
    width: 104,
    height: 104,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.offWhite,
    borderWidth: 1,
    borderColor: '#EFE7D8',
    justifyContent: 'flex-end',
    padding: 8,
  },
  photoImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  removePhoto: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(17, 17, 17, 0.6)',
  },
  coverText: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
    fontSize: 11,
    fontFamily: fonts.semiBold,
    color: colors.textMuted,
    backgroundColor: colors.sand,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    minHeight: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: '#E6DDCC',
  },
  chipOn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.charcoal,
  },
  chipTextOn: {
    color: colors.white,
  },
  segmented: {
    flexDirection: 'row',
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
    shadowColor: colors.ink,
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  segmentText: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.textMuted,
  },
  segmentTextOn: {
    fontFamily: fonts.semiBold,
    color: colors.primary,
  },
  currency: {
    marginRight: 8,
    fontSize: 17,
    fontFamily: fonts.semiBold,
    color: colors.textMuted,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  switchText: {
    flex: 1,
  },
  switchLabel: {
    fontSize: 15,
    fontFamily: fonts.medium,
    color: colors.charcoal,
  },
  switchHint: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  description: {
    minHeight: 120,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E6DDCC',
    backgroundColor: colors.white,
    fontSize: 16,
    lineHeight: 22,
    fontFamily: fonts.regular,
    color: colors.charcoal,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 52,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: colors.offWhite,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.beige,
  },
  locationBody: {
    flex: 1,
  },
  locationSubtitle: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  locationText: {
    fontSize: 15,
    fontFamily: fonts.medium,
    color: colors.charcoal,
  },
  locationAction: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.primary,
  },
  actions: {
    gap: 4,
    marginTop: 4,
  },
  success: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 8,
  },
  successIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    marginBottom: 8,
  },
  successTitle: {
    fontSize: 22,
    fontFamily: fonts.bold,
    color: colors.charcoal,
  },
  successBody: {
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    textAlign: 'center',
  },
  successActions: {
    alignSelf: 'stretch',
    marginTop: 20,
  },
  pressed: {
    opacity: 0.7,
  },
});

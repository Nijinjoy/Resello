import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import CountryPicker, {
  type CountryCode as PickerCountryCode,
} from 'react-native-country-picker-modal';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import {
  callingCode,
  flagEmoji,
  SUPPORTED_COUNTRIES,
  type CountryCode,
} from '../utils/phone';

// UAE first, then the GCC and the largest expat communities.
const PREFERRED_COUNTRIES: CountryCode[] = [
  'AE',
  'SA',
  'QA',
  'KW',
  'BH',
  'OM',
  'IN',
  'PK',
  'PH',
  'EG',
  'GB',
];

// Only offer countries libphonenumber-js can validate.
const PICKER_COUNTRIES = SUPPORTED_COUNTRIES as unknown as PickerCountryCode[];

type CountryCodePickerProps = {
  country: CountryCode;
  onChange: (country: CountryCode) => void;
};

export function CountryCodePicker({
  country,
  onChange,
}: CountryCodePickerProps) {
  const [visible, setVisible] = useState(false);

  return (
    <CountryPicker
      countryCode={country as PickerCountryCode}
      countryCodes={PICKER_COUNTRIES}
      preferredCountries={PREFERRED_COUNTRIES as PickerCountryCode[]}
      visible={visible}
      onOpen={() => setVisible(true)}
      onClose={() => setVisible(false)}
      onSelect={selected => {
        onChange(selected.cca2 as CountryCode);
        setVisible(false);
      }}
      withFilter
      withCallingCode
      withEmoji
      filterProps={{ placeholder: 'Search country or code' }}
      theme={{
        primaryColor: colors.beige,
        primaryColorVariant: '#F1EADC',
        backgroundColor: colors.offWhite,
        onBackgroundTextColor: colors.charcoal,
        filterPlaceholderTextColor: colors.textMuted,
        fontFamily: fonts.regular,
        fontSize: 16,
        itemHeight: 56,
      }}
      renderFlagButton={() => (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Country code: ${callingCode(country)}`}
          onPress={() => setVisible(true)}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        >
          <Text style={styles.flag}>{flagEmoji(country)}</Text>
          <Text style={styles.code} maxFontSizeMultiplier={1.5}>
            {callingCode(country)}
          </Text>
          <Svg width={12} height={12} viewBox="0 0 12 12">
            <Path
              d="M2.5 4.5 L6 8 L9.5 4.5"
              fill="none"
              stroke={colors.textMuted}
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: 6,
    minHeight: 44,
    marginEnd: 12,
    paddingEnd: 12,
    borderEndWidth: 1,
    borderEndColor: '#E6DDCC',
  },
  flag: {
    fontSize: 20,
  },
  code: {
    fontFamily: fonts.medium,
    fontSize: 17,
    color: colors.charcoal,
  },
  pressed: {
    opacity: 0.6,
  },
});

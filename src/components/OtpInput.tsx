import { useRef, useState, type ComponentRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

type OtpInputProps = {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  accessibilityLabel: string;
  hasError?: boolean;
};

// One hidden input drives the boxes, so typing, deleting, pasting and the
// iOS / Android SMS code autofill all work like a normal text field.
export function OtpInput({
  length = 6,
  value,
  onChange,
  accessibilityLabel,
  hasError,
}: OtpInputProps) {
  const inputRef = useRef<ComponentRef<typeof TextInput>>(null);
  const [focused, setFocused] = useState(false);

  return (
    <Pressable
      onPress={() => inputRef.current?.focus()}
      accessible={false}
      style={styles.container}
    >
      <View style={styles.row}>
        {Array.from({ length }, (_, index) => {
          const digit = value[index] ?? '';
          const isActive =
            focused &&
            (index === value.length ||
              (value.length === length && index === length - 1));
          return (
            <View
              key={index}
              style={[
                styles.box,
                !!digit && styles.boxFilled,
                isActive && styles.boxActive,
                hasError && styles.boxError,
              ]}
            >
              <Text style={styles.digit} maxFontSizeMultiplier={1.4}>
                {digit}
              </Text>
            </View>
          );
        })}
      </View>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={text =>
          onChange(text.replace(/\D/g, '').slice(0, length))
        }
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        maxLength={length}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        autoFocus
        caretHidden
        accessibilityLabel={accessibilityLabel}
        style={styles.hiddenInput}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    // Codes read left to right in every language.
    direction: 'ltr',
  },
  box: {
    flex: 1,
    maxWidth: 56,
    aspectRatio: 0.86,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E6DDCC',
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxFilled: {
    borderColor: colors.beige,
  },
  boxActive: {
    borderColor: colors.primary,
  },
  boxError: {
    borderColor: '#C2410C',
  },
  digit: {
    fontFamily: fonts.semiBold,
    fontSize: 24,
    color: colors.charcoal,
  },
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
});

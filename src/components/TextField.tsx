import { useState, type ComponentRef, type ReactNode, type Ref } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

type TextFieldProps = Omit<TextInputProps, 'style'> & {
  ref?: Ref<ComponentRef<typeof TextInput>>;
  label: string;
  error?: string;
  // Shown before the input, e.g. a country code.
  prefix?: ReactNode;
};

export function TextField({
  ref,
  label,
  error,
  prefix,
  ...inputProps
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View>
      <Text style={styles.label} maxFontSizeMultiplier={1.5}>
        {label}
      </Text>
      <View
        style={[
          styles.field,
          focused && styles.fieldFocused,
          !!error && styles.fieldError,
        ]}
      >
        {prefix}
        <TextInput
          ref={ref}
          {...inputProps}
          accessibilityLabel={label}
          placeholderTextColor={colors.beige}
          maxFontSizeMultiplier={1.6}
          onFocus={event => {
            setFocused(true);
            inputProps.onFocus?.(event);
          }}
          onBlur={event => {
            setFocused(false);
            inputProps.onBlur?.(event);
          }}
          style={styles.input}
        />
      </View>
      {!!error && (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 8,
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.charcoal,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E6DDCC',
    backgroundColor: colors.white,
  },
  fieldFocused: {
    borderColor: colors.primary,
  },
  fieldError: {
    borderColor: '#C2410C',
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontFamily: fonts.regular,
    fontSize: 17,
    color: colors.charcoal,
  },
  error: {
    marginTop: 6,
    fontFamily: fonts.regular,
    fontSize: 13,
    color: '#C2410C',
  },
});

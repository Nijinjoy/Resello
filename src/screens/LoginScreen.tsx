import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PrimaryButton } from '../components/Button';
import { Logo } from '../components/Logo';
import { CountryCodePicker } from '../components/CountryCodePicker';
import { TextField } from '../components/TextField';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import {
  examplePlaceholder,
  formatNational,
  nationalDigits,
  parseInternational,
  toE164,
  type CountryCode,
} from '../utils/phone';

type LoginScreenProps = {
  onContinue?: (phoneNumber: string) => void;
};

export function LoginScreen({ onContinue }: LoginScreenProps) {
  const insets = useSafeAreaInsets();
  const [country, setCountry] = useState<CountryCode>('AE');
  const [digits, setDigits] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const formatted = formatNational(country, digits);
  const e164 = toE164(country, digits);
  const error =
    submitted && !e164
      ? 'Enter a valid mobile number for the selected country.'
      : undefined;

  const handleChangeText = (text: string) => {
    const pasted = parseInternational(text);
    if (pasted) {
      setCountry(pasted.country);
      setDigits(pasted.digits);
      return;
    }
    const next = nationalDigits(text);
    const deletedSpace = next === digits && text.length < formatted.length;
    setDigits(deletedSpace ? digits.slice(0, -1) : next);
  };

  const handleContinue = () => {
    setSubmitted(true);
    if (e164) {
      onContinue?.(e164);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + 8,
            paddingBottom: Math.max(insets.bottom, 16) + 12,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.intro}>
          <Logo size={56} />
          <Text
            style={styles.title}
            accessibilityRole="header"
            maxFontSizeMultiplier={1.5}
          >
            Log in with your phone
          </Text>
          <Text style={styles.subtitle} maxFontSizeMultiplier={1.7}>
            Enter your mobile number. We'll log you in or create your account.
          </Text>
        </View>

        <View style={styles.form}>
          <TextField
            label="Mobile number"
            placeholder={examplePlaceholder(country)}
            value={formatted}
            onChangeText={handleChangeText}
            error={error}
            prefix={
              <CountryCodePicker country={country} onChange={setCountry} />
            }
            keyboardType="phone-pad"
            autoComplete="tel"
            autoFocus
          />
        </View>

        <View style={styles.actions}>
          <PrimaryButton label="Continue" onPress={handleContinue} />
          <Text style={styles.terms} maxFontSizeMultiplier={1.5}>
            By continuing, you agree to our Terms and Privacy Policy.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.offWhite,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  intro: {
    marginTop: 48,
    alignItems: 'center',
  },
  title: {
    marginTop: 20,
    fontFamily: fonts.bold,
    fontSize: 28,
    lineHeight: 36,
    color: colors.charcoal,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 24,
    color: colors.textMuted,
    textAlign: 'center',
  },
  form: {
    marginTop: 32,
  },
  actions: {
    marginTop: 24,
    gap: 12,
  },
  terms: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
    textAlign: 'center',
  },
});

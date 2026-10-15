import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PrimaryButton } from '../components/Button';
import { Logo } from '../components/Logo';
import { OtpInput } from '../components/OtpInput';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { formatInternational } from '../utils/phone';

const CODE_LENGTH = 6;
const RESEND_SECONDS = 30;

type OtpScreenProps = {
  // International format, e.g. "+971501234567".
  phoneNumber: string;
  onVerify?: (code: string) => void;
  onResend?: () => void;
  onChangeNumber?: () => void;
};

export function OtpScreen({
  phoneNumber,
  onVerify,
  onResend,
  onChangeNumber,
}: OtpScreenProps) {
  const insets = useSafeAreaInsets();
  const [code, setCode] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (secondsLeft === 0) {
      return;
    }
    const timer = setTimeout(() => setSecondsLeft(s => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const isComplete = code.length === CODE_LENGTH;

  const verify = (value: string) => {
    setSubmitted(true);
    if (value.length === CODE_LENGTH) {
      onVerify?.(value);
    }
  };

  // Waits for the Verify button; doesn't submit on the last digit.
  const handleChange = (value: string) => setCode(value);

  const handleResend = () => {
    setCode('');
    setSubmitted(false);
    setSecondsLeft(RESEND_SECONDS);
    onResend?.();
  };

  const displayNumber = formatInternational(phoneNumber);

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
            Enter verification code
          </Text>
          <Text style={styles.subtitle} maxFontSizeMultiplier={1.7}>
            {`We sent a 6-digit code to ${displayNumber}`}
          </Text>
          {onChangeNumber && (
            <Pressable
              accessibilityRole="button"
              onPress={onChangeNumber}
              style={({ pressed }) => [styles.link, pressed && styles.pressed]}
            >
              <Text style={styles.linkText} maxFontSizeMultiplier={1.5}>
                Change number
              </Text>
            </Pressable>
          )}
        </View>

        <View style={styles.form}>
          <OtpInput
            length={CODE_LENGTH}
            value={code}
            onChange={handleChange}
            accessibilityLabel="Verification code"
            hasError={submitted && !isComplete}
          />
          {submitted && !isComplete && (
            <Text style={styles.error} accessibilityLiveRegion="polite">
              Enter all 6 digits.
            </Text>
          )}
        </View>

        <View style={styles.actions}>
          <PrimaryButton label="Verify" onPress={() => verify(code)} />
          {secondsLeft > 0 ? (
            <Text style={styles.resendWait} maxFontSizeMultiplier={1.5}>
              {`Resend code in 0:${String(secondsLeft).padStart(2, '0')}`}
            </Text>
          ) : (
            <Pressable
              accessibilityRole="button"
              onPress={handleResend}
              style={({ pressed }) => [styles.link, pressed && styles.pressed]}
            >
              <Text style={styles.linkText} maxFontSizeMultiplier={1.5}>
                Resend code
              </Text>
            </Pressable>
          )}
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
    alignItems: 'center',
  },
  error: {
    marginTop: 10,
    fontFamily: fonts.regular,
    fontSize: 13,
    color: '#C2410C',
  },
  actions: {
    marginTop: 24,
    gap: 4,
    alignItems: 'stretch',
  },
  resendWait: {
    minHeight: 44,
    paddingTop: 12,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
  },
  link: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  linkText: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.primary,
  },
  pressed: {
    opacity: 0.7,
  },
});

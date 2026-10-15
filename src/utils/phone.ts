// Mobile number helpers on top of libphonenumber-js (mobile metadata, so
// validation only accepts numbers that can be mobiles in that country).
import {
  AsYouType,
  getCountries,
  getCountryCallingCode,
  getExampleNumber,
  parsePhoneNumberFromString,
  type CountryCode,
} from 'libphonenumber-js/mobile';
import examples from 'libphonenumber-js/mobile/examples';

export type { CountryCode };

export const SUPPORTED_COUNTRIES = getCountries();

// E.164 allows at most 15 digits including the country code.
const MAX_DIGITS = 15;

export function callingCode(country: CountryCode): string {
  return `+${getCountryCallingCode(country)}`;
}

// National digits as typed: strips spaces and symbols and the domestic
// trunk "0" (e.g. UAE "050…" -> "50…").
export function nationalDigits(input: string): string {
  return input.replace(/\D/g, '').replace(/^0+/, '').slice(0, MAX_DIGITS);
}

// Groups the digits the way the country writes them: AE "50 123 4567".
export function formatNational(country: CountryCode, digits: string): string {
  const prefix = callingCode(country);
  return new AsYouType(country)
    .input(prefix + digits)
    .slice(prefix.length)
    .trim();
}

export function examplePlaceholder(country: CountryCode): string {
  const example = getExampleNumber(country, examples);
  return example ? formatNational(country, example.nationalNumber) : '';
}

// "+971501234567" for a valid mobile number, otherwise undefined.
export function toE164(country: CountryCode, digits: string) {
  const number = parsePhoneNumberFromString(callingCode(country) + digits);
  return number?.isValid() && number.country === country
    ? number.number
    : undefined;
}

// A pasted international number ("+44 7400 123456") picks its own country.
export function parseInternational(input: string) {
  if (!input.trim().startsWith('+')) {
    return undefined;
  }
  const number = parsePhoneNumberFromString(input);
  return number?.country
    ? { country: number.country, digits: number.nationalNumber as string }
    : undefined;
}

export function flagEmoji(country: CountryCode): string {
  return String.fromCodePoint(
    ...[...country].map(letter => 0x1f1e6 + letter.charCodeAt(0) - 65),
  );
}

// "+971501234567" -> "+971 50 123 4567".
export function formatInternational(e164: string): string {
  return parsePhoneNumberFromString(e164)?.formatInternational() ?? e164;
}

import {
  examplePlaceholder,
  formatNational,
  nationalDigits,
  parseInternational,
  toE164,
} from '../src/utils/phone';

test('nationalDigits strips formatting and the trunk 0', () => {
  expect(nationalDigits('050 123 4567')).toBe('501234567');
  expect(nationalDigits('(50) 123-4567')).toBe('501234567');
});

test('formats numbers per country while typing', () => {
  expect(formatNational('AE', '5012')).toBe('50 12');
  expect(formatNational('AE', '501234567')).toBe('50 123 4567');
  expect(formatNational('IN', '9876543210')).toBe('98765 43210');
  expect(examplePlaceholder('AE')).toBe('50 123 4567');
});

test('validates mobile numbers for the selected country', () => {
  expect(toE164('AE', '501234567')).toBe('+971501234567');
  expect(toE164('AE', '41234567')).toBeUndefined();
  expect(toE164('SA', '501234567')).toBe('+966501234567');
  expect(toE164('AE', '5012')).toBeUndefined();
});

test('a pasted international number picks its country', () => {
  expect(parseInternational('+44 7400 123456')).toEqual({
    country: 'GB',
    digits: '7400123456',
  });
  expect(parseInternational('050 123 4567')).toBeUndefined();
});

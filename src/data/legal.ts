// Terms of use and privacy policy shown in the app.
// DRAFT: written as a starting point, not legal advice. Have it reviewed by a
// lawyer and replace SUPPORT_EMAIL before launch.

export const LEGAL_LAST_UPDATED = '15 October 2026';

// Placeholder: replace with the real support address.
export const SUPPORT_EMAIL = 'support@resello.app';

export type LegalSection = {
  id: string;
  title: string;
  paragraphs: string[];
};

export const TERMS: LegalSection[] = [
  {
    id: 't1',
    title: 'About these terms',
    paragraphs: [
      'These terms apply when you use Resello to buy or sell pre-loved items. By creating an account or using the app, you agree to them. If you don’t agree, please don’t use Resello.',
      'Resello is a marketplace: we connect buyers and sellers, but we are not the seller of items listed by users, and we don’t own or inspect them.',
    ],
  },
  {
    id: 't2',
    title: 'Your account',
    paragraphs: [
      'You need a mobile number to sign up, and you must be at least 18 years old. Keep your account secure: you are responsible for activity on it, so don’t share verification codes with anyone.',
      'Give accurate information and keep it up to date. One person may hold one account.',
    ],
  },
  {
    id: 't3',
    title: 'Selling on Resello',
    paragraphs: [
      'You may only list items you own and have the right to sell. Describe each item honestly, including its condition and any faults, and use your own photos.',
      'Once a buyer pays, you agree to hand over or ship the item as described within the agreed time. Mark items as sold or remove them when they are no longer available.',
    ],
  },
  {
    id: 't4',
    title: 'Buying on Resello',
    paragraphs: [
      'Read the listing carefully and ask the seller questions in chat before you buy. Prices are in UAE dirhams (AED) and are set by sellers.',
      'When you check out, you pay the item price plus a buyer protection fee and a flat platform fee, shown before you confirm.',
    ],
  },
  {
    id: 't5',
    title: 'Buyer protection',
    paragraphs: [
      'If an item doesn’t arrive, or is significantly different from its description, report it within 48 hours of delivery or pickup. If the claim is accepted, we refund the item price and buyer protection fee.',
      'Buyer protection only covers purchases paid through Resello checkout. Payments made outside the app aren’t covered.',
    ],
  },
  {
    id: 't6',
    title: 'Prohibited items and behaviour',
    paragraphs: [
      'You must not list items that are illegal in the UAE, counterfeit, stolen, recalled, or dangerous, including weapons, drugs, alcohol, tobacco, medicines, and live animals.',
      'Don’t harass other users, post misleading listings, ask for payment outside the app, or try to get around our fees. We may remove listings or suspend accounts that break these rules.',
    ],
  },
  {
    id: 't7',
    title: 'Fees and payouts',
    paragraphs: [
      'Listing items is free. Sellers receive the item price after the buyer confirms receipt or the protection period ends, minus any applicable fees, paid to the payout method on their account.',
      'We will tell you in advance if our fees change.',
    ],
  },
  {
    id: 't8',
    title: 'Liability',
    paragraphs: [
      'Resello is provided “as is”. To the extent allowed by law, we aren’t responsible for the quality, safety, or legality of items listed, or for the conduct of buyers and sellers.',
      'Nothing in these terms limits rights you have under UAE consumer protection law.',
    ],
  },
  {
    id: 't9',
    title: 'Changes and governing law',
    paragraphs: [
      'We may update these terms. If changes are significant, we’ll notify you in the app before they take effect.',
      'These terms are governed by the laws of the United Arab Emirates, and disputes are subject to the courts of Dubai.',
    ],
  },
];

export const PRIVACY: LegalSection[] = [
  {
    id: 'p1',
    title: 'Who we are',
    paragraphs: [
      'This policy explains how Resello collects, uses, and protects your personal data when you use the app. We process personal data in line with UAE Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data.',
    ],
  },
  {
    id: 'p2',
    title: 'What we collect',
    paragraphs: [
      'Account details: your mobile number, name, and profile photo if you add one.',
      'Listings and activity: items you post, photos, prices, favourites, cart, orders, and messages you exchange with other users.',
      'Location: your approximate area, so we can show items near you. We only use precise location while you’re using the app and only if you allow it.',
      'Device data: device type, operating system, app version, and crash reports.',
    ],
  },
  {
    id: 'p3',
    title: 'How we use it',
    paragraphs: [
      'To run your account and verify your phone number; show listings near you; process orders, payments, and payouts; deliver messages between buyers and sellers; and provide buyer protection.',
      'To keep Resello safe, for example by detecting fraud and enforcing our terms, and to improve the app. We don’t sell your personal data.',
    ],
  },
  {
    id: 'p4',
    title: 'What other users see',
    paragraphs: [
      'Other users can see your name, profile photo, listings, and your general area, never your phone number or exact address. When you buy or sell, the other person sees what they need to complete the order, such as a pickup area.',
    ],
  },
  {
    id: 'p5',
    title: 'Sharing with others',
    paragraphs: [
      'We share data only with service providers who help us run Resello (such as hosting, SMS verification, payments, and crash reporting) under contracts that protect it, or when required by law.',
    ],
  },
  {
    id: 'p6',
    title: 'Permissions',
    paragraphs: [
      'Camera and photos: to add pictures to your listings. Location: to show nearby items. Notifications: to tell you about messages, offers, and orders. You can turn these off at any time in your device settings.',
    ],
  },
  {
    id: 'p7',
    title: 'How long we keep it',
    paragraphs: [
      'We keep your data while your account is open. If you delete your account, we delete or anonymise your personal data within 90 days, except where we must keep records, for example for tax or to resolve disputes.',
    ],
  },
  {
    id: 'p8',
    title: 'Your rights',
    paragraphs: [
      'You can ask to access, correct, or delete your personal data, to restrict or object to how we use it, or to receive a copy of it. Contact us using the details below and we’ll respond within 30 days.',
    ],
  },
  {
    id: 'p9',
    title: 'Contact us',
    paragraphs: [
      `Questions about these terms or your privacy? Email ${SUPPORT_EMAIL}.`,
    ],
  },
];

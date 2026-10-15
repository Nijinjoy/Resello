// Help centre FAQs. Keep the answers in line with the terms in ./legal.ts.

export type HelpTopic = 'buying' | 'selling' | 'payments' | 'account';

export const HELP_TOPICS: { value: HelpTopic; label: string }[] = [
  { value: 'buying', label: 'Buying' },
  { value: 'selling', label: 'Selling' },
  { value: 'payments', label: 'Payments' },
  { value: 'account', label: 'Account & safety' },
];

export type Faq = {
  id: string;
  topic: HelpTopic;
  question: string;
  answer: string;
};

export const FAQS: Faq[] = [
  {
    id: 'b1',
    topic: 'buying',
    question: 'How do I buy an item?',
    answer:
      'Open the item, check the photos and description, and tap Add to cart. You can add items from several sellers, then check out from the Cart tab. Chat with the seller first if you have questions.',
  },
  {
    id: 'b2',
    topic: 'buying',
    question: 'What is buyer protection?',
    answer:
      'Every order paid through Resello checkout is covered. If an item doesn’t arrive, or is significantly different from its description, report it within 48 hours of delivery or pickup and we’ll refund what you paid. It’s included at no extra cost.',
  },
  {
    id: 'b3',
    topic: 'buying',
    question: 'Can I negotiate the price?',
    answer:
      'Yes. Message the seller from the item page to ask. If they agree to a lower price, they can update the listing before you buy.',
  },
  {
    id: 'b4',
    topic: 'buying',
    question: 'An item in my cart says “Sold out”',
    answer:
      'Someone else bought it after you added it. Sold-out items aren’t included in your total; you can remove them from the cart in one tap.',
  },
  {
    id: 's1',
    topic: 'selling',
    question: 'How do I list an item?',
    answer:
      'Tap Sell, add up to 6 photos, a title, price, condition, and a short description, then post. Listing is free and your item goes live straight away.',
  },
  {
    id: 's2',
    topic: 'selling',
    question: 'How do I mark an item as sold?',
    answer:
      'Open the menu, go to My listings, and tap Mark as sold on the item. It moves to your Sold tab. You can relist it later if the sale falls through.',
  },
  {
    id: 's3',
    topic: 'selling',
    question: 'What can’t I sell?',
    answer:
      'Anything illegal in the UAE, counterfeit, stolen, recalled, or dangerous, including weapons, drugs, alcohol, tobacco, medicines, and live animals. Listings that break the rules are removed.',
  },
  {
    id: 's4',
    topic: 'selling',
    question: 'Tips for selling faster',
    answer:
      'Use bright, clear photos from a few angles, mention any faults honestly, and price close to similar items nearby. Reply to messages quickly: buyers often message several sellers.',
  },
  {
    id: 'p1',
    topic: 'payments',
    question: 'What fees do I pay?',
    answer:
      'Buyers pay a flat AED 2 platform fee per order, shown before checkout; buyer protection is included. Listing items is free for sellers.',
  },
  {
    id: 'p2',
    topic: 'payments',
    question: 'When do I get paid for a sale?',
    answer:
      'Your payout is released once the buyer confirms they received the item, or when the 48-hour protection period ends. You can track it under Sold in the menu.',
  },
  {
    id: 'p3',
    topic: 'payments',
    question: 'Can I pay the seller in cash?',
    answer:
      'We strongly recommend paying in the app. Payments made outside Resello aren’t covered by buyer protection, and asking for off-app payment is against our rules.',
  },
  {
    id: 'a1',
    topic: 'account',
    question: 'I didn’t get my verification code',
    answer:
      'Check that your number and country code are correct and that you have signal, then wait a minute and tap Resend. Never share your code with anyone, including people claiming to be from Resello.',
  },
  {
    id: 'a2',
    topic: 'account',
    question: 'How do I stay safe when meeting a buyer or seller?',
    answer:
      'Meet in a busy public place during the day, bring a friend for large items, and check the item before you hand over or accept it. Keep all chat and payments in the app.',
  },
  {
    id: 'a3',
    topic: 'account',
    question: 'How do I report a user or listing?',
    answer:
      'Use Report a problem below and include the item name or the person’s name. Our team reviews every report, and we act quickly on anything unsafe.',
  },
  {
    id: 'a4',
    topic: 'account',
    question: 'How do I delete my account?',
    answer:
      'Email us from the number linked to your account and ask for deletion. We remove your personal data within 90 days, except records we must keep by law.',
  },
];

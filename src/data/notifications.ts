// Dummy notifications until the notifications backend exists.
export type NotificationKind =
  | 'offer'
  | 'message'
  | 'priceDrop'
  | 'views'
  | 'sold'
  | 'protection';

// Where tapping the notification goes.
export type NotificationTarget =
  | { type: 'tab'; tab: 'Chats' | 'Explore' | 'Cart' }
  | { type: 'comingSoon'; title: string };

export type AppNotification = {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  minutesAgo: number;
  read: boolean;
  target: NotificationTarget;
};

export const initialNotifications: AppNotification[] = [
  {
    id: 'n1',
    kind: 'offer',
    title: 'New offer on IKEA 3-seat sofa',
    body: 'Omar offered AED 550 for your sofa.',
    minutesAgo: 5,
    read: false,
    target: { type: 'tab', tab: 'Chats' },
  },
  {
    id: 'n2',
    kind: 'message',
    title: 'Aisha Rahman sent a message',
    body: 'Yes, it’s still available. Battery health is 89%.',
    minutesAgo: 24,
    read: false,
    target: { type: 'tab', tab: 'Chats' },
  },
  {
    id: 'n3',
    kind: 'priceDrop',
    title: 'Price drop on a saved item',
    body: 'Sony WH-1000XM5 is now AED 600 (was AED 650).',
    minutesAgo: 130,
    read: false,
    target: { type: 'comingSoon', title: 'Sony WH-1000XM5' },
  },
  {
    id: 'n4',
    kind: 'views',
    title: 'Your listing is getting attention',
    body: 'Bugaboo baby stroller had 24 views today.',
    minutesAgo: 310,
    read: true,
    target: { type: 'comingSoon', title: 'My listings' },
  },
  {
    id: 'n5',
    kind: 'sold',
    title: 'Item sold',
    body: 'Your Zara wool coat sold for AED 180. Arrange pickup with the buyer.',
    minutesAgo: 1500,
    read: true,
    target: { type: 'tab', tab: 'Chats' },
  },
  {
    id: 'n6',
    kind: 'message',
    title: 'Priya Nair replied',
    body: 'Great, see you at Dubai Marina Mall at 6.',
    minutesAgo: 2950,
    read: true,
    target: { type: 'tab', tab: 'Chats' },
  },
  {
    id: 'n7',
    kind: 'protection',
    title: 'Buyer protection is on',
    body: 'Every order is covered: full refund if an item isn’t as described.',
    minutesAgo: 4400,
    read: true,
    target: { type: 'comingSoon', title: 'Buyer protection' },
  },
];

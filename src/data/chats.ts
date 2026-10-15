import type { ItemCategory } from './categories';

// Dummy conversations until the chat backend exists.
export type ChatRole = 'buying' | 'selling';

export type Conversation = {
  id: string;
  name: string;
  itemTitle: string;
  itemPrice: string;
  itemCategory: ItemCategory;
  // Listing photo URL. Without one, the row shows a category icon.
  itemImage?: string;
  role: ChatRole;
  lastMessage: string;
  // The last message was sent by the signed-in user.
  fromMe: boolean;
  time: string;
  unread: number;
  online: boolean;
};

export const conversations: Conversation[] = [
  {
    id: '1',
    name: 'Aisha Rahman',
    itemTitle: 'iPhone 13 Pro, 256GB',
    itemPrice: 'AED 2,100',
    itemCategory: 'phone',
    role: 'buying',
    lastMessage: 'Yes, it’s still available. Battery health is 89%.',
    fromMe: false,
    time: '10:24',
    unread: 2,
    online: true,
  },
  {
    id: '2',
    name: 'Omar Al Hashimi',
    itemTitle: 'IKEA 3-seat sofa',
    itemPrice: 'AED 650',
    itemCategory: 'furniture',
    role: 'selling',
    lastMessage: 'Can you do AED 550 if I pick it up today?',
    fromMe: false,
    time: '09:02',
    unread: 1,
    online: false,
  },
  {
    id: '3',
    name: 'Priya Nair',
    itemTitle: 'PlayStation 5 + 2 controllers',
    itemPrice: 'AED 1,450',
    itemCategory: 'gaming',
    role: 'buying',
    lastMessage: 'Great, see you at Dubai Marina Mall at 6.',
    fromMe: true,
    time: 'Yesterday',
    unread: 0,
    online: true,
  },
  {
    id: '4',
    name: 'Daniel Costa',
    itemTitle: 'Bugaboo baby stroller',
    itemPrice: 'AED 900',
    itemCategory: 'baby',
    role: 'selling',
    lastMessage: 'Thanks! I’ll let you know by the weekend.',
    fromMe: false,
    time: 'Mon',
    unread: 0,
    online: false,
  },
  {
    id: '5',
    name: 'Fatima Zahra',
    itemTitle: 'Trek road bike, size M',
    itemPrice: 'AED 1,800',
    itemCategory: 'bike',
    role: 'buying',
    lastMessage: 'Is the price negotiable?',
    fromMe: true,
    time: '12 Oct',
    unread: 0,
    online: false,
  },
];

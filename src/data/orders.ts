import type { ImageSourcePropType } from 'react-native';
import type { ItemCategory } from './categories';

// The signed-in user's orders. Dummy data until the orders backend exists.
type Order = {
  id: string;
  title: string;
  // Whole dirhams.
  price: number;
  category: ItemCategory;
  image?: ImageSourcePropType;
  // How long ago the order was placed.
  minutesAgo: number;
};

export type PurchaseStatus = 'onTheWay' | 'readyForPickup' | 'completed';

export type Purchase = Order & {
  sellerName: string;
  status: PurchaseStatus;
};

export type SaleStatus = 'payoutPending' | 'paidOut';

export type Sale = Order & {
  buyerName: string;
  status: SaleStatus;
};

const DAY = 24 * 60;

export const purchases: Purchase[] = [
  {
    id: 'p1',
    title: 'Wireless earbuds',
    price: 220,
    category: 'electronics',
    image: require('../../assets/purchases/earbuds.jpg'),
    sellerName: 'Karim Nasser',
    status: 'onTheWay',
    minutesAgo: 300,
  },
  {
    id: 'p2',
    title: 'Pink accent chair',
    price: 380,
    category: 'furniture',
    image: require('../../assets/purchases/accent-chair.jpg'),
    sellerName: 'Noura Saeed',
    status: 'readyForPickup',
    minutesAgo: DAY + 120,
  },
  {
    id: 'p3',
    title: 'Air Jordan 1, size 43',
    price: 650,
    category: 'fashion',
    image: require('../../assets/purchases/sneakers.jpg'),
    sellerName: 'Arjun Pillai',
    status: 'completed',
    minutesAgo: 5 * DAY,
  },
  {
    id: 'p4',
    title: 'Wooden toy train set',
    price: 140,
    category: 'baby',
    image: require('../../assets/purchases/toy-train.jpg'),
    sellerName: 'Chloe Martin',
    status: 'completed',
    minutesAgo: 12 * DAY,
  },
  {
    id: 'p5',
    title: 'Hiking backpack, 40L',
    price: 260,
    category: 'fashion',
    image: require('../../assets/purchases/backpack.jpg'),
    sellerName: 'Tariq Mansour',
    status: 'completed',
    minutesAgo: 30 * DAY,
  },
];

// The same items as the sold ones in My listings.
export const sales: Sale[] = [
  {
    id: 's1',
    title: 'Bomber jacket, size L',
    price: 120,
    category: 'fashion',
    image: require('../../assets/my-listings/jacket.jpg'),
    buyerName: 'Lina Haddad',
    status: 'payoutPending',
    minutesAgo: 2 * DAY,
  },
  {
    id: 's2',
    title: 'Comic book collection',
    price: 300,
    category: 'gaming',
    image: require('../../assets/my-listings/comics.jpg'),
    buyerName: 'Sam Okafor',
    status: 'paidOut',
    minutesAgo: 9 * DAY,
  },
  {
    id: 's3',
    title: 'Wireless headphones',
    price: 180,
    category: 'electronics',
    image: require('../../assets/my-listings/headphones.jpg'),
    buyerName: 'Mei Tanaka',
    status: 'paidOut',
    minutesAgo: 15 * DAY,
  },
];

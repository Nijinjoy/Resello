import type { ImageSourcePropType } from 'react-native';
import type { ItemCategory } from './categories';

// Dummy cart until the listings and orders backend exists.
export type CartItem = {
  id: string;
  title: string;
  // Whole dirhams.
  price: number;
  condition: string;
  category: ItemCategory;
  // Listing photo. Without one, the row shows a category icon.
  image?: ImageSourcePropType;
  sellerName: string;
  area: string;
  // Sold to someone else since it was added; excluded from the total.
  sold?: boolean;
};

export const initialCart: CartItem[] = [
  {
    id: 'c1',
    title: 'iPhone 13 Pro, 256GB',
    price: 2100,
    condition: 'Like new',
    category: 'phone',
    sellerName: 'Aisha Rahman',
    area: 'Al Barsha',
  },
  {
    id: 'c2',
    title: 'PlayStation 5 + 2 controllers',
    price: 1450,
    condition: 'Good',
    category: 'gaming',
    sellerName: 'Priya Nair',
    area: 'Dubai Marina',
  },
  {
    id: 'c3',
    title: 'Trek road bike, size M',
    price: 1800,
    condition: 'Good',
    category: 'bike',
    sellerName: 'Fatima Zahra',
    area: 'JLT',
  },
  {
    id: 'c4',
    title: 'Bugaboo baby stroller',
    price: 900,
    condition: 'Like new',
    category: 'baby',
    sellerName: 'Daniel Costa',
    area: 'Mirdif',
    sold: true,
  },
];

// Flat Resello fee per order, in whole dirhams. It's the only fee buyers
// pay; buyer protection is included.
export const PLATFORM_FEE = 2;

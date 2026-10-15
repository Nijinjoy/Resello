import type { ImageSourcePropType } from 'react-native';
import type { ItemCategory } from './categories';

// The signed-in user's own listings. Dummy data until the listings backend
// exists.
export type MyListing = {
  id: string;
  title: string;
  // Whole dirhams.
  price: number;
  condition: string;
  category: ItemCategory;
  image?: ImageSourcePropType;
  status: 'active' | 'sold';
  views: number;
  saves: number;
  chats: number;
  // How long ago it was posted, or sold for sold items.
  minutesAgo: number;
};

export const initialMyListings: MyListing[] = [
  {
    id: 'm1',
    title: 'iPhone 12, 128GB',
    price: 1350,
    condition: 'Good',
    category: 'phone',
    image: require('../../assets/my-listings/iphone.jpg'),
    status: 'active',
    views: 214,
    saves: 18,
    chats: 4,
    minutesAgo: 180,
  },
  {
    id: 'm2',
    title: 'Carbon road bike, size L',
    price: 2400,
    condition: 'Like new',
    category: 'bike',
    image: require('../../assets/my-listings/road-bike.jpg'),
    status: 'active',
    views: 96,
    saves: 11,
    chats: 2,
    minutesAgo: 60 * 26,
  },
  {
    id: 'm3',
    title: 'Mustard velvet armchair',
    price: 450,
    condition: 'Good',
    category: 'furniture',
    image: require('../../assets/my-listings/armchair.jpg'),
    status: 'active',
    views: 41,
    saves: 3,
    chats: 0,
    minutesAgo: 60 * 24 * 4,
  },
  {
    id: 'm4',
    title: 'Bomber jacket, size L',
    price: 120,
    condition: 'Like new',
    category: 'fashion',
    image: require('../../assets/my-listings/jacket.jpg'),
    status: 'sold',
    views: 77,
    saves: 9,
    chats: 5,
    minutesAgo: 60 * 24 * 2,
  },
  {
    id: 'm5',
    title: 'Comic book collection',
    price: 300,
    condition: 'Good',
    category: 'gaming',
    image: require('../../assets/my-listings/comics.jpg'),
    status: 'sold',
    views: 130,
    saves: 14,
    chats: 6,
    minutesAgo: 60 * 24 * 9,
  },
  {
    id: 'm6',
    title: 'Wireless headphones',
    price: 180,
    condition: 'Good',
    category: 'electronics',
    image: require('../../assets/my-listings/headphones.jpg'),
    status: 'sold',
    views: 58,
    saves: 4,
    chats: 3,
    minutesAgo: 60 * 24 * 15,
  },
];

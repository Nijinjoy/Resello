import type { ImageSourcePropType } from 'react-native';
import type { ItemCategory } from './categories';

// Dummy listings until the listings backend exists.
export type Listing = {
  id: string;
  title: string;
  // Whole dirhams.
  price: number;
  condition: string;
  category: ItemCategory;
  // Listing photos, cover first: bundled assets now, `{ uri }`s once photos
  // come from the backend. Without any, cards show a category icon.
  images: ImageSourcePropType[];
  description?: string;
  sellerName: string;
  area: string;
  distanceKm: number;
  // How long ago it was listed.
  minutesAgo: number;
};

export const listings: Listing[] = [
  {
    id: 'l1',
    title: 'MacBook Air M2, 13"',
    images: [
      require('../../assets/listings/macbook.jpg'),
      require('../../assets/listings/macbook-2.jpg'),
      require('../../assets/listings/macbook-3.jpg'),
    ],
    description:
      'Midnight, 8GB RAM, 256GB SSD. Battery health 96%, no scratches on the screen or body. Comes with the original charger and box.',
    price: 3200,
    condition: 'Like new',
    category: 'electronics',
    sellerName: 'Omar Haddad',
    area: 'Al Barsha',
    distanceKm: 0.8,
    minutesAgo: 12,
  },
  {
    id: 'l2',
    title: 'West Elm armchair',
    images: [
      require('../../assets/listings/armchair.jpg'),
      require('../../assets/listings/armchair-2.jpg'),
      require('../../assets/listings/armchair-3.jpg'),
    ],
    description:
      'Cream bouclé armchair from West Elm, about two years old. No stains or tears, smoke-free and pet-free home. Pickup only.',
    price: 750,
    condition: 'Good',
    category: 'furniture',
    sellerName: 'Sara Mitchell',
    area: 'Tecom',
    distanceKm: 2.1,
    minutesAgo: 35,
  },
  {
    id: 'l3',
    title: 'Nintendo Switch OLED',
    images: [
      require('../../assets/listings/switch.jpg'),
      require('../../assets/listings/switch-2.jpg'),
      require('../../assets/listings/switch-3.jpg'),
    ],
    description:
      'White OLED model with dock, both Joy-Cons and the original cables. Screen protector fitted since day one. Barely used.',
    price: 850,
    condition: 'Like new',
    category: 'gaming',
    sellerName: 'Rohan Mehta',
    area: 'JLT',
    distanceKm: 3.4,
    minutesAgo: 60,
  },
  {
    id: 'l4',
    title: 'Samsung Galaxy S23',
    images: [
      require('../../assets/listings/galaxy.jpg'),
      require('../../assets/listings/galaxy-2.jpg'),
      require('../../assets/listings/galaxy-3.jpg'),
    ],
    description:
      '128GB, Phantom Black, unlocked. Light wear on the frame, screen is perfect. Includes case and USB-C cable.',
    price: 1600,
    condition: 'Good',
    category: 'phone',
    sellerName: 'Layla Ahmed',
    area: 'Dubai Marina',
    distanceKm: 4.2,
    minutesAgo: 120,
  },
  {
    id: 'l5',
    title: 'Zara wool coat, size M',
    images: [
      require('../../assets/listings/coat.jpg'),
      require('../../assets/listings/coat-2.jpg'),
      require('../../assets/listings/coat-3.jpg'),
    ],
    description:
      'Camel wool-blend wrap coat with belt, size M. Worn a handful of times last winter and dry-cleaned.',
    price: 180,
    condition: 'Like new',
    category: 'fashion',
    sellerName: 'Elena Petrova',
    area: 'Jumeirah',
    distanceKm: 6.5,
    minutesAgo: 180,
  },
  {
    id: 'l6',
    title: 'Kids balance bike',
    images: [
      require('../../assets/listings/balance-bike.jpg'),
      require('../../assets/listings/balance-bike-2.jpg'),
      require('../../assets/listings/balance-bike-3.jpg'),
    ],
    description:
      'Wooden balance bike for ages 2–5 with an adjustable seat. Helped our son learn to ride; a few marks on the frame.',
    price: 120,
    condition: 'Good',
    category: 'bike',
    sellerName: 'Hassan Ali',
    area: 'Al Barsha',
    distanceKm: 1.2,
    minutesAgo: 240,
  },
  {
    id: 'l7',
    title: 'Chicco high chair',
    images: [
      require('../../assets/listings/high-chair.jpg'),
      require('../../assets/listings/high-chair-2.jpg'),
      require('../../assets/listings/high-chair-3.jpg'),
    ],
    description:
      'Chicco high chair with adjustable height and recline, removable tray. Seat cover is machine-washable and clean.',
    price: 220,
    condition: 'Fair',
    category: 'baby',
    sellerName: 'Maria Santos',
    area: 'Mirdif',
    distanceKm: 18.0,
    minutesAgo: 1500,
  },
  {
    id: 'l8',
    title: 'Sony WH-1000XM5',
    images: [
      require('../../assets/listings/headphones.jpg'),
      require('../../assets/listings/headphones-2.jpg'),
      require('../../assets/listings/headphones-3.jpg'),
    ],
    description:
      'Black, with carry case and cable. Noise cancelling works perfectly; ear pads in great condition. Under warranty until March.',
    price: 650,
    condition: 'New',
    category: 'electronics',
    sellerName: 'Yusuf Karim',
    area: 'Business Bay',
    distanceKm: 9.3,
    minutesAgo: 1700,
  },
];

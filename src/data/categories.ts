export type ItemCategory =
  | 'phone'
  | 'electronics'
  | 'furniture'
  | 'fashion'
  | 'gaming'
  | 'baby'
  | 'bike';

export const CATEGORIES: { value: ItemCategory; label: string }[] = [
  { value: 'phone', label: 'Phones' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'baby', label: 'Baby & kids' },
  { value: 'bike', label: 'Bikes' },
];

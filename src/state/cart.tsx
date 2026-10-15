import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import { initialCart, type CartItem } from '../data/cart';

type CartValue = {
  items: CartItem[];
  setItems: Dispatch<SetStateAction<CartItem[]>>;
  isInCart: (id: string) => boolean;
  // No-op if the item is already in the cart: listings are one-offs.
  addToCart: (item: CartItem) => void;
};

const CartContext = createContext<CartValue | null>(null);

// Cart shared by the Cart tab and listing details. In memory until there's
// an orders backend.
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState(initialCart);

  const value = useMemo(
    () => ({
      items,
      setItems,
      isInCart: (id: string) => items.some(item => item.id === id),
      addToCart: (item: CartItem) =>
        setItems(current =>
          current.some(existing => existing.id === item.id)
            ? current
            : [...current, item],
        ),
    }),
    [items],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) {
    throw new Error('useCart must be used inside CartProvider');
  }
  return value;
}

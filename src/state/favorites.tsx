import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type FavoritesValue = {
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  count: number;
  // Saved listing ids, oldest first.
  ids: string[];
};

const FavoritesContext = createContext<FavoritesValue | null>(null);

// Saved listings, shared by every tab. In memory until there's a backend.
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<Set<string>>(() => new Set());

  const toggleFavorite = useCallback(
    (id: string) =>
      setIds(current => {
        const next = new Set(current);
        if (!next.delete(id)) {
          next.add(id);
        }
        return next;
      }),
    [],
  );

  const value = useMemo(
    () => ({
      isFavorite: (id: string) => ids.has(id),
      toggleFavorite,
      count: ids.size,
      ids: [...ids],
    }),
    [ids, toggleFavorite],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const value = useContext(FavoritesContext);
  if (!value) {
    throw new Error('useFavorites must be used inside FavoritesProvider');
  }
  return value;
}

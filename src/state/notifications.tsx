import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  initialNotifications,
  type AppNotification,
} from '../data/notifications';

type NotificationsValue = {
  notifications: AppNotification[];
  unreadCount: number;
  markRead: (id: string) => void;
};

const NotificationsContext = createContext<NotificationsValue | null>(null);

// Shared so the bell badge on every tab matches the Notifications screen.
// In memory until there's a backend.
export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markRead = useCallback(
    (id: string) =>
      setNotifications(current =>
        current.map(n => (n.id === id && !n.read ? { ...n, read: true } : n)),
      ),
    [],
  );

  const value = useMemo(
    () => ({
      notifications,
      unreadCount: notifications.filter(n => !n.read).length,
      markRead,
    }),
    [notifications, markRead],
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const value = useContext(NotificationsContext);
  if (!value) {
    throw new Error(
      'useNotifications must be used inside NotificationsProvider',
    );
  }
  return value;
}

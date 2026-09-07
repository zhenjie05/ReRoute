import React, { createContext, useContext, useState, useMemo } from 'react';
import { AppNotification } from '@/models/notification';
import { mockNotifications } from '@/shared/data/mock-notifications';

interface NotificationsContextType {
  notifications: AppNotification[];
  unreadCount: number;
  unreadSafetyCount: number;
  isCenterOpen: boolean;
  openNotificationCenter: () => void;
  closeNotificationCenter: () => void;
  toggleNotificationCenter: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  filterNotifications: (category: 'all' | 'safety' | 'votes' | 'mascot') => AppNotification[];
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>(mockNotifications);
  const [isCenterOpen, setIsCenterOpen] = useState<boolean>(false);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  const unreadSafetyCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead && (n.type === 'safety_risk' || n.type === 'sos_alert')).length;
  }, [notifications]);

  const openNotificationCenter = () => setIsCenterOpen(true);
  const closeNotificationCenter = () => setIsCenterOpen(false);
  const toggleNotificationCenter = () => setIsCenterOpen((prev) => !prev);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  const filterNotifications = (category: 'all' | 'safety' | 'votes' | 'mascot') => {
    switch (category) {
      case 'safety':
        return notifications.filter((n) => n.type === 'safety_risk' || n.type === 'sos_alert');
      case 'votes':
        return notifications.filter((n) => n.type === 'decision_card' || n.type === 'budget_alert');
      case 'mascot':
        return notifications.filter((n) => n.type === 'mascot_advisory' || n.type === 'community_star');
      case 'all':
      default:
        return notifications;
    }
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        unreadSafetyCount,
        isCenterOpen,
        openNotificationCenter,
        closeNotificationCenter,
        toggleNotificationCenter,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        filterNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = (): NotificationsContextType => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};

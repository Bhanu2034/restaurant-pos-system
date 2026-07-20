import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [alerts, setAlerts] = useState([]);

  const pushAlert = (alert) => {
    setAlerts((al) => [
      { ...alert, id: Date.now() + Math.random(), time: Date.now() },
      ...al,
    ]);
  };

  const dismissAlert = (id) => {
    setAlerts((al) => al.filter((a) => a.id !== id));
  };

  const value = {
    alerts,
    pushAlert,
    dismissAlert,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotificationContext must be used within NotificationProvider');
  return ctx;
}

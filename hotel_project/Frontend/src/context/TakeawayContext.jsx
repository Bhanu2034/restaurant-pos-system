import React, { createContext, useContext, useState, useEffect } from 'react';

const TakeawayContext = createContext(null);

export function TakeawayProvider({ children }) {
  // 1. Pull existing active takeaway tokens from local storage on load
  const [takeaway, setTakeaway] = useState(() => {
    const saved = localStorage.getItem('activeTakeaways');
    return saved ? JSON.parse(saved) : [];
  });

  // 2. Automatically sync back to local storage whenever a takeaway is added or handed over
  useEffect(() => {
    localStorage.setItem('activeTakeaways', JSON.stringify(takeaway));
  }, [takeaway]);

  const addTakeaway = (order) => {
    setTakeaway((ta) => [order, ...ta]);
  };

  const handOver = (token) => {
    setTakeaway((ta) =>
      ta.map((t) => (t.token === token ? { ...t, handedOver: true } : t))
    );
  };

  const activeTokens = takeaway.filter((t) => !t.handedOver);

  const value = {
    takeaway,
    setTakeaway,
    addTakeaway,
    handOver,
    activeTokens,
  };

  return <TakeawayContext.Provider value={value}>{children}</TakeawayContext.Provider>;
}

export function useTakeawayContext() {
  const ctx = useContext(TakeawayContext);
  if (!ctx) throw new Error('useTakeawayContext must be used within TakeawayProvider');
  return ctx;
}
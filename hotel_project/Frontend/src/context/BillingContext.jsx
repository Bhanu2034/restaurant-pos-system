import React, { createContext, useContext, useState, useEffect } from 'react';
import billingService from '../services/billingService'; // 1. Import the real service

const BillingContext = createContext(null);

export function BillingProvider({ children }) {
  const [todaySales, setTodaySales] = useState(0); // Start at 0, not a fake number

  // 2. Fetch the real sales total from Spring Boot when the app loads
  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    try {
      const total = await billingService.getSalesTotal();
      setTodaySales(total || 0);
    } catch (error) {
      console.error("Failed to fetch today's sales:", error);
    }
  };

  // 3. Keep the UI snappy by updating the local state when a new bill is settled
  const addSale = (amount) => {
    setTodaySales((s) => s + amount);
  };

  const value = {
    todaySales,
    addSale,
  };

  return <BillingContext.Provider value={value}>{children}</BillingContext.Provider>;
}

export function useBillingContext() {
  const ctx = useContext(BillingContext);
  if (!ctx) throw new Error('useBillingContext must be used within BillingProvider');
  return ctx;
}
import React, { createContext, useContext, useState, useEffect } from 'react';
import inventoryService from '../services/inventoryService'; // 1. Import the real service
import { RESTOCK_AMOUNT } from '../constants/constants';

const InventoryContext = createContext(null);

export function InventoryProvider({ children }) {
  const [inventory, setInventory] = useState([]); // Start with an empty array, not fake data

  // 2. Fetch the real data from the database when the app loads
  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const data = await inventoryService.getInventory();
      setInventory(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load inventory:", error);
    }
  };

  // 3. Make actions async and send data to the backend FIRST
  const restock = async (id) => {
    try {
      const updatedItem = await inventoryService.restock(id, RESTOCK_AMOUNT);
      setInventory((inv) =>
        inv.map((i) => (i.id === id ? updatedItem : i))
      );
    } catch (error) {
      console.error("Failed to restock:", error);
    }
  };

  const addItem = async (item) => {
    try {
      // Spring Boot generates the real ID, so we wait for its response
      const savedItem = await inventoryService.addItem(item);
      setInventory((inv) => [...inv, savedItem]);
    } catch (error) {
      console.error("Failed to add item:", error);
    }
  };

  const editItem = async (id, updates) => {
    try {
      const updatedItem = await inventoryService.updateItem(id, updates);
      setInventory((inv) =>
        inv.map((i) => (i.id === id ? updatedItem : i))
      );
    } catch (error) {
      console.error("Failed to edit item:", error);
    }
  };

  const deleteItem = async (id) => {
    try {
      await inventoryService.deleteItem(id);
      setInventory((inv) => inv.filter((i) => i.id !== id));
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  const lowStockCount = inventory.filter((i) => i.stock <= i.threshold).length;

  const value = {
    inventory,
    setInventory,
    restock,
    addItem,
    editItem,
    deleteItem,
    lowStockCount,
  };

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
}

export function useInventoryContext() {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error('useInventoryContext must be used within InventoryProvider');
  return ctx;
}
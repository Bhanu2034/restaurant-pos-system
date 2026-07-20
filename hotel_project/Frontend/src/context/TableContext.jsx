import React, { createContext, useContext, useState, useEffect } from 'react';
import tableService from '../services/tableService'; // 1. Import the real service
import { useNotificationContext } from './NotificationContext';

const TableContext = createContext(null);

export function TableProvider({ children }) {
  const [tables, setTables] = useState([]); // Start empty
  const { pushAlert } = useNotificationContext();

  // 2. Fetch the real tables from the database on load
  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    try {
      const data = await tableService.getTables();
      setTables(data);
    } catch (error) {
      console.error("Failed to load tables:", error);
    }
  };

  // 3. Tell the database whenever a table status changes (e.g., 'occupied' or 'empty')
  const updateTableStatus = async (tableId, status) => {
    try {
      const updatedTable = await tableService.updateTableStatus(tableId, status);
      setTables((ts) => ts.map((t) => (t.id === tableId ? updatedTable : t)));
    } catch (error) {
      console.error("Failed to update table status:", error);
    }
  };

  const clearTable = async (tableId) => {
    await updateTableStatus(tableId, 'empty');
  };

  // 4. Add a new table to the floor plan
  const createTable = async (id, seats) => {
    try {
      const newTable = await tableService.createTable(id, seats);
      setTables((ts) => [...ts, newTable]);
      return newTable;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create table.';
      pushAlert({ message });
      throw error;
    }
  };

  // 5. Remove a table from the floor plan (backend rejects non-empty tables)
  const deleteTable = async (tableId) => {
    try {
      await tableService.deleteTable(tableId);
      setTables((ts) => ts.filter((t) => t.id !== tableId));
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete table.';
      pushAlert({ message });
      throw error;
    }
  };

  const value = {
    tables,
    setTables,
    updateTableStatus,
    clearTable,
    createTable,
    deleteTable,
  };

  return <TableContext.Provider value={value}>{children}</TableContext.Provider>;
}

export function useTableContext() {
  const ctx = useContext(TableContext);
  if (!ctx) throw new Error('useTableContext must be used within TableProvider');
  return ctx;
}
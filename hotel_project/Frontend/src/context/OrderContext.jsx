import React, { createContext, useContext, useEffect, useState } from "react";

const OrderContext = createContext(null);

export function OrderProvider({ children }) {

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("activeOrders");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("activeOrders", JSON.stringify(orders));
  }, [orders]);

  const addToOrder = (tableId, draftLines) => {
    setOrders((previous) => {

      const existing = previous[tableId]?.items || [];

      const merged = [...existing];

      draftLines.forEach((line) => {

        const index = merged.findIndex(
          (item) => item.menuItemId === line.menuItemId
        );

        if (index >= 0) {

          merged[index] = {
            ...merged[index],
            qty: merged[index].qty + line.qty,
          };

        } else {

          merged.push({
            menuItemId: line.menuItemId,
            name: line.name,
            price: Number(line.price),
            qty: line.qty,
            station: line.station,
            category: line.category,
            isVeg: line.isVeg,
          });

        }

      });

      return {
        ...previous,
        [tableId]: {
          items: merged,
          updatedAt: Date.now(),
        },
      };

    });
  };

  const clearOrder = (tableId) => {
    setOrders((previous) => {
      const next = { ...previous };
      delete next[tableId];
      return next;
    });
  };

  const getOrderForTable = (tableId) => {
    return orders[tableId]?.items || [];
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        setOrders,
        addToOrder,
        clearOrder,
        getOrderForTable,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrderContext() {
  const context = useContext(OrderContext);

  if (!context) {
    throw new Error("useOrderContext must be used inside OrderProvider");
  }

  return context;
}
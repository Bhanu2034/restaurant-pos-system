import { useState, useCallback, useMemo } from "react";

export default function useDraftOrder() {
  const [draft, setDraft] = useState({});

  const addToDraft = useCallback((menuItem) => {
    setDraft((prev) => {
      const existing = prev[menuItem.id];

      if (existing) {
        return {
          ...prev,
          [menuItem.id]: {
            ...existing,
            qty: existing.qty + 1,
          },
        };
      }

      return {
        ...prev,
        [menuItem.id]: {
          menuItemId: menuItem.id,
          name: menuItem.name,
          price: Number(menuItem.price),
          qty: 1,
          station: menuItem.station,
          category: menuItem.category,
          isVeg: menuItem.isVeg,
        },
      };
    });
  }, []);

  const changeDraft = useCallback((menuItemId, delta) => {
    setDraft((prev) => {
      const item = prev[menuItemId];

      if (!item) return prev;

      const newQty = item.qty + delta;

      if (newQty <= 0) {
        const copy = { ...prev };
        delete copy[menuItemId];
        return copy;
      }

      return {
        ...prev,
        [menuItemId]: {
          ...item,
          qty: newQty,
        },
      };
    });
  }, []);

  const removeLine = useCallback((menuItemId) => {
    setDraft((prev) => {
      if (!prev[menuItemId]) return prev;
      const copy = { ...prev };
      delete copy[menuItemId];
      return copy;
    });
  }, []);

  const clearDraft = useCallback(() => {
    setDraft({});
  }, []);

  const draftLines = useMemo(() => Object.values(draft), [draft]);

  const draftTotal = useMemo(() => {
    return draftLines.reduce(
      (sum, item) => sum + (Number(item.price) || 0) * item.qty,
      0
    );
  }, [draftLines]);

  return {
    draft,
    draftLines,
    draftTotal,
    addToDraft,
    changeDraft,
    removeLine,
    clearDraft,
  };
}
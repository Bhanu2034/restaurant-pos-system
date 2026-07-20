import { useMemo } from 'react';
import { useTableContext } from '../context/TableContext';
import { useKotContext } from '../context/KotContext';
import { useOrderContext } from '../context/OrderContext';
import { useTakeawayContext } from '../context/TakeawayContext';
import { useInventoryContext } from '../context/InventoryContext';
import { useNotificationContext } from '../context/NotificationContext';

/**
 * Computes sidebar badge counts from all contexts.
 * Centralized to avoid duplicating count logic in multiple components.
 */
export default function useSidebarCounts() {
  const { tables } = useTableContext();
  const { kots } = useKotContext();
  const { orders } = useOrderContext();
  const { activeTokens } = useTakeawayContext();
  const { lowStockCount } = useInventoryContext();
  const { alerts } = useNotificationContext();

  return useMemo(
    () => ({
      occupied: tables.filter((t) => t.status !== 'empty').length,
      activeKots: kots.filter((k) => k.status === 'active').length,
      billing: tables.filter((t) => (orders[t.id]?.items?.length || 0) > 0).length,
      takeaway: activeTokens.length,
      lowStock: lowStockCount,
      unreadAlerts: alerts.length,
    }),
    [tables, kots, orders, activeTokens, lowStockCount, alerts]
  );
}

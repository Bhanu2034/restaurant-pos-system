import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Flame, AlertTriangle, IndianRupee } from 'lucide-react';
import SectionTitle from '../../components/common/SectionTitle';
import StatCard from '../../components/dashboard/StatCard';
import TableSnapshot from '../../components/dashboard/TableSnapshot';
import StockWatch from '../../components/dashboard/StockWatch';
import { useTableContext } from '../../context/TableContext';
import { useKotContext } from '../../context/KotContext';
import { useInventoryContext } from '../../context/InventoryContext';
import { useBillingContext } from '../../context/BillingContext';
import { T } from '../../constants/theme';
import { ROUTES } from '../../constants/constants';
import { formatCurrency } from '../../utils/formatters';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { tables } = useTableContext();
  const { kots } = useKotContext();
  const { inventory, lowStockCount } = useInventoryContext();
  const { todaySales } = useBillingContext();

  const occupied = tables.filter((t) => t.status !== 'empty').length;
  const activeKots = kots.filter((k) => k.status === 'active').length;

  const stats = [
    {
      label: 'Tables Occupied',
      value: `${occupied}/${tables.length}`,
      icon: Users,
      color: T.primary,
      route: ROUTES.TABLES,
    },
    {
      label: 'Active KOTs',
      value: activeKots,
      icon: Flame,
      color: T.amber,
      route: ROUTES.KITCHEN,
    },
    {
      label: 'Low Stock Items',
      value: lowStockCount,
      icon: AlertTriangle,
      color: T.kumkum,
      route: ROUTES.INVENTORY,
    },
    {
      label: "Today's Sales",
      value: formatCurrency(todaySales),
      icon: IndianRupee,
      color: T.green,
      route: ROUTES.BILLING,
    },
  ];

  return (
    <div style={{ padding: '36px 44px' }}>
      <SectionTitle eyebrow="Overview" title="Good service, right now" />
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            icon={s.icon}
            color={s.color}
            onClick={() => navigate(s.route)}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <TableSnapshot tables={tables} />
        <StockWatch inventory={inventory} />
      </div>
    </div>
  );
}

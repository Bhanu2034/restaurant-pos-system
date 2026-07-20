import React, { useState } from 'react';
import SectionTitle from '../../components/common/SectionTitle';
import BillableTableList from '../../components/billing/BillableTableList';
import BillingReceipt from '../../components/billing/BillingReceipt';
import { useTableContext } from '../../context/TableContext';
import { useOrderContext } from '../../context/OrderContext';
import { useBillingContext } from '../../context/BillingContext';
import { useKotContext } from '../../context/KotContext';
import { TABLE_STATUS } from '../../constants/constants';
import { peekNextBillNumber } from '../../data/counters';
import useTaxCalculation from '../../hooks/useTaxCalculation';
import billingService from '../../services/billingService';

const KOT_NOT_DONE_MESSAGE =
  'Cannot close the bill until all KOT items have been completed by the kitchen.';

export default function BillingPage() {
  const { tables, clearTable } = useTableContext();
  const { orders, clearOrder } = useOrderContext();
  const { addSale } = useBillingContext();
  const { getPendingKotsForTable, isTableClearToBill } = useKotContext();

  const [selected, setSelected] = useState(null);
  const [paid, setPaid] = useState(null);
  const [settleError, setSettleError] = useState(null);

  const billable = tables.filter(
    (t) => t.status !== TABLE_STATUS.EMPTY && (orders[t.id]?.items?.length || 0) > 0
  );

  const lines = (selected && orders[selected]?.items) || [];
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const tax = useTaxCalculation(subtotal);

  // Live view of the kitchen for the selected table. This is driven off
  // KotContext's websocket-synced state, so it flips the instant the chef
  // bumps the last ticket — no polling, no page refresh needed.
  const pendingKots = selected ? getPendingKotsForTable(selected) : [];
  const kitchenReady = selected ? isTableClearToBill(selected) : false;

  // Replace your existing settle function with this:
  const settle = async (method) => {
    if (!kitchenReady) {
      // Frontend-only guard for a snappy message; the real enforcement is
      // in BillingService on the backend regardless of this check.
      setSettleError(KOT_NOT_DONE_MESSAGE);
      return;
    }

    setSettleError(null);

    try {
      // 1. Generate the bill first to get the official Bill Number from the database
      const generatedBill = await billingService.generateBill(selected, lines, tax);

      // 2. Immediately settle it using that generated bill number
      const response = await billingService.settleBill(generatedBill.billNumber, method, tax.total);

      addSale(tax.total);
      clearTable(selected);
      clearOrder(selected);

      setPaid({ number: response.billNumber, method, total: tax.total });
    } catch (error) {
      console.error("Failed to settle bill:", error);

      // The backend rejects with 409 + a message when KOTs are still
      // pending (e.g. an item was fired again right as the cashier hit
      // pay). Surface that message instead of a generic alert.
      if (error.response?.status === 409) {
        setSettleError(error.response.data?.message || KOT_NOT_DONE_MESSAGE);
      } else {
        alert("Failed to settle the bill. Please check the console for details.");
      }
    }
  };
  const handleSelectTable = (tableId) => {
    setSelected(tableId);
    setPaid(null);
    setSettleError(null);
  };

  return (
    <div style={{ padding: '36px 44px' }}>
      <SectionTitle eyebrow="Cashier Station" title="Billing &amp; point of sale" />

      <div className="grid gap-6" style={{ gridTemplateColumns: '280px 1fr' }}>
        <BillableTableList
          billable={billable}
          selectedId={selected}
          orders={orders}
          onSelect={handleSelectTable}
        />

        <BillingReceipt
          selectedId={selected}
          lines={lines}
          subtotal={tax.subtotal}
          cgst={tax.cgst}
          sgst={tax.sgst}
          total={tax.total}
          nextBillNumber={peekNextBillNumber()}
          onSettle={settle}
          paid={paid}
          kitchenReady={kitchenReady}
          pendingCount={pendingKots.length}
          blockedMessage={settleError || (!kitchenReady ? KOT_NOT_DONE_MESSAGE : null)}
        />
      </div>
    </div>
  );
}
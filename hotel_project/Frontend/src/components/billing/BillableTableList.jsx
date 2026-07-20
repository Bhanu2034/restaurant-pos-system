import React from 'react';
import Card from '../common/Card';
import { T, FONT_MONO } from '../../constants/theme';
import { useKotContext } from '../../context/KotContext';

/**
 * List of tables that have an open order. Note "billable" here just means
 * "has an order that could eventually be billed" — a table can still show
 * up here while its kitchen order is in progress. Whether the bill can
 * actually be *closed* is a separate, stricter check done in BillingPage /
 * BillingReceipt against live KOT status.
 */
export default function BillableTableList({ billable, selectedId, orders, onSelect }) {
  const { isTableClearToBill } = useKotContext();
  return (
    <Card style={{ padding: 16 }}>
      <div
        style={{
          fontSize: 11,
          fontFamily: FONT_MONO,
          color: T.inkSoft,
          marginBottom: 10,
        }}
      >
        TABLES READY TO BILL
      </div>
      {billable.length === 0 && (
        <div style={{ fontSize: 12.5, color: T.inkSoft }}>No open orders right now.</div>
      )}
      <div className="flex flex-col gap-2">
        {billable.map((t) => {
          const tot = orders[t.id].items.reduce((s, l) => s + l.price * l.qty, 0);
          const ready = isTableClearToBill(t.id);
          return (
            <button
              key={t.id}
              onClick={() => onSelect(t.id)}
              className="flex items-center justify-between"
              style={{
                border:
                  selectedId === t.id
                    ? `2px solid ${T.primary}`
                    : `1px solid ${T.border}`,
                borderRadius: 10,
                padding: '10px 12px',
                background: T.surface,
                cursor: 'pointer',
              }}
            >
              <span className="flex items-center gap-2">
                <span style={{ fontFamily: FONT_MONO, fontWeight: 700 }}>{t.id}</span>
                {!ready && (
                  <span
                    title="Kitchen still preparing — bill can't be closed yet"
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 10,
                      fontWeight: 700,
                      color: T.kumkum,
                      background: T.kumkumSoft,
                      borderRadius: 6,
                      padding: '2px 6px',
                    }}
                  >
                    KOT PENDING
                  </span>
                )}
              </span>
              <span style={{ fontFamily: FONT_MONO, fontSize: 12.5, color: T.inkSoft }}>
                ₹{tot}
              </span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

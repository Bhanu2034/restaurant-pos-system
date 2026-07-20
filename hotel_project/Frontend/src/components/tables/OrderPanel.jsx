import React from 'react';
import { Printer } from 'lucide-react';
import Card from '../common/Card';
import Pill from '../common/Pill';
import DraftOrderSummary from '../common/DraftOrderSummary';
import { T, FONT_DISPLAY, FONT_MONO } from '../../constants/theme';

/**
 * Order panel — shows existing order, draft items, and Fire KOT button.
 */
export default function OrderPanel({
  selectedId,
  table,
  currentOrder,
  orderTotal,
  draftLines,
  draftTotal,
  onChangeDraft,
  onRemoveLine,
  onSendKOT,
  justSent,
}) {
  if (!selectedId) {
    return (
      <Card style={{ padding: 18 }}>
        <div style={{ color: T.inkSoft, fontSize: 12.5 }}>No table selected.</div>
      </Card>
    );
  }

  return (
    <Card style={{ padding: 18 }}>
      <div className="flex items-center justify-between mb-2">
        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 17,
            fontWeight: 600,
            color: T.primaryDeep,
          }}
        >
          Table {selectedId}
        </div>
        <Pill bg={T.blueSoft} color={T.blue}>
          {table.status}
        </Pill>
      </div>

      {/* Already fired items */}
      {currentOrder.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div
            style={{
              fontSize: 11,
              color: T.inkSoft,
              fontFamily: FONT_MONO,
              marginBottom: 6,
            }}
          >
            ALREADY FIRED
          </div>
          <div className="flex flex-col gap-1">
            {currentOrder.map((l) => (
              <div key={l.menuItemId} className="flex justify-between" style={{ fontSize: 12.5 }}>
                <span>
                  {l.qty} &times; {l.name}
                </span>
                <span style={{ fontFamily: FONT_MONO }}>₹{l.price * l.qty}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New draft items */}
      <div
        style={{
          fontSize: 11,
          color: T.inkSoft,
          fontFamily: FONT_MONO,
          marginBottom: 6,
        }}
      >
        NEW ITEMS (this KOT)
      </div>

      <DraftOrderSummary
        draftLines={draftLines}
        draftTotal={draftTotal}
        onChangeDraft={onChangeDraft}
        onRemoveLine={onRemoveLine}
      />

      {/* Fire KOT button */}
      <button
        onClick={onSendKOT}
        disabled={!draftLines.length}
        className="w-full flex items-center justify-center gap-2"
        style={{
          background: draftLines.length ? T.primary : T.surfaceSunk,
          color: draftLines.length ? '#fff' : T.inkSoft,
          border: 'none',
          borderRadius: 10,
          padding: '11px 0',
          fontWeight: 700,
          fontSize: 13.5,
          cursor: draftLines.length ? 'pointer' : 'not-allowed',
        }}
      >
        <Printer size={15} /> Fire KOT to kitchen
      </button>

      {/* Confirmation message */}
      {justSent && (
        <div style={{ marginTop: 10, fontSize: 12, color: T.green, textAlign: 'center' }}>
          KOT #{justSent.number} sent · {justSent.count} item
          {justSent.count > 1 ? 's' : ''} · now on KDS
        </div>
      )}

      {/* Running total */}
      {currentOrder.length > 0 && (
        <div style={{ marginTop: 10, fontSize: 11.5, color: T.inkSoft, textAlign: 'center' }}>
          Running total:{' '}
          <b style={{ fontFamily: FONT_MONO }}>₹{orderTotal}</b> — settle from Billing / POS
        </div>
      )}
    </Card>
  );
}

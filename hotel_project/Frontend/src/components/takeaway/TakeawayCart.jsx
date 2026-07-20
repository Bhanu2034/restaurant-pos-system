import React from 'react';
import { Check } from 'lucide-react';
import Card from '../common/Card';
import DraftOrderSummary from '../common/DraftOrderSummary';
import PaymentButtons from '../common/PaymentButtons';
import { T, FONT_DISPLAY, FONT_MONO } from '../../constants/theme';
import { Wallet } from 'lucide-react';

/**
 * Takeaway cart — draft order with tax breakdown and payment buttons.
 */
export default function TakeawayCart({
  confirmed,
  onNewOrder,
  draftLines,
  draftTotal,
  onChangeDraft,
  onRemoveLine,
  tax,
  onPay,
}) {
  if (confirmed) {
    return (
      <Card style={{ padding: 18 }}>
        <div style={{ textAlign: 'center', padding: 30 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: T.greenSoft,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
            }}
          >
            <Check size={26} color={T.green} />
          </div>
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 20,
              fontWeight: 600,
              color: T.primaryDeep,
            }}
          >
            Token #{confirmed.token}
          </div>
          <div style={{ fontSize: 13, color: T.inkSoft, marginTop: 4 }}>
            ₹{confirmed.total} received via {confirmed.method} · KOT sent to kitchen
          </div>
          <button
            onClick={onNewOrder}
            className="mt-5"
            style={{
              border: `1px solid ${T.border}`,
              background: T.surface,
              borderRadius: 8,
              padding: '8px 16px',
              fontSize: 12.5,
              fontWeight: 600,
              color: T.primary,
              cursor: 'pointer',
            }}
          >
            New order
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card style={{ padding: 18 }}>
      <div
        style={{
          fontFamily: FONT_DISPLAY,
          fontSize: 17,
          fontWeight: 600,
          color: T.primaryDeep,
          marginBottom: 10,
        }}
      >
        New takeaway order
      </div>

      {draftLines.length === 0 ? (
        <div style={{ fontSize: 12.5, color: T.inkSoft, marginBottom: 14 }}>
          Tap dishes from the menu to add them.
        </div>
      ) : (
        <div className="flex flex-col gap-2 mb-4" style={{ fontFamily: FONT_MONO }}>
          <DraftOrderSummary
            draftLines={draftLines}
            draftTotal={draftTotal}
            onChangeDraft={onChangeDraft}
            onRemoveLine={onRemoveLine}
            label=""
          />
          <div style={{ borderTop: `1px dashed ${T.border}`, margin: '4px 0' }} />
          <div className="flex justify-between" style={{ fontSize: 12, color: T.inkSoft }}>
            <span>Subtotal</span>
            <span>₹{tax.subtotal}</span>
          </div>
          <div className="flex justify-between" style={{ fontSize: 12, color: T.inkSoft }}>
            <span>CGST + SGST (5%)</span>
            <span>₹{tax.cgst + tax.sgst}</span>
          </div>
          <div className="flex justify-between" style={{ fontWeight: 700, fontSize: 14 }}>
            <span>Total (pay now)</span>
            <span>₹{tax.total}</span>
          </div>
        </div>
      )}

      <div
        style={{
          fontSize: 11,
          color: T.inkSoft,
          fontFamily: FONT_MONO,
          marginBottom: 6,
        }}
      >
        <Wallet size={11} style={{ display: 'inline', marginRight: 4, marginBottom: -1 }} />
        COLLECT PAYMENT TO FIRE KOT
      </div>
      <PaymentButtons onPay={onPay} disabled={!draftLines.length} />
    </Card>
  );
}

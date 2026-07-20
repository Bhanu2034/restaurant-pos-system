import React from 'react';
import { Check } from 'lucide-react';
import Card from '../common/Card';
import PaymentButtons from '../common/PaymentButtons';
import { T, FONT_DISPLAY, FONT_MONO, FONT_BODY } from '../../constants/theme';

/**
 * Billing receipt — shows line items, tax breakdown, and payment buttons.
 * Also shows post-settlement confirmation.
 */
export default function BillingReceipt({
  selectedId,
  lines,
  subtotal,
  cgst,
  sgst,
  total,
  nextBillNumber,
  onSettle,
  paid,
  kitchenReady = true,
  pendingCount = 0,
  blockedMessage = null,
}) {
  if (!selectedId) {
    return (
      <Card style={{ padding: 24 }}>
        <div style={{ color: T.inkSoft, fontSize: 13, textAlign: 'center', padding: 60 }}>
          Pick a table on the left to generate its bill.
        </div>
      </Card>
    );
  }

  if (paid) {
    return (
      <Card style={{ padding: 24 }}>
        <div style={{ textAlign: 'center', padding: 40 }}>
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
            Bill #{paid.number} settled
          </div>
          <div style={{ fontSize: 13, color: T.inkSoft, marginTop: 4 }}>
            ₹{paid.total} received via {paid.method} · Table {selectedId} is now free
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card style={{ padding: 24 }}>
      <div style={{ maxWidth: 420, margin: '0 auto', fontFamily: FONT_MONO }}>
        <div className="flex items-center justify-between mb-1">
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 19,
              fontWeight: 600,
              color: T.primaryDeep,
            }}
          >
            Table {selectedId}
          </div>
          <span style={{ fontSize: 11, color: T.inkSoft }}>Bill #{nextBillNumber}</span>
        </div>

        <div style={{ borderTop: `1px dashed ${T.border}`, margin: '10px 0' }} />

        {lines.map((l) => (
          <div
            key={l.menuItemId}
            className="flex justify-between"
            style={{ fontSize: 13, marginBottom: 6 }}
          >
            <span>
              {l.qty} &times; {l.name}
            </span>
            <span>₹{l.price * l.qty}</span>
          </div>
        ))}

        <div style={{ borderTop: `1px dashed ${T.border}`, margin: '10px 0' }} />

        <div className="flex justify-between" style={{ fontSize: 12.5, color: T.inkSoft }}>
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>
        <div className="flex justify-between" style={{ fontSize: 12.5, color: T.inkSoft }}>
          <span>CGST (2.5%)</span>
          <span>₹{cgst}</span>
        </div>
        <div
          className="flex justify-between"
          style={{ fontSize: 12.5, color: T.inkSoft, marginBottom: 6 }}
        >
          <span>SGST (2.5%)</span>
          <span>₹{sgst}</span>
        </div>

        <div style={{ borderTop: `1px solid ${T.ink}`, margin: '8px 0' }} />

        <div
          className="flex justify-between"
          style={{ fontSize: 17, fontWeight: 700, color: T.ink }}
        >
          <span>Total</span>
          <span>₹{total}</span>
        </div>

        {!kitchenReady && (
          <div
            role="alert"
            style={{
              marginTop: 14,
              marginBottom: 4,
              padding: '10px 12px',
              borderRadius: 8,
              background: T.kumkumSoft,
              color: T.kumkum,
              fontFamily: FONT_BODY,
              fontSize: 12.5,
              lineHeight: 1.4,
            }}
          >
            {blockedMessage}
            {pendingCount > 0 && (
              <>
                {' '}
                ({pendingCount} KOT{pendingCount > 1 ? 's' : ''} still in the kitchen.)
              </>
            )}
          </div>
        )}

        <div className="mt-6" style={{ fontFamily: FONT_BODY }}>
          <PaymentButtons onPay={onSettle} disabled={!kitchenReady} />
        </div>
      </div>
    </Card>
  );
}

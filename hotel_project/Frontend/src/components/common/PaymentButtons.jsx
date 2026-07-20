import React, { useState } from 'react';
import { T, FONT_BODY } from '../../constants/theme';
import { PAYMENT_METHODS } from '../../constants/constants';

export default function PaymentButtons({ onPay, disabled = false }) {
  const [selectedMethod, setSelectedMethod] = useState(null);

  const handlePayment = (m) => {
    setSelectedMethod(m);
    onPay(m);
  };

  return (
    <div className="flex gap-2">
      {PAYMENT_METHODS.map((m) => (
        <button
          key={m}
          disabled={disabled}
          onClick={() => handlePayment(m)}
          className="flex-1"
          style={{
            // Show immediate selected state visually
            background: selectedMethod === m ? T.primaryDeep : (!disabled ? T.primary : T.surfaceSunk),
            color: !disabled ? '#fff' : T.inkSoft,
            border: 'none',
            borderRadius: 8,
            padding: '10px 0',
            fontWeight: 600,
            fontSize: 13,
            fontFamily: FONT_BODY,
            cursor: !disabled ? 'pointer' : 'not-allowed',
          }}
        >
          {m}
        </button>
      ))}
    </div>
  );
}
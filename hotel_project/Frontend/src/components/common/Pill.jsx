import React from 'react';
import { FONT_MONO } from '../../constants/theme';

/**
 * Status pill badge with monospace text.
 * Used for table status, stock status, KOT elapsed time, etc.
 */
export default function Pill({ children, bg, color }) {
  return (
    <span
      style={{
        background: bg,
        color: color,
        fontFamily: FONT_MONO,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 0.4,
        padding: '3px 8px',
        borderRadius: 999,
        textTransform: 'uppercase',
      }}
    >
      {children}
    </span>
  );
}

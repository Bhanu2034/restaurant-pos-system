import React from 'react';
import { T } from '../../constants/theme';

/**
 * Surface card with border and rounded corners.
 * Used as the base container throughout the UI.
 */
export default function Card({ children, style, className }) {
  return (
    <div
      className={className}
      style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 14,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

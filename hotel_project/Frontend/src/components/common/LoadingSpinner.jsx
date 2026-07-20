import React from 'react';
import { T } from '../../constants/theme';

/**
 * Loading spinner indicator.
 */
export default function LoadingSpinner({ size = 32, message = 'Loading...' }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
        gap: 12,
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          border: `3px solid ${T.border}`,
          borderTop: `3px solid ${T.primary}`,
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <div style={{ fontSize: 13, color: T.inkSoft }}>{message}</div>
    </div>
  );
}

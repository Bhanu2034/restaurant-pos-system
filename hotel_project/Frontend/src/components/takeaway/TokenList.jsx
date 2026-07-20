import React from 'react';
import Pill from '../common/Pill';
import { T, FONT_MONO } from '../../constants/theme';

/**
 * Active takeaway tokens in progress.
 */
export default function TokenList({ tokens, onHandOver, statusFor }) {
  if (tokens.length === 0) return null;

  return (
    <div style={{ marginTop: 22 }}>
      <div
        style={{
          fontSize: 11,
          fontFamily: FONT_MONO,
          color: T.inkSoft,
          marginBottom: 8,
          letterSpacing: 0.5,
        }}
      >
        TOKENS IN PROGRESS
      </div>
      <div className="flex flex-col gap-2">
        {tokens.map((t) => {
          const status = statusFor(t.token);
          return (
            <div
              key={t.token}
              className="flex items-center justify-between"
              style={{
                border: `1px solid ${T.border}`,
                borderRadius: 10,
                padding: '9px 12px',
                background: status === 'ready' ? T.greenSoft : T.surface,
              }}
            >
              <div className="flex items-center gap-3">
                <span style={{ fontFamily: FONT_MONO, fontWeight: 700 }}>#{t.token}</span>
                <span style={{ fontSize: 12, color: T.inkSoft }}>
                  {t.items.length} item{t.items.length > 1 ? 's' : ''} &middot; ₹{t.total}
                </span>
                {status === 'ready' ? (
                  <Pill bg={T.greenSoft} color={T.green}>
                    Ready for pickup
                  </Pill>
                ) : (
                  <Pill bg={T.amberSoft} color={T.amber}>
                    Preparing
                  </Pill>
                )}
              </div>
              {status === 'ready' && (
                <button
                  onClick={() => onHandOver(t.token)}
                  style={{
                    border: 'none',
                    borderRadius: 7,
                    padding: '6px 10px',
                    background: T.primary,
                    color: '#fff',
                    fontSize: 11.5,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Mark handed over
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

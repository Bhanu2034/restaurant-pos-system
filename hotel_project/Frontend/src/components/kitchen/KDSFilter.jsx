import React from 'react';
import { T, FONT_BODY, FONT_MONO } from '../../constants/theme';

/**
 * KDS filter tabs — All / Dine-in / Takeaway segment control.
 */
export default function KDSFilter({ filters, activeFilter, onSelect }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {filters.map((f) => (
        <button
          key={f.id}
          onClick={() => onSelect(f.id)}
          className="flex items-center gap-2"
          style={{
            border:
              activeFilter === f.id
                ? `1px solid ${T.primary}`
                : `1px solid ${T.border}`,
            background: activeFilter === f.id ? T.primary : T.surface,
            color: activeFilter === f.id ? '#fff' : T.inkSoft,
            borderRadius: 999,
            padding: '8px 16px',
            fontSize: 12.5,
            fontFamily: FONT_BODY,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {f.label}
          <span
            style={{
              background:
                activeFilter === f.id ? 'rgba(255,255,255,0.25)' : T.surfaceSunk,
              color: activeFilter === f.id ? '#fff' : T.inkSoft,
              borderRadius: 999,
              fontFamily: FONT_MONO,
              fontSize: 11,
              padding: '1px 7px',
            }}
          >
            {f.count}
          </span>
        </button>
      ))}
    </div>
  );
}

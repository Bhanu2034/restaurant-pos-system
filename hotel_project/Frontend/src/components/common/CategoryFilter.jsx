import React from 'react';
import { T, FONT_BODY } from '../../constants/theme';

/**
 * Category filter pill row.
 * Used in Tables, Takeaway, and Menu views.
 */
export default function CategoryFilter({ categories, activeCategory, onSelect }) {
  return (
    <div className="flex items-center gap-2 mb-3 flex-wrap">
      {categories.map((c) => (
        <button
          key={c}
          onClick={() => onSelect(c)}
          style={{
            border: 'none',
            borderRadius: 999,
            padding: '6px 12px',
            fontSize: 12,
            fontFamily: FONT_BODY,
            fontWeight: 600,
            cursor: 'pointer',
            background: activeCategory === c ? T.primary : T.surfaceSunk,
            color: activeCategory === c ? '#fff' : T.inkSoft,
          }}
        >
          {c}
        </button>
      ))}
    </div>
  );
}

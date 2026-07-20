import React from 'react';
import { Leaf, Plus } from 'lucide-react';
import { T, FONT_MONO, FONT_BODY } from '../../constants/theme';

/**
 * A menu item button used in the order-punching grids.
 * Shared between TablesView and TakeawayView.
 *
 * `available` (default true) lets the caller grey the dish out and block
 * adding it — e.g. when a linked ingredient has run out of stock.
 */
export default function MenuItemCard({ item, onAdd, available = true }) {
  return (
    <button
      onClick={() => available && onAdd(item)}
      disabled={!available}
      className="flex items-center justify-between"
      style={{
        border: `1px solid ${T.border}`,
        borderRadius: 10,
        padding: '10px 12px',
        background: available ? T.surface : T.surfaceSunk,
        cursor: available ? 'pointer' : 'not-allowed',
        textAlign: 'left',
        fontFamily: FONT_BODY,
        opacity: available ? 1 : 0.55,
      }}
    >
      <div>
        <div className="flex items-center gap-1.5">
          <Leaf size={10} color={T.green} />
          <span style={{ fontSize: 13, fontWeight: 500 }}>{item.name}</span>
        </div>
        <div style={{ fontFamily: FONT_MONO, fontSize: 12, color: T.inkSoft, marginTop: 2 }}>
          {available ? `₹${item.price}` : 'Out of stock'}
        </div>
      </div>
      <Plus size={15} color={available ? T.primary : T.inkSoft} />
    </button>
  );
}

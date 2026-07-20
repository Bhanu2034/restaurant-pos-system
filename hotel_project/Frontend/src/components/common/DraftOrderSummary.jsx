import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { T, FONT_MONO, FONT_BODY } from '../../constants/theme';

const iconBtnStyle = {
  width: 22,
  height: 22,
  borderRadius: 6,
  border: `1px solid ${T.border}`,
  background: T.surface,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
};

const deleteBtnStyle = {
  ...iconBtnStyle,
  border: `1px solid ${T.kumkumSoft}`,
  color: T.kumkum,
  marginLeft: 2,
};

/**
 * Draft order summary with line items, +/- controls, and total.
 * Shared between Tables and Takeaway views.
 *
 * Each draft line is keyed by `menuItemId` (the id of the menu item it was
 * added from) — draft lines themselves don't carry an `id` field, so using
 * `l.id` here (as this component previously did) silently resolved to
 * `undefined` for every line, which meant onChangeDraft(undefined, ±1) was a
 * no-op and there was no way to adjust or remove a mistakenly added item.
 */
export default function DraftOrderSummary({ draftLines, draftTotal, onChangeDraft, onRemoveLine, label = 'New total' }) {
  if (draftLines.length === 0) {
    return (
      <div style={{ fontSize: 12.5, color: T.inkSoft, marginBottom: 14 }}>
        Tap dishes from the menu to add them.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 mb-4">
      {draftLines.map((l) => (
        <div key={l.menuItemId} className="flex items-center justify-between">
          <div style={{ fontSize: 13, fontFamily: FONT_BODY }}>{l.name}</div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onChangeDraft(l.menuItemId, -1)}
              style={iconBtnStyle}
              title="Decrease quantity"
              aria-label={`Decrease ${l.name} quantity`}
            >
              <Minus size={12} />
            </button>
            <span style={{ fontFamily: FONT_MONO, fontSize: 13, width: 16, textAlign: 'center' }}>
              {l.qty}
            </span>
            <button
              onClick={() => onChangeDraft(l.menuItemId, 1)}
              style={iconBtnStyle}
              title="Increase quantity"
              aria-label={`Increase ${l.name} quantity`}
            >
              <Plus size={12} />
            </button>
            <button
              onClick={() =>
                onRemoveLine ? onRemoveLine(l.menuItemId) : onChangeDraft(l.menuItemId, -l.qty)
              }
              style={deleteBtnStyle}
              title="Remove item"
              aria-label={`Remove ${l.name} from order`}
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      ))}
      <div
        className="flex justify-between"
        style={{
          borderTop: `1px dashed ${T.border}`,
          paddingTop: 8,
          fontWeight: 700,
          fontFamily: FONT_MONO,
          fontSize: 13,
        }}
      >
        <span>{label}</span>
        <span>₹{draftTotal}</span>
      </div>
    </div>
  );
}

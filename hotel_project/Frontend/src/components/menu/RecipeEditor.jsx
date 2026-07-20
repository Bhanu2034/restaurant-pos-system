import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { useInventoryContext } from "../../context/InventoryContext";
import { T, FONT_MONO, FONT_BODY } from "../../constants/theme";

const inputStyle = {
  border: `1px solid ${T.border}`,
  borderRadius: 7,
  padding: "6px 8px",
  fontSize: 12.5,
  fontFamily: FONT_BODY,
  background: T.surface,
  color: T.ink,
};

/**
 * Lets a menu item declare which inventory ingredients it consumes, and how
 * much of each per order. This is the actual UI-level link between
 * Inventory and Menu — previously nothing connected the two at all.
 *
 * value: [{ inventoryItemId, qtyPerOrder }]
 */
export default function RecipeEditor({ value, onChange }) {
  const { inventory } = useInventoryContext();

  const addLine = () => {
    if (!inventory.length) return;
    const used = new Set(value.map((l) => l.inventoryItemId));
    const next = inventory.find((i) => !used.has(i.id)) || inventory[0];
    onChange([...value, { inventoryItemId: next.id, qtyPerOrder: 1 }]);
  };

  const updateLine = (index, patch) => {
    onChange(value.map((l, i) => (i === index ? { ...l, ...patch } : l)));
  };

  const removeLine = (index) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const unitFor = (inventoryItemId) =>
    inventory.find((i) => i.id === inventoryItemId)?.unit || "";

  return (
    <div style={{ marginTop: 4 }}>
      <div
        style={{
          fontSize: 10.5,
          color: T.inkSoft,
          fontFamily: FONT_MONO,
          marginBottom: 6,
        }}
      >
        RECIPE (INGREDIENTS USED PER ORDER)
      </div>

      {!inventory.length && (
        <div style={{ fontSize: 12, color: T.inkSoft, marginBottom: 8 }}>
          No inventory items yet — add ingredients under Inventory first.
        </div>
      )}

      {value.map((line, index) => (
        <div
          key={index}
          className="flex items-center gap-2"
          style={{ marginBottom: 6 }}
        >
          <select
            style={{ ...inputStyle, flex: 2 }}
            value={line.inventoryItemId}
            onChange={(e) =>
              updateLine(index, { inventoryItemId: Number(e.target.value) })
            }
          >
            {inventory.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </select>

          <input
            style={{ ...inputStyle, flex: 1 }}
            type="number"
            min="0"
            step="0.1"
            value={line.qtyPerOrder}
            onChange={(e) =>
              updateLine(index, { qtyPerOrder: Number(e.target.value) })
            }
          />

          <span style={{ fontSize: 12, color: T.inkSoft, minWidth: 44 }}>
            {unitFor(line.inventoryItemId)}
          </span>

          <button
            type="button"
            onClick={() => removeLine(index)}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "#d32f2f",
              padding: 4,
            }}
          >
            <Trash2 size={15} />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addLine}
        disabled={!inventory.length}
        className="flex items-center gap-1.5"
        style={{
          background: "transparent",
          border: `1px dashed ${T.border}`,
          borderRadius: 7,
          padding: "6px 10px",
          fontSize: 12,
          color: T.primary,
          cursor: inventory.length ? "pointer" : "not-allowed",
          marginTop: 2,
        }}
      >
        <Plus size={13} /> Add ingredient
      </button>
    </div>
  );
}

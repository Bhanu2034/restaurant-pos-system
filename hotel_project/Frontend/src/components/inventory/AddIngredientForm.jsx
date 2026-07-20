import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Card from '../common/Card';
import { T, FONT_DISPLAY, FONT_MONO, FONT_BODY } from '../../constants/theme';
import { UNIT_OPTIONS } from '../../data/inventoryData';
import { KDS_STATIONS } from '../../constants/constants';

const inputStyle = {
  width: '100%',
  border: `1px solid ${T.border}`,
  borderRadius: 7,
  padding: '6px 8px',
  fontSize: 12.5,
  fontFamily: FONT_BODY,
  background: T.surface,
  color: T.ink,
};

const fieldLabelStyle = {
  fontSize: 10.5,
  color: T.inkSoft,
  fontFamily: FONT_MONO,
  marginBottom: 4,
};

/**
 * Add new ingredient form.
 *
 * An item can optionally be marked "Sellable" — this covers stock that's
 * sold as-is rather than cooked into a dish (Water Bottle, Soft Drinks,
 * Buttermilk, Ice Cream, Juice, packaged snacks, ...). When sellable, the
 * backend automatically mirrors it onto the Menu (Table Order + Takeaway)
 * so it never needs to be entered twice, and selling it deducts this same
 * stock row directly.
 */
export default function AddIngredientForm({ onAdd }) {
  const emptyDraft = {
    name: '',
    unit: 'kg',
    stock: '',
    threshold: '',
    sellable: false,
    sellingPrice: '',
    menuCategory: '',
    station: KDS_STATIONS[KDS_STATIONS.length - 1],
  };
  const [newItem, setNewItem] = useState(emptyDraft);
  const [error, setError] = useState('');

  const handleAdd = () => {
    const name = newItem.name.trim();
    const stock = Number(newItem.stock);
    const threshold = Number(newItem.threshold);

    if (!name) return setError('Give the ingredient a name.');
    if (newItem.stock === '' || Number.isNaN(stock) || stock < 0)
      return setError('Enter a valid stock quantity.');
    if (newItem.threshold === '' || Number.isNaN(threshold) || threshold < 0)
      return setError('Enter a valid reorder threshold.');

    let sellingPrice = null;
    if (newItem.sellable) {
      sellingPrice = Number(newItem.sellingPrice);
      if (newItem.sellingPrice === '' || Number.isNaN(sellingPrice) || sellingPrice < 0)
        return setError('Enter a valid selling price for a sellable item.');
    }

    onAdd({
      name,
      unit: newItem.unit,
      stock,
      threshold,
      sellable: newItem.sellable,
      sellingPrice: newItem.sellable ? sellingPrice : null,
      menuCategory: newItem.sellable ? newItem.menuCategory.trim() || 'Beverages & Extras' : null,
      station: newItem.sellable ? newItem.station : null,
    });
    setNewItem(emptyDraft);
    setError('');
  };

  return (
    <Card style={{ padding: 18, marginBottom: 18 }}>
      <div
        style={{
          fontFamily: FONT_DISPLAY,
          fontSize: 15.5,
          fontWeight: 600,
          color: T.primaryDeep,
          marginBottom: 12,
        }}
      >
        Add new ingredient
      </div>
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr auto', alignItems: 'start' }}
      >
        <div>
          <div style={fieldLabelStyle}>NAME</div>
          <input
            style={inputStyle}
            placeholder="e.g. Jaggery"
            value={newItem.name}
            onChange={(e) => setNewItem((n) => ({ ...n, name: e.target.value }))}
          />
        </div>
        <div>
          <div style={fieldLabelStyle}>UNIT</div>
          <select
            style={inputStyle}
            value={newItem.unit}
            onChange={(e) => setNewItem((n) => ({ ...n, unit: e.target.value }))}
          >
            {UNIT_OPTIONS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
        <div>
          <div style={fieldLabelStyle}>STOCK</div>
          <input
            style={inputStyle}
            type="number"
            min="0"
            placeholder="0"
            value={newItem.stock}
            onChange={(e) => setNewItem((n) => ({ ...n, stock: e.target.value }))}
          />
        </div>
        <div>
          <div style={fieldLabelStyle}>THRESHOLD</div>
          <input
            style={inputStyle}
            type="number"
            min="0"
            placeholder="0"
            value={newItem.threshold}
            onChange={(e) => setNewItem((n) => ({ ...n, threshold: e.target.value }))}
          />
        </div>
        <div style={{ paddingTop: 18 }}>
          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5"
            style={{
              background: T.primary,
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '8px 14px',
              fontWeight: 600,
              fontSize: 12.5,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            <Plus size={14} /> Add item
          </button>
        </div>
      </div>

      <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px dashed ${T.border}` }}>
        <label
          className="flex items-center gap-2"
          style={{ fontSize: 12.5, fontFamily: FONT_BODY, color: T.ink, cursor: 'pointer' }}
        >
          <input
            type="checkbox"
            checked={newItem.sellable}
            onChange={(e) => setNewItem((n) => ({ ...n, sellable: e.target.checked }))}
          />
          Sell this item directly (list it on the Table Order &amp; Takeaway menus)
        </label>

        {newItem.sellable && (
          <div
            className="grid gap-3"
            style={{ gridTemplateColumns: '1fr 1fr 1fr', marginTop: 10 }}
          >
            <div>
              <div style={fieldLabelStyle}>SELLING PRICE (₹)</div>
              <input
                style={inputStyle}
                type="number"
                min="0"
                placeholder="e.g. 20"
                value={newItem.sellingPrice}
                onChange={(e) => setNewItem((n) => ({ ...n, sellingPrice: e.target.value }))}
              />
            </div>
            <div>
              <div style={fieldLabelStyle}>MENU CATEGORY</div>
              <input
                style={inputStyle}
                placeholder="Beverages & Extras"
                value={newItem.menuCategory}
                onChange={(e) => setNewItem((n) => ({ ...n, menuCategory: e.target.value }))}
              />
            </div>
            <div>
              <div style={fieldLabelStyle}>KDS STATION</div>
              <select
                style={inputStyle}
                value={newItem.station}
                onChange={(e) => setNewItem((n) => ({ ...n, station: e.target.value }))}
              >
                {KDS_STATIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div style={{ marginTop: 8, fontSize: 12, color: T.kumkum, fontFamily: FONT_BODY }}>
          {error}
        </div>
      )}
    </Card>
  );
}

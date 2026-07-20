import React, { useState } from 'react';
import { Pencil, Trash2, Save, XCircle } from 'lucide-react';
import Card from '../common/Card';
import Pill from '../common/Pill';
import { T, FONT_MONO, FONT_BODY } from '../../constants/theme';
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

/**
 * Full inventory table with inline edit and delete.
 *
 * Items marked "sellable" are mirrored onto the Menu by the backend
 * (InventoryService#syncMenuListing) — the "Menu" column reflects that
 * link, and editing sellable/price/category/station here keeps it in sync.
 */
export default function InventoryTable({ inventory, onRestock, onEdit, onDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({
    name: '',
    unit: 'kg',
    stock: '',
    threshold: '',
    sellable: false,
    sellingPrice: '',
    menuCategory: '',
    station: KDS_STATIONS[KDS_STATIONS.length - 1],
  });
  const [editError, setEditError] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditDraft({
      name: item.name,
      unit: item.unit,
      stock: String(item.stock),
      threshold: String(item.threshold),
      sellable: !!item.sellable,
      sellingPrice: item.sellingPrice != null ? String(item.sellingPrice) : '',
      menuCategory: item.menuCategory || '',
      station: item.station || KDS_STATIONS[KDS_STATIONS.length - 1],
    });
    setEditError('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditError('');
  };

  const saveEdit = (id) => {
    const name = editDraft.name.trim();
    const stock = Number(editDraft.stock);
    const threshold = Number(editDraft.threshold);
    if (!name) return setEditError("Name can't be empty.");
    if (editDraft.stock === '' || Number.isNaN(stock) || stock < 0)
      return setEditError('Invalid stock quantity.');
    if (editDraft.threshold === '' || Number.isNaN(threshold) || threshold < 0)
      return setEditError('Invalid threshold.');

    let sellingPrice = null;
    if (editDraft.sellable) {
      sellingPrice = Number(editDraft.sellingPrice);
      if (editDraft.sellingPrice === '' || Number.isNaN(sellingPrice) || sellingPrice < 0)
        return setEditError('Enter a valid selling price for a sellable item.');
    }

    onEdit(id, {
      name,
      unit: editDraft.unit,
      stock,
      threshold,
      sellable: editDraft.sellable,
      sellingPrice: editDraft.sellable ? sellingPrice : null,
      menuCategory: editDraft.sellable ? editDraft.menuCategory.trim() || 'Beverages & Extras' : null,
      station: editDraft.sellable ? editDraft.station : null,
    });
    setEditingId(null);
    setEditError('');
  };

  const confirmDelete = (id) => {
    onDelete(id);
    if (editingId === id) setEditingId(null);
    setPendingDelete(null);
  };

  return (
    <Card style={{ padding: 0, overflow: 'hidden' }}>
      <table className="w-full" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: T.surfaceSunk }}>
            {['Ingredient', 'Unit', 'Stock', 'Threshold', 'Status', 'Menu', ''].map((h) => (
              <th
                key={h}
                style={{
                  textAlign: 'left',
                  padding: '10px 18px',
                  fontFamily: FONT_MONO,
                  fontSize: 11,
                  color: T.inkSoft,
                  letterSpacing: 0.5,
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {inventory.length === 0 && (
            <tr>
              <td
                colSpan={7}
                style={{
                  padding: '22px 18px',
                  fontSize: 13,
                  color: T.inkSoft,
                  textAlign: 'center',
                }}
              >
                No ingredients tracked yet — add one above.
              </td>
            </tr>
          )}
          {inventory.map((i) => {
            const low = i.stock <= i.threshold;
            const warn = i.stock <= i.threshold * 1.5 && !low;
            const isEditing = editingId === i.id;
            const isPendingDelete = pendingDelete === i.id;

            if (isEditing) {
              return (
                <tr
                  key={i.id}
                  style={{ borderTop: `1px solid ${T.border}`, background: T.surfaceSunk }}
                >
                  <td style={{ padding: '10px 18px' }}>
                    <input
                      style={inputStyle}
                      value={editDraft.name}
                      onChange={(e) =>
                        setEditDraft((d) => ({ ...d, name: e.target.value }))
                      }
                    />
                  </td>
                  <td style={{ padding: '10px 18px' }}>
                    <select
                      style={inputStyle}
                      value={editDraft.unit}
                      onChange={(e) =>
                        setEditDraft((d) => ({ ...d, unit: e.target.value }))
                      }
                    >
                      {UNIT_OPTIONS.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: '10px 18px' }}>
                    <input
                      style={{ ...inputStyle, width: 80 }}
                      type="number"
                      min="0"
                      value={editDraft.stock}
                      onChange={(e) =>
                        setEditDraft((d) => ({ ...d, stock: e.target.value }))
                      }
                    />
                  </td>
                  <td style={{ padding: '10px 18px' }}>
                    <input
                      style={{ ...inputStyle, width: 80 }}
                      type="number"
                      min="0"
                      value={editDraft.threshold}
                      onChange={(e) =>
                        setEditDraft((d) => ({ ...d, threshold: e.target.value }))
                      }
                    />
                  </td>
                  <td style={{ padding: '10px 18px' }} colSpan={3}>
                    <div className="flex flex-col gap-2">
                      <label
                        className="flex items-center gap-2"
                        style={{ fontSize: 12, fontFamily: FONT_BODY, cursor: 'pointer' }}
                      >
                        <input
                          type="checkbox"
                          checked={editDraft.sellable}
                          onChange={(e) =>
                            setEditDraft((d) => ({ ...d, sellable: e.target.checked }))
                          }
                        />
                        Sellable on menu
                      </label>

                      {editDraft.sellable && (
                        <div className="flex items-center gap-2">
                          <input
                            style={{ ...inputStyle, width: 90 }}
                            type="number"
                            min="0"
                            placeholder="Price ₹"
                            value={editDraft.sellingPrice}
                            onChange={(e) =>
                              setEditDraft((d) => ({ ...d, sellingPrice: e.target.value }))
                            }
                          />
                          <input
                            style={{ ...inputStyle, width: 140 }}
                            placeholder="Menu category"
                            value={editDraft.menuCategory}
                            onChange={(e) =>
                              setEditDraft((d) => ({ ...d, menuCategory: e.target.value }))
                            }
                          />
                          <select
                            style={{ ...inputStyle, width: 150 }}
                            value={editDraft.station}
                            onChange={(e) =>
                              setEditDraft((d) => ({ ...d, station: e.target.value }))
                            }
                          >
                            {KDS_STATIONS.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => saveEdit(i.id)}
                          className="flex items-center gap-1"
                          style={{
                            border: 'none',
                            background: T.primary,
                            color: '#fff',
                            borderRadius: 7,
                            padding: '6px 10px',
                            fontSize: 11.5,
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          <Save size={12} /> Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="flex items-center gap-1"
                          style={{
                            border: `1px solid ${T.border}`,
                            background: T.surface,
                            color: T.inkSoft,
                            borderRadius: 7,
                            padding: '6px 10px',
                            fontSize: 11.5,
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          <XCircle size={12} /> Cancel
                        </button>
                        {editError && (
                          <span style={{ fontSize: 11, color: T.kumkum }}>{editError}</span>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            }

            return (
              <tr key={i.id} style={{ borderTop: `1px solid ${T.border}` }}>
                <td style={{ padding: '12px 18px', fontSize: 13.5 }}>{i.name}</td>
                <td
                  style={{
                    padding: '12px 18px',
                    fontFamily: FONT_MONO,
                    fontSize: 13,
                    color: T.inkSoft,
                  }}
                >
                  {i.unit}
                </td>
                <td style={{ padding: '12px 18px', fontFamily: FONT_MONO, fontSize: 13 }}>
                  {i.stock} {i.unit}
                </td>
                <td
                  style={{
                    padding: '12px 18px',
                    fontFamily: FONT_MONO,
                    fontSize: 13,
                    color: T.inkSoft,
                  }}
                >
                  {i.threshold} {i.unit}
                </td>
                <td style={{ padding: '12px 18px' }}>
                  {low ? (
                    <Pill bg={T.kumkumSoft} color={T.kumkum}>Reorder now</Pill>
                  ) : warn ? (
                    <Pill bg={T.amberSoft} color={T.amber}>Running low</Pill>
                  ) : (
                    <Pill bg={T.greenSoft} color={T.green}>Stocked</Pill>
                  )}
                </td>
                <td style={{ padding: '12px 18px' }}>
                  {i.sellable ? (
                    <Pill bg={T.greenSoft} color={T.green}>
                      ₹{i.sellingPrice} · {i.menuCategory || 'Beverages & Extras'}
                    </Pill>
                  ) : (
                    <Pill bg={T.surfaceSunk} color={T.inkSoft}>Not listed</Pill>
                  )}
                </td>
                <td style={{ padding: '12px 18px' }}>
                  {isPendingDelete ? (
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: 11.5, color: T.kumkum, fontWeight: 600 }}>
                        Delete "{i.name}"?
                      </span>
                      <button
                        onClick={() => confirmDelete(i.id)}
                        style={{
                          border: 'none',
                          background: T.kumkum,
                          color: '#fff',
                          borderRadius: 7,
                          padding: '5px 9px',
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setPendingDelete(null)}
                        style={{
                          border: `1px solid ${T.border}`,
                          background: T.surface,
                          color: T.inkSoft,
                          borderRadius: 7,
                          padding: '5px 9px',
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onRestock(i.id)}
                        style={{
                          border: `1px solid ${T.border}`,
                          background: T.surface,
                          borderRadius: 7,
                          padding: '5px 9px',
                          fontSize: 11.5,
                          cursor: 'pointer',
                          fontFamily: FONT_BODY,
                          fontWeight: 600,
                          color: T.primary,
                        }}
                      >
                        +10{i.unit}
                      </button>
                      <button
                        onClick={() => startEdit(i)}
                        title="Edit"
                        style={{
                          border: `1px solid ${T.border}`,
                          background: T.surface,
                          borderRadius: 7,
                          padding: '5px 7px',
                          cursor: 'pointer',
                          color: T.inkSoft,
                          display: 'flex',
                        }}
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => setPendingDelete(i.id)}
                        title="Delete"
                        style={{
                          border: `1px solid ${T.border}`,
                          background: T.surface,
                          borderRadius: 7,
                          padding: '5px 7px',
                          cursor: 'pointer',
                          color: T.kumkum,
                          display: 'flex',
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}

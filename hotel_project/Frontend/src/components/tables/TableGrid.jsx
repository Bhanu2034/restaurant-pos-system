import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Card from '../common/Card';
import { T, FONT_MONO } from '../../constants/theme';

/**
 * Floor plan grid — shows table buttons with status colors, plus an
 * "add table" tile and a per-tile delete control (only enabled for
 * empty tables — the backend also enforces this).
 */
export default function TableGrid({ tables, selectedId, onSelect, onAddTable, onDeleteTable }) {
  return (
    <Card style={{ padding: 16 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontFamily: FONT_MONO,
            color: T.inkSoft,
            letterSpacing: 1,
          }}
        >
          FLOOR
        </div>
        <button
          onClick={onAddTable}
          title="Add table"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            background: 'transparent',
            border: `1px solid ${T.border}`,
            borderRadius: 7,
            padding: '3px 7px',
            cursor: 'pointer',
            color: T.primary,
            fontSize: 11,
            fontFamily: FONT_MONO,
          }}
        >
          <Plus size={12} /> Add
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {tables.map((t) => {
          const active = selectedId === t.id;
          const isEmpty = t.status === 'empty';
          const color = isEmpty
            ? T.surfaceSunk
            : t.status === 'occupied'
            ? T.greenSoft
            : T.amberSoft;
          const textColor = isEmpty
            ? T.inkSoft
            : t.status === 'occupied'
            ? T.green
            : T.amber;

          return (
            <div
              key={t.id}
              style={{
                position: 'relative',
                background: color,
                border: active ? `2px solid ${T.primary}` : `1px solid ${T.border}`,
                borderRadius: 10,
              }}
            >
              <button
                onClick={() => onSelect(t)}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  padding: '12px 8px',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontFamily: FONT_MONO, fontWeight: 700 }}>{t.id}</div>
                <div style={{ fontSize: 10, color: textColor, marginTop: 2 }}>
                  {t.seats} seats &middot; {t.status}
                </div>
              </button>

              {isEmpty && onDeleteTable && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTable(t.id);
                  }}
                  title={`Delete ${t.id}`}
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: T.inkSoft,
                    padding: 2,
                    lineHeight: 0,
                  }}
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

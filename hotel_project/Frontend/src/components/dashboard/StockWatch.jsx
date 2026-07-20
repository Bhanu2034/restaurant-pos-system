import React from 'react';
import Card from '../common/Card';
import { T, FONT_DISPLAY, FONT_MONO } from '../../constants/theme';

/**
 * Stock watch — top-5 lowest stock items with bar chart on dashboard.
 */
export default function StockWatch({ inventory }) {
  const sorted = inventory
    .slice()
    .sort((a, b) => a.stock / a.threshold - b.stock / b.threshold)
    .slice(0, 5);

  return (
    <Card style={{ padding: 22 }}>
      <div
        style={{
          fontFamily: FONT_DISPLAY,
          fontSize: 17,
          fontWeight: 600,
          color: T.primaryDeep,
          marginBottom: 12,
        }}
      >
        Stock watch
      </div>
      <div className="flex flex-col gap-2.5">
        {sorted.map((i) => {
          const ratio = i.stock / i.threshold;
          const color = ratio <= 1 ? T.kumkum : ratio <= 1.5 ? T.amber : T.green;
          return (
            <div key={i.id} className="flex items-center gap-3">
              <div style={{ width: 130, fontSize: 12.5 }}>{i.name}</div>
              <div style={{ flex: 1, height: 6, background: T.surfaceSunk, borderRadius: 999 }}>
                <div
                  style={{
                    width: `${Math.min(100, ratio * 50)}%`,
                    height: '100%',
                    background: color,
                    borderRadius: 999,
                  }}
                />
              </div>
              <div
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 11.5,
                  width: 60,
                  textAlign: 'right',
                  color: T.inkSoft,
                }}
              >
                {i.stock}{i.unit}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

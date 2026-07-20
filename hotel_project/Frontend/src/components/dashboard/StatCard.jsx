import React from 'react';
import Card from '../common/Card';
import { T, FONT_MONO } from '../../constants/theme';

/**
 * Dashboard stat tile — shows a metric with icon and click-to-navigate.
 */
export default function StatCard({ label, value, icon: Icon, color, onClick }) {
  return (
    <Card style={{ padding: 20, cursor: 'pointer' }} className="hover:shadow-md">
      <div onClick={onClick}>
        <div className="flex items-center justify-between mb-3">
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: color + '1A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon size={17} color={color} />
          </div>
        </div>
        <div style={{ fontFamily: FONT_MONO, fontSize: 26, fontWeight: 700, color: T.ink }}>
          {value}
        </div>
        <div style={{ fontSize: 12.5, color: T.inkSoft, marginTop: 2 }}>{label}</div>
      </div>
    </Card>
  );
}

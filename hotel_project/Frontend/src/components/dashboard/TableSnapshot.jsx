import React from 'react';
import Card from '../common/Card';
import { T, FONT_DISPLAY, FONT_MONO } from '../../constants/theme';

/**
 * Table snapshot — mini grid showing table statuses on the dashboard.
 */
export default function TableSnapshot({ tables }) {
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
        Table snapshot
      </div>
      <div className="grid grid-cols-5 gap-2">
        {tables.map((t) => (
          <div
            key={t.id}
            style={{
              border: `1px solid ${T.border}`,
              borderRadius: 8,
              padding: '10px 6px',
              textAlign: 'center',
              background:
                t.status === 'empty'
                  ? T.surfaceSunk
                  : t.status === 'occupied'
                  ? T.greenSoft
                  : T.amberSoft,
            }}
          >
            <div style={{ fontFamily: FONT_MONO, fontWeight: 700, fontSize: 13 }}>{t.id}</div>
            <div
              style={{
                fontSize: 10,
                color: T.inkSoft,
                textTransform: 'capitalize',
                marginTop: 2,
              }}
            >
              {t.status}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

import React from 'react';
import { T, FONT_MONO, FONT_DISPLAY } from '../../constants/theme';

/**
 * Page/section title with optional eyebrow and right-side content.
 */
export default function SectionTitle({ eyebrow, title, right }) {
  return (
    <div className="flex items-end justify-between mb-4">
      <div>
        {eyebrow && (
          <div
            style={{
              fontFamily: FONT_MONO,
              fontSize: 11,
              letterSpacing: 1.5,
              color: T.gold,
              textTransform: 'uppercase',
              fontWeight: 700,
            }}
          >
            {eyebrow}
          </div>
        )}
        <h2
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 26,
            color: T.primaryDeep,
            fontWeight: 600,
            marginTop: 2,
          }}
        >
          {title}
        </h2>
      </div>
      {right}
    </div>
  );
}

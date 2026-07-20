import React from 'react';
import { Check, CircleDot, Clock } from 'lucide-react';
import { T, FONT_MONO, FONT_BODY } from '../../constants/theme';
import { elapsedMinutes } from '../../utils/formatters';
import Pill from './Pill';

/**
 * KOT Ticket — the signature visual element.
 * Styled like an actual torn kitchen ticket: perforated top edge,
 * monospace type, dashed rule.
 */
export default function Ticket({ kot, onMarkItem, onBump, compact }) {
  const allReady = kot.items.every((it) => it.done);
  const elapsedMin = elapsedMinutes(kot.createdAt);

  return (
    <div
      style={{
        background: '#FFFEFB',
        border: `1px solid ${T.border}`,
        borderRadius: 4,
        boxShadow: '0 2px 8px rgba(43,42,37,0.06)',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: FONT_MONO,
      }}
    >
      {/* Perforation */}
      <div
        style={{
          display: 'flex',
          gap: 6,
          padding: '6px 10px 0',
          overflow: 'hidden',
        }}
      >
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: T.bg,
              flexShrink: 0,
            }}
          />
        ))}
      </div>

      <div style={{ padding: '10px 14px 14px' }}>
        <div className="flex items-center justify-between">
          <div style={{ fontWeight: 700, fontSize: 14, color: T.primaryDeep }}>
            KOT #{kot.number}
          </div>
          <Pill
            bg={elapsedMin > 12 ? T.kumkumSoft : T.amberSoft}
            color={elapsedMin > 12 ? T.kumkum : T.amber}
          >
            <Clock size={10} style={{ display: 'inline', marginRight: 3, marginBottom: 1 }} />
            {elapsedMin}m
          </Pill>
        </div>

        <div style={{ fontSize: 11, color: T.inkSoft, marginTop: 1 }}>
          {kot.orderType === 'takeaway' ? 'TOKEN' : 'TABLE'} {kot.refId} &middot; {kot.station}
        </div>

        <div style={{ borderTop: `1px dashed ${T.border}`, margin: '8px 0' }} />

        <div className="flex flex-col gap-1.5">
          {kot.items.map((it, idx) => (
            <div
              key={idx}
              onClick={() => onMarkItem && onMarkItem(kot.id, idx)}
              className="flex items-center justify-between"
              style={{
                cursor: onMarkItem ? 'pointer' : 'default',
                opacity: it.done ? 0.4 : 1,
                fontSize: 13,
              }}
            >
              <span style={{ textDecoration: it.done ? 'line-through' : 'none' }}>
                {it.qty} &times; {it.name}
              </span>
              {it.done ? (
                <Check size={13} color={T.green} />
              ) : (
                onMarkItem && <CircleDot size={13} color={T.amber} />
              )}
            </div>
          ))}
        </div>

        {!compact && (
          <button
            disabled={!allReady}
            onClick={() => onBump && onBump(kot.id)}
            className="w-full mt-3"
            style={{
              background: allReady ? T.primary : T.surfaceSunk,
              color: allReady ? '#fff' : T.inkSoft,
              border: 'none',
              borderRadius: 6,
              padding: '8px 0',
              fontFamily: FONT_BODY,
              fontWeight: 600,
              fontSize: 12.5,
              cursor: allReady ? 'pointer' : 'not-allowed',
              letterSpacing: 0.3,
            }}
          >
            {allReady ? 'Bump to Served ✓' : 'Mark all items ready'}
          </button>
        )}
      </div>
    </div>
  );
}

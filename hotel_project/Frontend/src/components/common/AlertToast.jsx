import React from 'react';
import { Bell, X } from 'lucide-react';
import { T, FONT_MONO } from '../../constants/theme';
import { formatTime } from '../../utils/formatters';
import { useNotificationContext } from '../../context/NotificationContext';

/**
 * Alert toast stack — floats in top-right corner above all screens.
 * Shows "order ready" notifications for cashier/waiter.
 */
export default function AlertToast() {
  const { alerts, dismissAlert } = useNotificationContext();

  if (!alerts.length) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 18,
        right: 18,
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        width: 300,
      }}
    >
      {alerts.slice(0, 4).map((a) => (
        <div
          key={a.id}
          style={{
            background: T.primaryDeep,
            color: '#fff',
            borderRadius: 10,
            padding: '12px 14px',
            boxShadow: '0 8px 24px rgba(21,54,41,0.35)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              background: T.gold,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: 1,
            }}
          >
            <Bell size={14} color={T.primaryDeep} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, lineHeight: 1.35 }}>
              {a.message}
            </div>
            <div
              style={{
                fontSize: 10.5,
                color: 'rgba(255,255,255,0.6)',
                marginTop: 2,
                fontFamily: FONT_MONO,
              }}
            >
              {formatTime(a.time)}
            </div>
          </div>
          <button
            onClick={() => dismissAlert(a.id)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(255,255,255,0.7)',
              cursor: 'pointer',
              padding: 2,
            }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

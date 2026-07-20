import React, { useState } from 'react';
import { X } from 'lucide-react';
import { T, FONT_MONO, FONT_BODY, FONT_DISPLAY } from '../../constants/theme';

const inputStyle = {
  width: '100%',
  border: `1px solid ${T.border}`,
  borderRadius: 8,
  padding: '9px 10px',
  fontSize: 13,
  fontFamily: FONT_BODY,
  background: T.surface,
  color: T.ink,
  boxSizing: 'border-box',
};

const labelStyle = {
  fontSize: 10.5,
  fontFamily: FONT_MONO,
  letterSpacing: 0.5,
  color: T.inkSoft,
  marginBottom: 5,
  display: 'block',
  textTransform: 'uppercase',
};

/**
 * Modal for creating a new table. Matches the app's card/theme system —
 * there's no shared Modal component yet, so this owns its own overlay.
 */
export default function AddTableDialog({ onClose, onCreate }) {
  const [id, setId] = useState('');
  const [seats, setSeats] = useState(4);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id.trim()) {
      setError('Table ID is required.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await onCreate(id.trim(), Number(seats) || 2);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create table.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(43,42,37,0.45)',
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: 14,
          width: 320,
          padding: 20,
          boxShadow: '0 20px 50px rgba(21,54,41,0.25)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, color: T.primaryDeep, fontWeight: 600 }}>
            Add table
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: T.inkSoft, padding: 2 }}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Table ID</label>
            <input
              autoFocus
              style={inputStyle}
              placeholder="e.g. T4"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: 6 }}>
            <label style={labelStyle}>Seats</label>
            <input
              type="number"
              min={1}
              style={inputStyle}
              value={seats}
              onChange={(e) => setSeats(e.target.value)}
            />
          </div>

          {error && (
            <div style={{ fontSize: 12, color: T.kumkum, marginTop: 8 }}>{error}</div>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              marginTop: 16,
              background: T.primary,
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '10px 0',
              fontSize: 13,
              fontWeight: 600,
              fontFamily: FONT_BODY,
              cursor: submitting ? 'default' : 'pointer',
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? 'Adding…' : 'Add table'}
          </button>
        </form>
      </div>
    </div>
  );
}

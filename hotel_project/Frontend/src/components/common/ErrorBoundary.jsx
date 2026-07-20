import React from 'react';
import { T, FONT_DISPLAY, FONT_BODY } from '../../constants/theme';

/**
 * React Error Boundary — catches rendering errors and shows a fallback.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 40px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: T.kumkumSoft,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
              fontSize: 24,
            }}
          >
            ⚠️
          </div>
          <h2
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 22,
              fontWeight: 600,
              color: T.primaryDeep,
              marginBottom: 8,
            }}
          >
            Something went wrong
          </h2>
          <p style={{ fontSize: 13, color: T.inkSoft, fontFamily: FONT_BODY, maxWidth: 400 }}>
            An unexpected error occurred. Please refresh the page or try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: 20,
              background: T.primary,
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '10px 24px',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: FONT_BODY,
            }}
          >
            Reload page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

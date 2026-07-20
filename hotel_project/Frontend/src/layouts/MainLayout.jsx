import React from 'react';
import { Outlet } from 'react-router-dom';
import { T, FONT_BODY } from '../constants/theme';
import Sidebar from '../components/layout/Sidebar';
import AlertToast from '../components/common/AlertToast';
import ErrorBoundary from '../components/common/ErrorBoundary';

/**
 * Main layout — sidebar + content area with alert toasts.
 * Uses React Router's Outlet for page rendering.
 */
export default function MainLayout() {
  return (
    <div
      className="main-layout"
      style={{
        display: 'flex',
        background: T.bg,
        minHeight: '100vh',
        fontFamily: FONT_BODY,
        color: T.ink,
      }}
    >
      <AlertToast />
      <Sidebar />
      <div style={{ flex: 1, minWidth: 0 }}>
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </div>
    </div>
  );
}

import React from 'react';
import { RouterProvider } from 'react-router-dom';
import AppProvider from './context/AppProvider';
import ErrorBoundary from './components/common/ErrorBoundary';
import router from './routes/routes';

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </ErrorBoundary>
  );
}

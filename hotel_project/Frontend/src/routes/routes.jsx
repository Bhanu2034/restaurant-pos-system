import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import TablesPage from '../pages/Tables/TablesPage';
import TakeawayPage from '../pages/Takeaway/TakeawayPage';
import KitchenDisplayPage from '../pages/KitchenDisplay/KitchenDisplayPage';
import BillingPage from '../pages/Billing/BillingPage';
import InventoryPage from '../pages/Inventory/InventoryPage';
import MenuPage from '../pages/Menu/MenuPage';
import LoginPage from '../pages/Login/LoginPage';
import ProtectedRoute from '../components/common/ProtectedRoute';
import { ROUTES } from '../constants/constants';
import UnauthorizedPage from '../pages/Unauthorized/UnauthorizedPage';
const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/unauthorized',
    element: <UnauthorizedPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to={ROUTES.DASHBOARD} replace /> },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute permission="dashboard">
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'tables',
        element: (
          <ProtectedRoute permission="tables">
            <TablesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'takeaway',
        element: (
          <ProtectedRoute permission="takeaway">
            <TakeawayPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'kitchen',
        element: (
          <ProtectedRoute permission="kitchen">
            <KitchenDisplayPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "billing",
        element: (
          <ProtectedRoute permission="billing">
            <BillingPage />
          </ProtectedRoute>
        )
      },
      {
        path: 'inventory',
        element: (
          <ProtectedRoute permission="inventory">
            <InventoryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'menu',
        element: (
          <ProtectedRoute permission="menu">
            <MenuPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;

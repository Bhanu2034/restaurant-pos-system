import React from 'react';
import { TableProvider } from './TableContext';
import { OrderProvider } from './OrderContext';
import { KotProvider } from './KotContext';
import { TakeawayProvider } from './TakeawayContext';
import { InventoryProvider } from './InventoryContext';
import { NotificationProvider } from './NotificationContext';
import { BillingProvider } from './BillingContext';

import { AuthProvider } from './AuthContext';

/**
 * Composes all context providers into a single wrapper.
 * Order matters — inner providers can consume outer ones.
 */
export default function AppProvider({ children }) {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BillingProvider>
          <InventoryProvider>
            <TakeawayProvider>
              <KotProvider>
                <OrderProvider>
                  <TableProvider>
                    {children}
                  </TableProvider>
                </OrderProvider>
              </KotProvider>
            </TakeawayProvider>
          </InventoryProvider>
        </BillingProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

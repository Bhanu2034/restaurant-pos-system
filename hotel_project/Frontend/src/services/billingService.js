import apiClient from '../api/apiClient';

const billingService = {
  generateBill: async (tableId, lines, taxBreakdown) => {
    const response = await apiClient.post('/billing/generate', { tableId, lines, ...taxBreakdown });
    return response.data;
  },

  // FIX: Added billNumber back to the parameters and payload
  settleBill: async (billNumber, method, total) => {
    const response = await apiClient.post('/billing/settle', {
      billNumber: billNumber,
      paymentMethod: method,
      total: total
    });
    return response.data;
  },

  getSalesTotal: async () => {
    const response = await apiClient.get('/billing/sales/today');
    return response.data;
  },

  // Ask the backend whether this table's bill is currently allowed to be
  // closed (i.e. every KOT fired for it has been served by the kitchen).
  // This is a convenience check for the UI — the backend enforces the
  // same rule again on /generate and /settle regardless of what this
  // returns, so it can never be bypassed by skipping this call.
  canCloseBill: async (tableId) => {
    const response = await apiClient.get(`/billing/can-close/${tableId}`);
    return response.data;
  },
};

export default billingService;
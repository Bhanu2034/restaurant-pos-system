import apiClient from '../api/apiClient';

/**
 * Inventory service — handles stock management.
 */
const inventoryService = {
  getInventory: async () => {
    const response = await apiClient.get('/inventory');
    return response.data;
  },

  addItem: async (item) => {
    const response = await apiClient.post('/inventory', item);
    return response.data;
  },

  updateItem: async (id, updates) => {
    const response = await apiClient.put(`/inventory/${id}`, updates);
    return response.data;
  },

  deleteItem: async (id) => {
    const response = await apiClient.delete(`/inventory/${id}`);
    return response.data;
  },

  restock: async (id, amount) => {
    const response = await apiClient.put(`/inventory/${id}/restock`, { amount });
    return response.data;
  },
};

export default inventoryService;

import apiClient from '../api/apiClient';

/**
 * Table service — consumes generic REST APIs.
 */
const tableService = {
  getTables: async () => {
    const response = await apiClient.get('/tables');
    return response.data;
  },

  updateTableStatus: async (tableId, status) => {
    const response = await apiClient.put(`/tables/${tableId}`, { status });
    return response.data;
  },

  createTable: async (id, seats) => {
    const response = await apiClient.post('/tables', { id, seats });
    return response.data;
  },

  deleteTable: async (tableId) => {
    await apiClient.delete(`/tables/${tableId}`);
  },
};

export default tableService;

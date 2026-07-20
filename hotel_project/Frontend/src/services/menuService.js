import apiClient from "../api/apiClient";

const BASE_URL = "/menu";

const menuService = {

  async getAll() {
    const response = await apiClient.get(BASE_URL);
    return response.data;
  },

  async getById(id) {
    const response = await apiClient.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  async create(menuItem) {
    const response = await apiClient.post(BASE_URL, menuItem);
    return response.data;
  },

  async update(id, menuItem) {
    const response = await apiClient.put(`${BASE_URL}/${id}`, menuItem);
    return response.data;
  },

  async delete(id) {
    await apiClient.delete(`${BASE_URL}/${id}`);
  }

};

export default menuService;
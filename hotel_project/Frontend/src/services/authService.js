import apiClient from '../api/apiClient';

/**
 * Authentication Service
 * Communicates with the Spring Boot AuthController
 */
export const authService = {
  /**
   * Logs in a user and returns the token and user data.
   * @param {string} username 
   * @param {string} password 
   * @returns {Promise<Object>} { token, user }
   */
  login: async (username, password) => {
    try {
      // POST request to your Spring Boot AuthController endpoint
      const response = await apiClient.post('/auth/login', {
        username,
        password
      });

      // The backend returns an object containing the token and user details
      return response.data;
    } catch (error) {
      // Re-throw the error so your LoginPage can handle the 'Invalid credentials' message
      throw error;
    }
  },

  /**
   * Optional: Add a logout method if needed
   */
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  }
};
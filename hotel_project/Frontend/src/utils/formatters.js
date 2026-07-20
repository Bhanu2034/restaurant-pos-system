/**
 * Currency formatter for Indian Rupees.
 * @param {number} amount
 * @returns {string} e.g. "₹18,450"
 */
export const formatCurrency = (amount) => `₹${amount.toLocaleString('en-IN')}`;

/**
 * Format a timestamp to a short time string.
 * @param {number} timestamp - Unix timestamp in ms
 * @returns {string} e.g. "02:30 PM"
 */
export const formatTime = (timestamp) =>
  new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

/**
 * Calculate elapsed minutes from a timestamp to now.
 * @param {number} createdAt - Unix timestamp in ms
 * @returns {number}
 */
export const elapsedMinutes = (createdAt) =>
  Math.max(0, Math.round((Date.now() - createdAt) / 60000));

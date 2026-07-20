
import { GST_RATE } from '../constants/constants';

/**
 * Group draft order lines by kitchen station.
 * @param {Array} draftLines - Array of { ...menuItem, qty }
 * @returns {Object} e.g. { "Tawa Counter": [...], "Hot Kitchen": [...] }
 */
export const groupByStation = (draftLines) => {
  const byStation = {};
  draftLines.forEach((l) => {
    byStation[l.station] = byStation[l.station] || [];
    byStation[l.station].push(l);
  });
  return byStation;
};

/**
 * Calculate tax breakdown from subtotal.
 * @param {number} subtotal
 * @returns {{ cgst: number, sgst: number, total: number }}
 */
export const calculateTax = (subtotal) => {
  const cgst = Math.round(subtotal * GST_RATE);
  const sgst = Math.round(subtotal * GST_RATE);
  return { cgst, sgst, total: subtotal + cgst + sgst };
};

/**
 * Find a menu item by ID.
 * @param {string} itemId
 * @returns {Object|undefined}
 */

import { useMemo } from 'react';
import { GST_RATE } from '../constants/constants';

/**
 * Calculate tax breakdown from a subtotal.
 *
 * @param {number} subtotal
 * @returns {{ subtotal: number, cgst: number, sgst: number, total: number }}
 */
export default function useTaxCalculation(subtotal) {
  return useMemo(() => {
    const cgst = Math.round(subtotal * GST_RATE);
    const sgst = Math.round(subtotal * GST_RATE);
    return { subtotal, cgst, sgst, total: subtotal + cgst + sgst };
  }, [subtotal]);
}

/**
 
 * Each item has an id, name, category, price, veg flag, and kitchen station.
 */

/** Unique category names derived from MENU */
export const CATEGORIES = [...new Set(MENU.map((m) => m.cat))];

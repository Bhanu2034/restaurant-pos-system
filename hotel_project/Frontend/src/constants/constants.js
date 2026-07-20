/** Kitchen Display System stations */
export const KDS_STATIONS = ['Tiffin Counter', 'Tawa Counter', 'Hot Kitchen', 'Beverage Counter'];

/** GST rate (CGST + SGST each) */
export const GST_RATE = 0.025;

/** Amount to restock on quick-restock action */
export const RESTOCK_AMOUNT = 10;

/** Initial sales total for the day */
export const INITIAL_SALES = 18450;

/** Route paths */
export const ROUTES = {
  DASHBOARD: '/dashboard',
  TABLES: '/tables',
  TAKEAWAY: '/takeaway',
  KITCHEN: '/kitchen',
  BILLING: '/billing',
  INVENTORY: '/inventory',
  MENU: '/menu',
};

/** Table statuses */
export const TABLE_STATUS = {
  EMPTY: 'empty',
  OCCUPIED: 'occupied',
  BILLING: 'billing',
};

/** KOT statuses — must match the casing the backend stores (KotService always
 * uppercases these, e.g. bumpKot() calls newStatus.toUpperCase()). Using a
 * different casing here silently breaks every `status === KOT_STATUS.X`
 * check in KotContext/TakeawayPage. */
export const KOT_STATUS = {
  ACTIVE: 'ACTIVE',
  SERVED: 'SERVED',
};

/** Order types */
export const ORDER_TYPE = {
  DINE_IN: 'dine-in',
  TAKEAWAY: 'takeaway',
};

/** Payment methods */
export const PAYMENT_METHODS = ['Cash', 'UPI', 'Card'];

/**
 * Mutable counters for KOT numbers, bill numbers, and takeaway tokens.
 * In production these would come from the backend.
 * Using getter/incrementer pattern to keep mutation controlled.
 */
let kotCounter = 1000;
let billCounter = 4400;
let tokenCounter = 100;

export const getNextKotNumber = () => ++kotCounter;
export const getNextBillNumber = () => ++billCounter;
export const getNextTokenNumber = () => ++tokenCounter;

export const peekNextBillNumber = () => billCounter + 1;

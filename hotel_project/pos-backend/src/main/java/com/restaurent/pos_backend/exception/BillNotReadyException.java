package com.restaurent.pos_backend.exception;

/**
 * Thrown when a cashier tries to generate or settle a bill for a table that
 * still has one or more Kitchen Order Tickets that haven't been bumped
 * (served) by the kitchen yet.
 *
 * This is the server-side enforcement of the order lifecycle:
 *   Table Order Created -> KOT Fired -> Kitchen Preparing -> Chef Bumps
 *   Order (Served) -> Bill Can Be Closed
 *
 * It must be thrown from BillingService itself (not just checked in the
 * frontend) so that the rule can't be bypassed by calling the REST API
 * directly.
 */
public class BillNotReadyException extends RuntimeException {

    public BillNotReadyException(String message) {
        super(message);
    }
}

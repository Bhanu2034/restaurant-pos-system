package com.restaurent.pos_backend.exception;

public class KotNotFoundException extends RuntimeException {

    public KotNotFoundException(String kotId) {
        super("Kitchen Order Ticket not found with id : " + kotId);
    }
}
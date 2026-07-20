package com.restaurent.pos_backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "bills")
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="bill_number",unique=true,updatable=false)
    private Integer billNumber;

    // The dine-in table this bill was raised for. Required so we can
    // re-verify, at settlement time, that every KOT fired for this table
    // has actually been served by the kitchen (see BillingService).
    private String tableId;

    private String paymentMethod;

    private Double subtotal;

    private Double cgst;

    private Double sgst;

    private Double total;

    private String status;

    private Long createdAt;
}
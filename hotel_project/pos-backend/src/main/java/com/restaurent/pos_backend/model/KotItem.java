package com.restaurent.pos_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "kot_items")
@Data
public class KotItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Reference to menu item
    private Long menuItemId;

    // Snapshot data
    private String name;

    private Double price;

    private Integer qty;

    private String station;

    private String category;

    private Boolean isVeg;

    private Boolean done = false;

    @ManyToOne
    @JoinColumn(name = "kot_id")
    @JsonIgnore
    private KitchenOrderTicket kot;
}
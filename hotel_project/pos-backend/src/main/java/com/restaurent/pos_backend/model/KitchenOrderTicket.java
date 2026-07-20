package com.restaurent.pos_backend.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "kots")
@Data
public class KitchenOrderTicket {

    @Id
    private String id;

    private Integer number;

    private String orderType;

    private String refId;

    private String station;

    private String status = "ACTIVE";

    private Long createdAt;

    private Long updatedAt;

    private Double total;

    @OneToMany(
            mappedBy = "kot",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<KotItem> items = new ArrayList<>();
}
package com.restaurent.pos_backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "restaurant_tables")
@Data
public class RestaurantTable {
	
	@Id
	private String id;
	private Integer seats;
	private String status;
	
}

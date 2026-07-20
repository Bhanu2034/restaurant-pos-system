package com.restaurent.pos_backend.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
@Entity
@Table(name = "menu_items")
@Data
public class MenuItem {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String name;

	private Double price;

	private String category;

	private String station;

	private Boolean isVeg;

	// The ingredients (from Inventory) this dish consumes per order.
	// FetchType.EAGER because MenuService serializes menu items outside of a
	// transaction (getAllMenuItems has no @Transactional) — a LAZY collection
	// would throw on serialization instead of just being empty.
	@OneToMany(
			mappedBy = "menuItem",
			cascade = CascadeType.ALL,
			orphanRemoval = true,
			fetch = FetchType.EAGER
	)
	private List<RecipeItem> recipe = new ArrayList<>();

}

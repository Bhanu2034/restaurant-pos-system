package com.restaurent.pos_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.Data;

/**
 * One ingredient line inside a MenuItem's recipe — e.g. "Masala Dosa uses
 * 1 packet of Buttermilk per order". This is the actual link between the
 * Inventory module and the Menu module that was previously missing: the two
 * tables had zero relationship to each other.
 *
 * inventoryItemId is a plain reference (not a JPA @ManyToOne) on purpose —
 * it keeps this side of the JSON simple to send from the frontend, and
 * inventoryItemName/unit are snapshotted at save time so the UI can render
 * a recipe without an extra join, the same pattern KotItem already uses to
 * snapshot menu item data.
 */
@Entity
@Table(name = "recipe_items")
@Data
public class RecipeItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Which raw ingredient (InventoryItem.id) this line consumes
    private Long inventoryItemId;

    // Snapshot fields, resolved server-side from InventoryItem when saved
    private String inventoryItemName;

    private String unit;

    // How much of that ingredient a single order of the dish consumes
    private Double qtyPerOrder;

    @ManyToOne
    @JoinColumn(name = "menu_item_id")
    @JsonIgnore
    private MenuItem menuItem;
}

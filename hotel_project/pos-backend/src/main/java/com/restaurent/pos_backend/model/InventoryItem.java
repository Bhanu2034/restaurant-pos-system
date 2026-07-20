package com.restaurent.pos_backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "inventory_items")
@Data
public class InventoryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String name;

    private String category;

    private String unit;

    private Double stock;

    private Double threshold;

    private Double costPrice;

    private Long updatedAt;

    // --- Direct-sell (Menu) linkage -----------------------------------
    // Some inventory rows aren't cooking ingredients at all — they're
    // ready-to-sell items (Water Bottle, Soft Drinks, Buttermilk, Ice
    // Cream, Juice, packaged snacks, ...). Marking one of these as
    // `sellable` makes InventoryService automatically create/maintain a
    // matching MenuItem for it (see InventoryService#syncMenuListing), so
    // it shows up on the Table Order / Takeaway menus without ever having
    // to be entered twice. Selling it deducts this same inventory row
    // directly (via a self-referencing recipe line, reusing the existing
    // Menu -> Recipe -> Inventory deduction pipeline in KotService).

    /** Whether this item should also appear as an orderable Menu item. */
    private Boolean sellable = false;

    /** Price to charge when sold directly (required if sellable). */
    private Double sellingPrice;

    /** Menu category to file this item under, e.g. "Beverages". */
    private String menuCategory;

    /** KDS station this item's KOT should route to, e.g. "Beverage Counter". */
    private String station;

    /** The MenuItem row this inventory item is mirrored into, once sellable. */
    private Long linkedMenuItemId;
}
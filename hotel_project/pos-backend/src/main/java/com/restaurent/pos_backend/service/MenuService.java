package com.restaurent.pos_backend.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.restaurent.pos_backend.model.InventoryItem;
import com.restaurent.pos_backend.model.MenuItem;
import com.restaurent.pos_backend.model.RecipeItem;
import com.restaurent.pos_backend.repository.InventoryItemRepository;
import com.restaurent.pos_backend.repository.MenuItemRepository;

@Service
public class MenuService {

	private final MenuItemRepository menuItemRepository;
	private final InventoryItemRepository inventoryItemRepository;

	public MenuService(MenuItemRepository menuItemRepository, InventoryItemRepository inventoryItemRepository) {
		this.menuItemRepository = menuItemRepository;
		this.inventoryItemRepository = inventoryItemRepository;
	}
	
	public List<MenuItem> getAllMenuItems(){
		return menuItemRepository.findAll();
	}
	
	public MenuItem addMenuItem(MenuItem newItem) {
		List<RecipeItem> resolved = resolveRecipe(newItem.getRecipe(), newItem);
		newItem.setRecipe(resolved);
		return menuItemRepository.save(newItem);
	}
	public MenuItem updateMenuItem(Long id, MenuItem updated){

	    MenuItem existing = menuItemRepository.findById(id)
	            .orElseThrow(() -> new RuntimeException("Menu Item Not Found"));

	    existing.setName(updated.getName());
	    existing.setCategory(updated.getCategory());
	    existing.setPrice(updated.getPrice());
	    existing.setIsVeg(updated.getIsVeg());
	    existing.setStation(updated.getStation());

	    // Replace the recipe wholesale — orphanRemoval on the MenuItem side
	    // takes care of deleting lines that were removed.
	    existing.getRecipe().clear();
	    existing.getRecipe().addAll(resolveRecipe(updated.getRecipe(), existing));

	    return menuItemRepository.save(existing);

	}

	public void deleteMenuItem(Long id){

	    menuItemRepository.deleteById(id);

	}

	// Turns the recipe lines coming in from the frontend (just
	// {inventoryItemId, qtyPerOrder}) into fully-resolved RecipeItems,
	// snapshotting the ingredient's current name/unit and validating that
	// the referenced inventory item actually exists.
	private List<RecipeItem> resolveRecipe(List<RecipeItem> incoming, MenuItem parent) {

	    List<RecipeItem> resolved = new ArrayList<>();

	    if (incoming == null) {
	        return resolved;
	    }

	    for (RecipeItem line : incoming) {

	        if (line.getInventoryItemId() == null) {
	            throw new RuntimeException("Each recipe line must reference an inventory item");
	        }

	        InventoryItem inventoryItem = inventoryItemRepository.findById(line.getInventoryItemId())
	                .orElseThrow(() -> new RuntimeException(
	                        "Linked inventory item not found: " + line.getInventoryItemId()));

	        RecipeItem resolvedLine = new RecipeItem();
	        resolvedLine.setInventoryItemId(inventoryItem.getId());
	        resolvedLine.setInventoryItemName(inventoryItem.getName());
	        resolvedLine.setUnit(inventoryItem.getUnit());
	        resolvedLine.setQtyPerOrder(line.getQtyPerOrder() != null ? line.getQtyPerOrder() : 0.0);
	        resolvedLine.setMenuItem(parent);

	        resolved.add(resolvedLine);
	    }

	    return resolved;
	}
}

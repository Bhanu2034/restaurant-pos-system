package com.restaurent.pos_backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.restaurent.pos_backend.model.InventoryItem;
import com.restaurent.pos_backend.model.MenuItem;
import com.restaurent.pos_backend.model.RecipeItem;
import com.restaurent.pos_backend.repository.InventoryItemRepository;
import com.restaurent.pos_backend.repository.MenuItemRepository;

@Service
public class InventoryService {
	
	private final InventoryItemRepository inventoryRepository;
	private final MenuItemRepository menuItemRepository;

	public InventoryService(InventoryItemRepository inventoryRepository, MenuItemRepository menuItemRepository) {
		this.inventoryRepository = inventoryRepository;
		this.menuItemRepository = menuItemRepository;
	}
	
	// fetching all items present
	public List<InventoryItem> getAllInventory(){
		return inventoryRepository.findAll();
	}
	
	// Add a new item
	@Transactional
	public InventoryItem addItem(InventoryItem item) {

	    item.setUpdatedAt(System.currentTimeMillis());

	    if (item.getStock() == null) {
	        item.setStock(0.0);
	    }

	    if (item.getThreshold() == null) {
	        item.setThreshold(0.0);
	    }

	    InventoryItem saved = inventoryRepository.save(item);
	    syncMenuListing(saved);
	    return saved;
	}
	
	//update an existing item  like fixing typo error
	@Transactional
	public InventoryItem updateItem(Long id, InventoryItem updates) {

	    InventoryItem item = inventoryRepository.findById(id)
	            .orElseThrow(() -> new RuntimeException("Ingredient not found"));

	    item.setName(updates.getName());
	    item.setCategory(updates.getCategory());
	    item.setUnit(updates.getUnit());
	    item.setStock(updates.getStock());
	    item.setThreshold(updates.getThreshold());
	    item.setCostPrice(updates.getCostPrice());
	    item.setSellable(updates.getSellable());
	    item.setSellingPrice(updates.getSellingPrice());
	    item.setMenuCategory(updates.getMenuCategory());
	    item.setStation(updates.getStation());
	    item.setUpdatedAt(System.currentTimeMillis());

	    InventoryItem saved = inventoryRepository.save(item);
	    syncMenuListing(saved);
	    return saved;
	}
	
	// Delete an item
	@Transactional
	public void deleteItem(Long id) {
		inventoryRepository.findById(id).ifPresent(item -> {
			if (item.getLinkedMenuItemId() != null) {
				menuItemRepository.deleteById(item.getLinkedMenuItemId());
			}
		});
		inventoryRepository.deleteById(id);
	}

	// -----------------------------------------------------------------
	// Inventory <-> Menu linkage for directly sellable items (Water
	// Bottle, Soft Drinks, Buttermilk, Ice Cream, Juice, packaged food,
	// ...). Keeps a mirrored MenuItem in sync with the InventoryItem so
	// the same product never has to be created twice:
	//
	//  - sellable turned on  -> create (or update) a MenuItem for it
	//  - sellable turned off -> remove its MenuItem listing
	//  - name/price/category/station edited while sellable -> propagate
	//
	// The mirrored MenuItem's recipe is a single self-referencing line
	// ("this dish consumes 1 unit of itself per order"). That reuses the
	// exact same stock-check (MenuPicker's isAvailable) and stock-deduct
	// (KotService#deductRecipeStock, run when the KOT is bumped/served)
	// pipeline that already exists for cooked dishes — so out-of-stock
	// disabling and automatic stock deduction work for sellable items
	// with no separate code path to maintain.
	// -----------------------------------------------------------------
	private void syncMenuListing(InventoryItem item) {

		boolean sellable = Boolean.TRUE.equals(item.getSellable());

		if (!sellable) {
			if (item.getLinkedMenuItemId() != null) {
				menuItemRepository.deleteById(item.getLinkedMenuItemId());
				item.setLinkedMenuItemId(null);
				inventoryRepository.save(item);
			}
			return;
		}

		if (item.getSellingPrice() == null) {
			throw new RuntimeException("A selling price is required to list \"" + item.getName() + "\" on the menu.");
		}

		MenuItem menuItem;
		Optional<MenuItem> existing = item.getLinkedMenuItemId() != null
				? menuItemRepository.findById(item.getLinkedMenuItemId())
				: Optional.empty();

		menuItem = existing.orElseGet(MenuItem::new);

		menuItem.setName(item.getName());
		menuItem.setPrice(item.getSellingPrice());
		menuItem.setCategory(item.getMenuCategory() != null && !item.getMenuCategory().isBlank()
				? item.getMenuCategory()
				: "Beverages & Extras");
		menuItem.setStation(item.getStation() != null && !item.getStation().isBlank()
				? item.getStation()
				: "Beverage Counter");
		if (menuItem.getIsVeg() == null) {
			menuItem.setIsVeg(true);
		}

		RecipeItem selfLine = menuItem.getRecipe().stream()
				.filter(line -> item.getId().equals(line.getInventoryItemId()))
				.findFirst()
				.orElseGet(RecipeItem::new);

		selfLine.setInventoryItemId(item.getId());
		selfLine.setInventoryItemName(item.getName());
		selfLine.setUnit(item.getUnit());
		selfLine.setQtyPerOrder(1.0);
		selfLine.setMenuItem(menuItem);

		menuItem.getRecipe().clear();
		menuItem.getRecipe().add(selfLine);

		MenuItem savedMenuItem = menuItemRepository.save(menuItem);

		if (!savedMenuItem.getId().equals(item.getLinkedMenuItemId())) {
			item.setLinkedMenuItemId(savedMenuItem.getId());
			inventoryRepository.save(item);
		}
	}
	
	// ReStock Action
	public InventoryItem restockItem(Long id, Double amount) {

	    InventoryItem item = inventoryRepository.findById(id)
	            .orElseThrow(() -> new RuntimeException("Ingredient not found"));

	    item.setStock(item.getStock() + amount);
	    item.setUpdatedAt(System.currentTimeMillis());

	    return inventoryRepository.save(item);
	}
	
	//LowStock API
	public List<InventoryItem> getLowStockItems() {

	    return inventoryRepository.findAll()
	            .stream()
	            .filter(item -> item.getStock() <= item.getThreshold())
	            .toList();
	}
}

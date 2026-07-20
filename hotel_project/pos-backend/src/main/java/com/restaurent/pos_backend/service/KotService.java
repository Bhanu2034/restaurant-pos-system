package com.restaurent.pos_backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.restaurent.pos_backend.model.KitchenOrderTicket;
import com.restaurent.pos_backend.model.KotItem;
import com.restaurent.pos_backend.exception.KotNotFoundException;
import com.restaurent.pos_backend.model.InventoryItem;
import com.restaurent.pos_backend.model.MenuItem;
import com.restaurent.pos_backend.model.RecipeItem;
import com.restaurent.pos_backend.repository.InventoryItemRepository;
import com.restaurent.pos_backend.repository.KotRepository;
import com.restaurent.pos_backend.repository.MenuItemRepository;
import com.restaurent.pos_backend.websocket.KotEventPublisher;

@Service
public class KotService {
	private final KotEventPublisher eventPublisher;
	private final KotRepository kotRepository;
	private final InventoryItemRepository inventoryRepository;
	private final MenuItemRepository menuItemRepository;

	public KotService(KotRepository kotRepository, KotEventPublisher eventPublisher,
			InventoryItemRepository inventoryRepository, MenuItemRepository menuItemRepository) {

		this.kotRepository = kotRepository;
		this.eventPublisher = eventPublisher;
		this.inventoryRepository = inventoryRepository;
		this.menuItemRepository = menuItemRepository;
	}

	// Send a new ticket to the kitchen
	@Transactional
	public KitchenOrderTicket createKot(KitchenOrderTicket kot) {

	    long now = System.currentTimeMillis();

	    if (kot.getCreatedAt() == null) {
	        kot.setCreatedAt(now);
	    }

	    kot.setUpdatedAt(now);

	    // Default status
	    if (kot.getStatus() == null || kot.getStatus().isBlank()) {
	        kot.setStatus("ACTIVE");
	    }

	    // Set parent reference
	    if (kot.getItems() != null) {
	        kot.getItems().forEach(item -> item.setKot(kot));
	    }

	    // Calculate total
	    double total = 0.0;

	    if (kot.getItems() != null) {
	        for (KotItem item : kot.getItems()) {
	            if (item.getPrice() != null) {
	                total += item.getPrice() * item.getQty();
	            }
	        }
	    }

	    kot.setTotal(total);

	    KitchenOrderTicket savedKot = kotRepository.save(kot);

	    // Broadcast new KOT immediately
	    eventPublisher.publishKotUpdated(savedKot);

	    return savedKot;
	}

	// fetching active tickets for display system(KDS)
	public List<KitchenOrderTicket> getActiveKots() {
		return kotRepository.findByStatusIgnoreCase("ACTIVE");
	}

	// All KOTs ever fired for a table (dine-in orders store the table id in
	// "refId"). Used by Billing to check whether every ticket for that
	// table has been served.
	public List<KitchenOrderTicket> getKotsForTable(String tableId) {
		return kotRepository.findByRefId(tableId);
	}

	// Number of KOTs for this table that are NOT yet SERVED (i.e. still
	// ACTIVE / sitting in the kitchen queue). This is the single source of
	// truth both Billing and the frontend should use to decide whether the
	// "Close Bill" action is allowed.
	public long countPendingKotsForTable(String tableId) {
		return kotRepository.countByRefIdAndStatusNotIgnoreCase(tableId, "SERVED");
	}

	// for marking served(Bump)
	@Transactional
	public KitchenOrderTicket bumpKot(String kotId, String newStatus) {
		KitchenOrderTicket kot = kotRepository.findById(kotId).orElseThrow(() -> new KotNotFoundException(kotId));
		kot.setStatus(newStatus.toUpperCase());
		kot.setUpdatedAt(System.currentTimeMillis());

		// ISSUE 2 FIX (revised): Deduct inventory via each dish's linked
		// recipe when a KOT is served, instead of matching the dish name
		// directly against inventory item names. A dish like "Masala Dosa"
		// isn't itself an inventory row — it's made of several ingredients
		// (batter, oil, chutney, ...), so name-matching could only ever
		// work by coincidence. This uses the real Menu -> Recipe -> Inventory
		// link set up in MenuService.
		if ("SERVED".equalsIgnoreCase(newStatus)) {
			for (KotItem item : kot.getItems()) {
				deductRecipeStock(item);
			}
		}

		KitchenOrderTicket savedKot = kotRepository.save(kot);

		// broadcast the "update" to all clients
		// this tells the frontend : " this specific KOT status has changed"
		eventPublisher.publishKotUpdated(savedKot);
		return savedKot;
	}

	// Walks the dish's recipe (set up via Menu Management) and deducts each
	// linked ingredient by qtyPerOrder * quantity ordered, floored at 0.
	private void deductRecipeStock(KotItem item) {

		if (item.getMenuItemId() == null) {
			return;
		}

		Optional<MenuItem> menuItemOpt = menuItemRepository.findById(item.getMenuItemId());

		if (menuItemOpt.isEmpty()) {
			return;
		}

		for (RecipeItem line : menuItemOpt.get().getRecipe()) {

			Optional<InventoryItem> inventoryOpt = inventoryRepository.findById(line.getInventoryItemId());

			if (inventoryOpt.isEmpty()) {
				continue;
			}

			InventoryItem invItem = inventoryOpt.get();

			double qtyPerOrder = line.getQtyPerOrder() != null ? line.getQtyPerOrder() : 0.0;
			double used = qtyPerOrder * item.getQty();
			double newStock = Math.max(0.0, invItem.getStock() - used);

			invItem.setStock(newStock);
			inventoryRepository.save(invItem);
		}
	}
}
package com.restaurent.pos_backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.restaurent.pos_backend.model.InventoryItem;
import com.restaurent.pos_backend.service.InventoryService;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {
	
	private final InventoryService inventoryService;
	
	
	public InventoryController(InventoryService inventoryService) {
		this.inventoryService = inventoryService;
	}
	
	@GetMapping
	public List<InventoryItem> getInventory(){
		
		return inventoryService.getAllInventory();
		
	}
	
	@PostMapping
	public InventoryItem addItem(@RequestBody InventoryItem item) {
		return inventoryService.addItem(item);
	}
	
	@PutMapping("/{id}")
	public InventoryItem updateItem(@PathVariable Long id, @RequestBody InventoryItem updates) {
		return inventoryService.updateItem(id, updates);
	}
	
	@DeleteMapping("/{id}")
	public void deleteItem(@PathVariable Long id) {
		inventoryService.deleteItem(id);
	}
	
	@PutMapping("/{id}/restock")
	public InventoryItem restock(@PathVariable Long id, @RequestBody Map<String, Double> request) {
		
		Double amount = request.get("amount");
		return inventoryService.restockItem(id, amount);
	}
	
	@GetMapping("/low-stock")
	public List<InventoryItem> getLowStockItems() {
	    return inventoryService.getLowStockItems();
	}
	
}

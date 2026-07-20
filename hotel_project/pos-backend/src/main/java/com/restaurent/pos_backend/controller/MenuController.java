package com.restaurent.pos_backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.restaurent.pos_backend.model.MenuItem;
import com.restaurent.pos_backend.service.MenuService;

@RestController
@RequestMapping("/api/menu")
public class MenuController {
	
	private final MenuService menuService;
	
	public MenuController(MenuService menuService) {
		this.menuService = menuService;
	}
	
	@GetMapping
	public List<MenuItem> getMenu(){
		return menuService.getAllMenuItems();
	}
	@PostMapping
	public MenuItem createMenuItem(@RequestBody MenuItem newItem) {
		return menuService.addMenuItem(newItem);
	}
	@PutMapping("/{id}")
	public ResponseEntity<MenuItem> updateMenuItem(
	        @PathVariable Long id,
	        @RequestBody MenuItem menuItem){

	    return ResponseEntity.ok(menuService.updateMenuItem(id, menuItem));

	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteMenuItem(
	        @PathVariable Long id){

	    menuService.deleteMenuItem(id);

	    return ResponseEntity.noContent().build();

	}
}

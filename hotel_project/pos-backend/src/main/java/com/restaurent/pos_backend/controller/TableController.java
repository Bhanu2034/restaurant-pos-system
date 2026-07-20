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

import com.restaurent.pos_backend.model.RestaurantTable;
import com.restaurent.pos_backend.service.TableService;

@RestController
@RequestMapping("/api/tables")
public class TableController {

	
	private final TableService tableService;
	
	
	public TableController(TableService tableService) {
		this.tableService = tableService;
	}
	
	@GetMapping
	public List<RestaurantTable> getTables(){
		return tableService.getAllTables();
	}
	
	
	@PutMapping("/{id}")
	public RestaurantTable updateStatus(@PathVariable String id,@RequestBody Map<String, String> request) {
		String newStatus = request.get("status");
		return tableService.updateTableStatus(id, newStatus);
	}

	@PostMapping
	public RestaurantTable createTable(@RequestBody Map<String, Object> request) {
		String id = (String) request.get("id");
		Object seatsRaw = request.get("seats");
		Integer seats = seatsRaw != null ? Integer.valueOf(seatsRaw.toString()) : null;
		return tableService.createTable(id, seats);
	}

	@DeleteMapping("/{id}")
	public void deleteTable(@PathVariable String id) {
		tableService.deleteTable(id);
	}
}

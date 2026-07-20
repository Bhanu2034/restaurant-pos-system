package com.restaurent.pos_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.restaurent.pos_backend.model.RestaurantTable;
import com.restaurent.pos_backend.repository.RestaurantTableRepository;

@Service
public class TableService {
	private final RestaurantTableRepository tableRepository;
	
	public TableService(RestaurantTableRepository tableRepository) {
		this.tableRepository = tableRepository;
	}
	
	public List<RestaurantTable> getAllTables(){
		return tableRepository.findAll();
	}
	
	public RestaurantTable updateTableStatus(String tableId, String newStatus) {
		RestaurantTable table = tableRepository.findById(tableId)
				                .orElseThrow(() -> new RuntimeException("Table not found!"));
				
				table.setStatus(newStatus);
				return tableRepository.save(table);
	}

	public RestaurantTable createTable(String id, Integer seats) {
		if (id == null || id.isBlank()) {
			throw new RuntimeException("Table ID is required!");
		}
		if (tableRepository.existsById(id)) {
			throw new RuntimeException("Table " + id + " already exists!");
		}

		RestaurantTable table = new RestaurantTable();
		table.setId(id);
		table.setSeats(seats != null ? seats : 2);
		table.setStatus("empty");
		return tableRepository.save(table);
	}

	public void deleteTable(String tableId) {
		RestaurantTable table = tableRepository.findById(tableId)
				.orElseThrow(() -> new RuntimeException("Table not found!"));

		if (!"empty".equalsIgnoreCase(table.getStatus())) {
			throw new RuntimeException("Cannot delete table " + tableId + " — it is not empty!");
		}

		tableRepository.deleteById(tableId);
	}
}

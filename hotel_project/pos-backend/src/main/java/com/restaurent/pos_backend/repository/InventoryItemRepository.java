package com.restaurent.pos_backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.restaurent.pos_backend.model.InventoryItem;

@Repository
public interface InventoryItemRepository extends JpaRepository<InventoryItem, Long>{

	
	Optional<InventoryItem> findByName(String name);
	
	List<InventoryItem> findByStockLessThanEqual(Double stock);
}

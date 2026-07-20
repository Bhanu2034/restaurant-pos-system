package com.restaurent.pos_backend.repository;

import org.springframework.stereotype.Repository;
import com.restaurent.pos_backend.model.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long>{
	
}



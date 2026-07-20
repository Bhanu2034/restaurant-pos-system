package com.restaurent.pos_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.restaurent.pos_backend.model.KitchenOrderTicket;

@Repository
public interface KotRepository extends JpaRepository<KitchenOrderTicket, String>{
		
	
	//Spring sees "findByStatus" and automatically generates:
	// select * from kots where status=?
	List<KitchenOrderTicket> findByStatusIgnoreCase(String status);

	// Every KOT ever fired for a given table (refId holds the table id for
	// dine-in orders). Used to check whether it's safe to close a table's
	// bill: every KOT returned here must be SERVED before billing can close.
	List<KitchenOrderTicket> findByRefId(String refId);

	// Count of KOTs for a table that are NOT yet served, ignoring case
	// differences ("Active" vs "ACTIVE" etc). If this is > 0 the bill for
	// that table must not be allowed to close.
	long countByRefIdAndStatusNotIgnoreCase(String refId, String status);

}

package com.restaurent.pos_backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.restaurent.pos_backend.model.KitchenOrderTicket;
import com.restaurent.pos_backend.service.KotService;

@RestController
@RequestMapping("/api/kots")
public class KotController {

	private final KotService kotService;
	
	public KotController(KotService kotService) {
		this.kotService = kotService;
	}
	
	//get the active orders in kds
	@GetMapping("/active")
	public List<KitchenOrderTicket> getActiveKots(){
		return kotService.getActiveKots();
	}

	// All KOTs (any status) ever fired for a table — dine-in orders use the
	// table id as the KOT's refId. Lets the billing screen show exactly
	// which tickets are still pending for a given table.
	@GetMapping("/table/{tableId}")
	public List<KitchenOrderTicket> getKotsForTable(@PathVariable String tableId) {
		return kotService.getKotsForTable(tableId);
	}
	
	//for creating the kotswhen the cashier fire the kot
	@PostMapping
	public KitchenOrderTicket createKot(@RequestBody KitchenOrderTicket kot) {
		return kotService.createKot(kot);
	}
	
	//for updating like clearing the served tickets
	@PutMapping("/{id}/status")
	public ResponseEntity<KitchenOrderTicket> bumpKot(@PathVariable String id,@RequestBody Map<String, String> payload) {
		String status = payload.get("status");
		KitchenOrderTicket updatedKot = kotService.bumpKot(id, status);
		return ResponseEntity.ok(updatedKot);
	}
}

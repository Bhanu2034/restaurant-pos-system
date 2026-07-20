package com.restaurent.pos_backend.controller;

import com.restaurent.pos_backend.model.Bill;
import com.restaurent.pos_backend.service.BillingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/billing")
public class BillingController {

	@Autowired
	private BillingService billingService;

	@PostMapping("/generate")
	public Bill generateBill(@RequestBody Map<String, Object> payload) {

		Bill bill = new Bill();

		// 'tableId' is REQUIRED now: BillingService uses it to verify every
		// KOT fired for this table has been served before a bill can even
		// be generated. ('lines' is still ignored — it's only used
		// client-side to render the receipt; the server recalculates
		// nothing from it.)
		String tableId = payload.get("tableId") != null ? payload.get("tableId").toString() : null;

		if (payload.get("subtotal") != null) {
			bill.setSubtotal(Double.valueOf(payload.get("subtotal").toString()));
		}
		if (payload.get("total") != null) {
			bill.setTotal(Double.valueOf(payload.get("total").toString()));
		}
		if (payload.get("cgst") != null) {
			bill.setCgst(Double.valueOf(payload.get("cgst").toString()));
		}
		if (payload.get("sgst") != null) {
			bill.setSgst(Double.valueOf(payload.get("sgst").toString()));
		}
		return billingService.generateBill(tableId, bill);
	}

	// Lets the frontend check — before the cashier even tries to pay —
	// whether a table's bill is allowed to be closed yet. Purely
	// informational: the real enforcement lives in BillingService and
	// fires regardless of what this endpoint says.
	@GetMapping("/can-close/{tableId}")
	public Map<String, Object> canCloseBill(@PathVariable String tableId) {
		long pending = billingService.getPendingKotCount(tableId);
		return Map.of(
				"tableId", tableId,
				"canClose", pending == 0,
				"pendingKots", pending
		);
	}

	@PostMapping("/settle")
	public Bill settleBill(@RequestBody Map<String, Object> payload) {
		// Extracts the exact fields sent by billingService.js
		Integer billNumber = Integer.valueOf(payload.get("billNumber").toString());
		String paymentMethod = (String) payload.get("paymentMethod");
		Double total = Double.valueOf(payload.get("total").toString());

		return billingService.settleBill(billNumber, paymentMethod, total);
	}

	@GetMapping("/sales/today")
	public Double getTodaySales() {
		return billingService.getTodaySales();
	}
}
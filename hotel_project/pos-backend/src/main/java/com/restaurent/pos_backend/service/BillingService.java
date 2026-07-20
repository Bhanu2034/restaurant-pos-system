package com.restaurent.pos_backend.service;

import org.springframework.stereotype.Service;

import com.restaurent.pos_backend.exception.BillNotReadyException;
import com.restaurent.pos_backend.model.Bill;
import com.restaurent.pos_backend.repository.BillRepository;

@Service
public class BillingService {
	
	private final BillRepository billRepository;
	private final KotService kotService;
	
	public BillingService(BillRepository billRepository, KotService kotService) {
		this.billRepository = billRepository;
		this.kotService = kotService;
	}
	
	// Generate the bill (but don't mark it paid yet) dining.
	// tableId is required for dine-in bills so we can verify every KOT
	// fired for that table has actually been served by the kitchen before
	// a bill is even generated for it.
	public Bill generateBill(String tableId, Bill newBill) {

		assertKotsCompleted(tableId);

		Integer maxBill = billRepository.findMaxBillNumber();
		
		// Prevent NPE by setting a starting number if the database is empty
		Integer nextNumber = (maxBill != null) ? maxBill + 1 : 4401;
		
		newBill.setBillNumber(nextNumber);
		newBill.setTableId(tableId);
		newBill.setCreatedAt(System.currentTimeMillis());
		newBill.setStatus("UNPAID");
		
		return billRepository.save(newBill);
	}
	
	// Settle the bill (customer hands over cash/card) — i.e. "Close Bill".
	// Re-validates KOT completion here too (not just at generate time)
	// because a new item could theoretically be fired to the same table
	// between generate and settle, and because this is the actual action
	// that closes the bill, so it's the last line of defense against the
	// rule being bypassed.
	public Bill settleBill(Integer billNumber, String method, Double total) {
		Bill bill = billRepository.findByBillNumber(billNumber);
		
		if(bill == null) {
			throw new RuntimeException("Bill not found!");
		}

		assertKotsCompleted(bill.getTableId());
		
		// Ensure the paid amount matches (Basic security check)
		if(!bill.getTotal().equals(total)) {
			throw new RuntimeException("Payment total does not match bill total!");
		}
		
		bill.setPaymentMethod(method);
		bill.setStatus("SETTLED");
		
		return billRepository.save(bill);
	}

	// Returns whether a table's bill is currently allowed to be closed —
	// i.e. every KOT fired for that table has been served. Exposed so the
	// frontend can poll/check this before showing the "Close Bill" action.
	public boolean canCloseBill(String tableId) {
		return getPendingKotCount(tableId) == 0;
	}

	public long getPendingKotCount(String tableId) {
		if (tableId == null || tableId.isBlank()) {
			return 0;
		}
		return kotService.countPendingKotsForTable(tableId);
	}

	// Throws if the given table still has any KOT that hasn't been served
	// by the kitchen yet. This is the actual enforcement point — everything
	// else (frontend button state, canCloseBill()) exists only to give the
	// cashier a nicer experience around this same rule.
	private void assertKotsCompleted(String tableId) {
		if (tableId == null || tableId.isBlank()) {
			throw new BillNotReadyException(
					"A table must be specified to generate or close a bill.");
		}

		long pending = kotService.countPendingKotsForTable(tableId);

		if (pending > 0) {
			throw new BillNotReadyException(
					"Cannot close the bill until all KOT items have been completed by the kitchen.");
		}
	}
	
	// Get total sales for the Dashboard
	public Double getTodaySales() {
		// UPDATED: Now perfectly matches your repository method name
		Double totalSales = billRepository.sumTotalSales();
		
		// Prevent NPE by returning 0.0 if there are no sales yet
		return (totalSales != null) ? totalSales : 0.0;
	}
}
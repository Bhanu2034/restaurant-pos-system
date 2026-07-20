package com.restaurent.pos_backend.repository;

import com.restaurent.pos_backend.model.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {
    
    // ADDED: Required to find the specific bill during settlement
    Bill findByBillNumber(Integer billNumber);

    @Query("SELECT MAX(b.billNumber) FROM Bill b")
    Integer findMaxBillNumber();

    @Query("SELECT SUM(b.total) FROM Bill b WHERE b.status = 'SETTLED'")
    Double sumTotalSales();
}
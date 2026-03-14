package com.karan.controller;

import com.karan.model.Finance;
import com.karan.service.FinanceService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/finance")
public class FinanceController {

    @Autowired
    private FinanceService financeService;

    @PostMapping
    public Finance addRecord(@RequestBody Finance finance) {
        return financeService.addRecord(finance);
    }

    @GetMapping
    public List<Finance> getAllRecords() {
        return financeService.getAllRecords();
    }

    @PutMapping("/{id}")
    public Finance updateRecord(@PathVariable Long id,
                                @RequestBody Finance finance) {
        return financeService.updateRecord(id, finance);
    }

    @DeleteMapping("/{id}")
    public String deleteRecord(@PathVariable Long id) {
        financeService.deleteRecord(id);
        return "Record deleted successfully";
    }
}
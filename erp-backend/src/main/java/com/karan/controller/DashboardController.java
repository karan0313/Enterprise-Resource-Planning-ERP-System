package com.karan.controller;

import com.karan.repository.*;
import com.karan.model.Finance;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private LeaveRepository leaveRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private FinanceRepository financeRepository;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public Map<String, Object> getDashboardStats() {   // ← missing { fixed

        Map<String, Object> dashboard = new HashMap<>();

        long employees = employeeRepository.count();
        long departments = departmentRepository.count();
        long attendance = attendanceRepository.count();
        long leaves = leaveRepository.count();
        long inventory = inventoryRepository.count();

        double totalSales = saleRepository.findAll()
                .stream()
                .mapToDouble(s -> s.getTotalAmount())
                .sum();

        double totalIncome = financeRepository.findAll()
                .stream()
                .filter(f -> f.getType().equalsIgnoreCase("INCOME"))
                .mapToDouble(Finance::getAmount)
                .sum();

        double totalExpense = financeRepository.findAll()
                .stream()
                .filter(f -> f.getType().equalsIgnoreCase("EXPENSE"))
                .mapToDouble(Finance::getAmount)
                .sum();

        double profit = totalIncome - totalExpense;

        dashboard.put("employees", employees);
        dashboard.put("departments", departments);
        dashboard.put("attendance", attendance);
        dashboard.put("leaves", leaves);
        dashboard.put("inventoryItems", inventory);
        dashboard.put("totalSales", totalSales);
        dashboard.put("totalIncome", totalIncome);
        dashboard.put("totalExpense", totalExpense);
        dashboard.put("profit", profit);

        return dashboard;
    }
}
package com.karan.controller;

import com.karan.exception.ResourceNotFoundException;
import com.karan.model.Employee;
import com.karan.repository.EmployeeRepository;
import com.karan.service.EmployeeService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private EmployeeRepository employeeRepository;

    // =================== Admin/HR Endpoints ===================

    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    @PostMapping
    public Employee create(@RequestBody Employee employee) {
        return employeeService.createEmployee(employee);
    }

    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    @PutMapping("/{id}")
    public Employee update(@PathVariable Long id,
                           @RequestBody Employee employee) {
        return employeeService.updateEmployee(id, employee);
    }

    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return "Employee deactivated successfully";
    }

    // GET ALL EMPLOYEES
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    @GetMapping
    public Page<Employee> getAll(Pageable pageable) {
        return employeeService.getAllEmployees(pageable);
    }

    // GET EMPLOYEE BY ID
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    @GetMapping("/{id}")
    public Employee getEmployeeById(@PathVariable Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Employee not found with id " + id));
    }

    // SEARCH EMPLOYEE
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    @GetMapping("/search")
    public Page<Employee> search(@RequestParam String name,
                                 Pageable pageable) {
        return employeeService.searchByName(name, pageable);
    }

    // =================== Employee Self-Access ===================

    // GET MY PROFILE
    @GetMapping("/me")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public Employee getMyProfile(Authentication auth) {

        String email = auth.getName(); // email from JWT

        return employeeRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Employee not found"));
    }

    // UPDATE MY PROFILE
    @PutMapping("/me")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public Employee updateMyProfile(Authentication auth,
                                    @RequestBody Employee updated) {

        String email = auth.getName();

        Employee employee = employeeRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Employee not found"));

        employee.setPhone(updated.getPhone());
        employee.setSalary(updated.getSalary());

        return employeeRepository.save(employee);
    }
}
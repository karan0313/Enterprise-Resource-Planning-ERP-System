package com.karan.controller;

import com.karan.model.Department;
import com.karan.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    @Autowired
    private DepartmentRepository departmentRepository;

    // Create Department
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Department create(@RequestBody Department department) {
        return departmentRepository.save(department);
    }

    // Get All Departments
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    @GetMapping
    public List<Department> getAll() {
        return departmentRepository.findAll();
    }
}
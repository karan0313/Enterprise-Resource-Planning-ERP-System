package com.karan.service.impl;

import com.karan.model.Employee;
import com.karan.model.Role;
import com.karan.model.User;
import com.karan.repository.EmployeeRepository;
import com.karan.repository.RoleRepository;
import com.karan.repository.UserRepository;
import com.karan.service.EmployeeService;
import com.karan.exception.ResourceNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // CREATE EMPLOYEE + AUTO CREATE LOGIN ACCOUNT
    @Override
    public Employee createEmployee(Employee employee) {

        // Get EMPLOYEE role
        Role employeeRole = roleRepository.findByName("EMPLOYEE")
                .orElseThrow(() ->
                        new ResourceNotFoundException("EMPLOYEE role not found"));

        // Create login user
        User user = new User();
        user.setUsername(employee.getName());
        user.setEmail(employee.getEmail());
        user.setPassword(passwordEncoder.encode("123456")); // default password
        user.setRoles(Set.of(employeeRole));

        userRepository.save(user);

        // Link user to employee
        employee.setUser(user);

        return employeeRepository.save(employee);
    }

    // UPDATE EMPLOYEE
    @Override
    public Employee updateEmployee(Long id, Employee employee) {

        Employee existing = employeeRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Employee not found with id " + id));

        existing.setName(employee.getName());
        existing.setEmail(employee.getEmail());
        existing.setPhone(employee.getPhone());
        existing.setSalary(employee.getSalary());
        existing.setDepartment(employee.getDepartment());

        return employeeRepository.save(existing);
    }

    // DELETE EMPLOYEE (SOFT DELETE)
    @Override
    public void deleteEmployee(Long id) {

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Employee not found with id " + id));

        employee.setActive(false); // soft delete
        employeeRepository.save(employee);
    }

    // GET ALL EMPLOYEES (ONLY ACTIVE)
    @Override
    public Page<Employee> getAllEmployees(Pageable pageable) {
        return employeeRepository.findByActiveTrue(pageable);
    }

    // SEARCH EMPLOYEE BY NAME
    @Override
    public Page<Employee> searchByName(String name, Pageable pageable) {
        return employeeRepository
                .findByNameContainingIgnoreCaseAndActiveTrue(name, pageable);
    }
}
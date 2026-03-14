package com.karan.service;

import com.karan.model.Employee;
import org.springframework.data.domain.*;

public interface EmployeeService {

    Employee createEmployee(Employee employee);

    Employee updateEmployee(Long id, Employee employee);

    void deleteEmployee(Long id);

    Page<Employee> getAllEmployees(Pageable pageable);

    Page<Employee> searchByName(String name, Pageable pageable);
}
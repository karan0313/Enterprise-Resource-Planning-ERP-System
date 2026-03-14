package com.karan.repository;

import com.karan.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.*;

import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    Page<Employee> findByActiveTrue(Pageable pageable);

    Page<Employee> findByNameContainingIgnoreCase(String name, Pageable pageable);

    // ✅ Add this method to fix your error
    Page<Employee> findByNameContainingIgnoreCaseAndActiveTrue(String name, Pageable pageable);

    Optional<Employee> findByEmail(String email);
}
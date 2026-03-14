package com.karan.repository;

import com.karan.model.Leave;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface LeaveRepository extends JpaRepository<Leave, Long> {

    @Query("SELECT l FROM Leave l WHERE l.employee.email = :email")
    List<Leave> findByEmployeeEmail(@Param("email") String email);
}
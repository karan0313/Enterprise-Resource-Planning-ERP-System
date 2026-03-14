package com.karan.service.impl;

import com.karan.model.Employee;
import com.karan.model.Leave;
import com.karan.repository.EmployeeRepository;
import com.karan.repository.LeaveRepository;
import com.karan.service.LeaveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class LeaveServiceImpl implements LeaveService {

    @Override
    public List<Leave> getAllLeaves() {
        return leaveRepository.findAll();
    }

    @Autowired
    private LeaveRepository leaveRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Override
    public Leave applyLeave(String email, Leave leave) {

        Employee employee = employeeRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        leave.setEmployee(employee);
        leave.setStatus("PENDING");

        return leaveRepository.save(leave);
    }

    @Override
    public List<Leave> getMyLeaves(String email) {
        return leaveRepository.findByEmployeeEmail(email);
    }

    @Override
    public Leave approveLeave(Long id) {

        Leave leave = leaveRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave not found"));

        leave.setStatus("APPROVED");

        return leaveRepository.save(leave);
    }

    @Override
    public Leave rejectLeave(Long id) {

        Leave leave = leaveRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave not found"));

        leave.setStatus("REJECTED");

        return leaveRepository.save(leave);
    }
}
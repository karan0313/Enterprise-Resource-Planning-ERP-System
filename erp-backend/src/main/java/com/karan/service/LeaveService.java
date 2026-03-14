package com.karan.service;

import com.karan.model.Leave;
import java.util.List;

public interface LeaveService {

    Leave applyLeave(String email, Leave leave);

    List<Leave> getAllLeaves();

    List<Leave> getMyLeaves(String email);

    Leave approveLeave(Long id);

    Leave rejectLeave(Long id);
}
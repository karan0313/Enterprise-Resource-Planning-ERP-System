package com.karan.controller;

import com.karan.model.Leave;
import com.karan.service.LeaveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
public class LeaveController {

    @Autowired
    private LeaveService leaveService;

    // Employee apply leave
    @PostMapping("/apply")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public Leave applyLeave(Authentication auth, @RequestBody Leave leave) {
        return leaveService.applyLeave(auth.getName(), leave);
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    public List<Leave> allLeaves() {
        return leaveService.getAllLeaves();
    }

    // Employee view their leaves
    @GetMapping("/my")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public List<Leave> myLeaves(Authentication auth) {
        return leaveService.getMyLeaves(auth.getName());
    }

    // Admin approve leave
    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    public Leave approve(@PathVariable Long id) {
        return leaveService.approveLeave(id);
    }

    // Admin reject leave
    @PutMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    public Leave reject(@PathVariable Long id) {
        return leaveService.rejectLeave(id);
    }
}
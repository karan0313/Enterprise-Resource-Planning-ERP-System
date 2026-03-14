package com.karan.controller;

import com.karan.model.Attendance;
import com.karan.service.AttendanceService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    // Employee check-in
    @PostMapping("/check-in")
    public Attendance checkIn(Authentication auth) {
        return attendanceService.checkIn(auth.getName());
    }

    // Employee check-out
    @PostMapping("/check-out")
    public Attendance checkOut(Authentication auth) {
        return attendanceService.checkOut(auth.getName());
    }

    // View my attendance
    @GetMapping("/my")
    public List<Attendance> getMyAttendance(Authentication auth) {
        return attendanceService.getMyAttendance(auth.getName());
    }
}
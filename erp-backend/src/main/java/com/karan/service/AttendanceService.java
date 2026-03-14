package com.karan.service;

import com.karan.model.Attendance;

import java.util.List;

public interface AttendanceService {

    Attendance checkIn(String email);

    Attendance checkOut(String email);

    List<Attendance> getMyAttendance(String email);
}
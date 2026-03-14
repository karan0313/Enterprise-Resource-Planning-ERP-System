package com.karan.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/dashboard")
    public String userDashboard() {
        return "Welcome User 👤";
    }
}
package com.robotmonitoring.system.controller;

import com.robotmonitoring.system.dto.HealthResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
public class HealthController {

    @GetMapping("/health")
    public HealthResponse health() {
        return new HealthResponse("healthy", LocalDateTime.now().toString());
    }
}


package com.robotmonitoring.system.controller;

import com.robotmonitoring.system.dto.RobotResponse;
import com.robotmonitoring.system.service.RobotService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/robots")
public class RobotController {

    private final RobotService robotService;

    public RobotController(RobotService robotService) {
        this.robotService = robotService;
    }

    @GetMapping
    public List<RobotResponse> findAll() {
        return robotService.findAll();
    }

    @GetMapping("/{robotId}")
    public RobotResponse findById(@PathVariable("robotId") String robotId){
        return robotService.findById(robotId);
    }
}


package com.robotmonitoring.system.controller;

import com.robotmonitoring.system.dto.RobotResponse;
import com.robotmonitoring.system.dto.TimeSeriesPoint;
import com.robotmonitoring.system.dto.TimeSeriesResponse;
import com.robotmonitoring.system.service.RobotService;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/{robotId}/timeseries")
    public TimeSeriesResponse findTimeSeries(@PathVariable("robotId") String robotId,
                                             @RequestParam(defaultValue = "1") @Min(1) @Max(168) int hours){
        return robotService.findTimeSeries(robotId, hours);
    }

}


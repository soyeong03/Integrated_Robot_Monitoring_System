package com.robotmonitoring.system.dto;

import java.util.Map;

public record RobotResponse(
        String id,
        String name,
        String type,
        String status,
        String taskId,
        String group,
        String lastUpdate,
        String manufacturer,
        String department,
        String line,
        String area,
        String floor,
        Map<String, Object> sensors
) {
}


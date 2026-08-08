package com.robotmonitoring.system.service;

import com.robotmonitoring.system.domain.RobotStatus;
import com.robotmonitoring.system.domain.RobotType;
import com.robotmonitoring.system.dto.RobotResponse;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class RobotService {

    public List<RobotResponse> findAll() {
        String lastUpdate = LocalDateTime.now().toString();

        return List.of(
                robotArm("RA001", "Robot-arm 1", "TASK-1001", "생산라인A", "ABB", "1라인", "1층", lastUpdate, 48.2, 92.5, 15.0, -20.0, 30.0, "OPEN", 42.0, 75.0),
                robotArm("RA002", "Robot-arm 2", "TASK-1002", "생산라인B", "KUKA", "2라인", "2층", lastUpdate, 52.4, 88.3, -12.0, 35.0, 8.0, "CLOSED", 55.0, 68.0),
                robotArm("RA003", "Robot-arm 3", "TASK-1003", "조립라인", "FANUC", "3라인", "3층", lastUpdate, 45.7, 95.1, 22.0, 10.0, -18.0, "OPEN", 38.0, 82.0),
                ugv("UG001", "UGV 1", "TASK-2001", "물류A", "Boston Dynamics", "창고A", "1층", lastUpdate, 82.0, 35.5, 91.0, 88.0, 210.0, 145.0, 152.0, 18.0, 34.0),
                ugv("UG002", "UGV 2", "TASK-2002", "물류B", "Clearpath", "창고B", "2층", lastUpdate, 67.0, 38.1, 86.0, 84.0, 180.0, 132.0, 140.0, 22.0, 58.0),
                ugv("UG003", "UGV 3", "TASK-2003", "순찰", "AgileX", "순찰구역", "1층", lastUpdate, 74.0, 33.8, 94.0, 90.0, 260.0, 175.0, 168.0, 15.0, 76.0),
                drone("DR001", "Drone 1", "TASK-3001", "외부작업A", "DJI", lastUpdate, 79.0, 18.5, 92.0, 120.0, 4.2, 1240.0, 37.5665, 126.9780, 310.0),
                drone("DR002", "Drone 2", "TASK-3002", "외부작업B", "Parrot", lastUpdate, 64.0, 21.0, 85.0, 85.0, 6.5, 980.0, 37.5651, 126.9895, 245.0),
                drone("DR003", "Drone 3", "TASK-3003", "점검", "Autel", lastUpdate, 71.0, 16.8, 89.0, 150.0, 5.1, 1560.0, 37.5702, 126.9920, 420.0)
        );
    }

    private RobotResponse robotArm(
            String id, String name, String taskId, String group, String manufacturer,
            String line, String floor, String lastUpdate, double temperature, double efficiency,
            double joint1Angle, double joint2Angle, double joint3Angle, String gripperState,
            double torque, double workSpeed
    ) {
        return robot(id, name, RobotType.ROBOT_ARM, taskId, group, manufacturer, "생산부문", line,
                "생산라인", floor, lastUpdate, Map.of(
                        "temperature", temperature,
                        "efficiency", efficiency,
                        "joint1Angle", joint1Angle,
                        "joint2Angle", joint2Angle,
                        "joint3Angle", joint3Angle,
                        "gripperState", gripperState,
                        "torque", torque,
                        "workSpeed", workSpeed
                ));
    }

    private RobotResponse ugv(
            String id, String name, String taskId, String group, String manufacturer,
            String area, String floor, String lastUpdate, double battery, double temperature,
            double signal, double efficiency, double frontDistance, double leftDistance,
            double rightDistance, double speed, double pathProgress
    ) {
        return robot(id, name, RobotType.UGV, taskId, group, manufacturer, "물류부문", "N/A", area,
                floor, lastUpdate, Map.of(
                        "battery", battery,
                        "temperature", temperature,
                        "signal", signal,
                        "efficiency", efficiency,
                        "frontDistance", frontDistance,
                        "leftDistance", leftDistance,
                        "rightDistance", rightDistance,
                        "speed", speed,
                        "pathProgress", pathProgress
                ));
    }

    private RobotResponse drone(
            String id, String name, String taskId, String group, String manufacturer, String lastUpdate,
            double battery, double temperature, double signal, double altitude, double windSpeed,
            double flightTime, double gpsLat, double gpsLon, double homeDistance
    ) {
        return robot(id, name, RobotType.DRONE, taskId, group, manufacturer, "외부작업", "N/A", "외부",
                "외부", lastUpdate, Map.of(
                        "battery", battery,
                        "temperature", temperature,
                        "signal", signal,
                        "altitude", altitude,
                        "windSpeed", windSpeed,
                        "flightTime", flightTime,
                        "gpsLat", gpsLat,
                        "gpsLon", gpsLon,
                        "homeDistance", homeDistance
                ));
    }

    private RobotResponse robot(
            String id, String name, RobotType type, String taskId, String group, String manufacturer,
            String department, String line, String area, String floor, String lastUpdate,
            Map<String, Object> sensors
    ) {
        return new RobotResponse(
                id, name, type.value(), RobotStatus.NORMAL.value(), taskId, group, lastUpdate,
                manufacturer, department, line, area, floor, sensors
        );
    }
}


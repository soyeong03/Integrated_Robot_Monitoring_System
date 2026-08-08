package com.robotmonitoring.system.domain;

public enum RobotType {
    ROBOT_ARM("robot-arm"),
    UGV("ugv"),
    DRONE("drone");

    private final String value;

    RobotType(String value) {
        this.value = value;
    }

    public String value() {
        return value;
    }
}


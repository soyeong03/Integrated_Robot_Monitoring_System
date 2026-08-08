package com.robotmonitoring.system.domain;

public enum RobotStatus {
    NORMAL("normal"),
    WARNING("warning"),
    ERROR("error");

    private final String value;

    RobotStatus(String value) {
        this.value = value;
    }

    public String value() {
        return value;
    }
}


package com.robotmonitoring.system.exception;

public class RobotNotFoundException extends RuntimeException {
    public RobotNotFoundException(String message){
        super(message);
    }
}

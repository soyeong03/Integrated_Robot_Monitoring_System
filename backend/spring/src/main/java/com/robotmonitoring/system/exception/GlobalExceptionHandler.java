package com.robotmonitoring.system.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.robotmonitoring.system.dto.ErrorResponse;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RobotNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleRobotNotFound(RobotNotFoundException exception){

        ErrorResponse errorResponse = new ErrorResponse(exception.getMessage());

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(errorResponse);

    }
}

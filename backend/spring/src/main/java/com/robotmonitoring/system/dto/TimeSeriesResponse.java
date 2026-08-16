package com.robotmonitoring.system.dto;

import java.util.List;

public record TimeSeriesResponse (
        List<TimeSeriesPoint> temperature,
        List<TimeSeriesPoint> efficiency
){
}

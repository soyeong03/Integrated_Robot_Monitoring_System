package com.robotmonitoring.system.repository;

import com.influxdb.client.InfluxDBClient;

public class RobotRepository {

    private final InfluxDBClient influxDBClient;

    public RobotRepository(InfluxDBClient influxDBClient){
        this.influxDBClient = influxDBClient;
    }
}

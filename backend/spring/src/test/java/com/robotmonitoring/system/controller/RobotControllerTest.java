package com.robotmonitoring.system.controller;

import com.robotmonitoring.system.service.RobotService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.standaloneSetup;

class RobotControllerTest {

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = standaloneSetup(new RobotController(new RobotService())).build();
    }

    @Test
    void returnsNineRobotsUsingTheExistingFrontendContract() throws Exception {
        mockMvc.perform(get("/api/robots"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(9))
                .andExpect(jsonPath("$[0].id").value("RA001"))
                .andExpect(jsonPath("$[0].type").value("robot-arm"))
                .andExpect(jsonPath("$[0].status").value("normal"))
                .andExpect(jsonPath("$[0].taskId").isString())
                .andExpect(jsonPath("$[0].lastUpdate").isString())
                .andExpect(jsonPath("$[0].sensors.temperature").isNumber())
                .andExpect(jsonPath("$[3].id").value("UG001"))
                .andExpect(jsonPath("$[3].sensors.battery").isNumber())
                .andExpect(jsonPath("$[6].id").value("DR001"))
                .andExpect(jsonPath("$[6].sensors.altitude").isNumber());
    }
}


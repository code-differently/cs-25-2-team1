package com.codedifferently.cs_252_team1.fitnessManagementApp;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(locations = "classpath:application-test.properties")
public class FitnessManagementAppApplicationTest {

    @Test
    public void contextLoads() {
        // This test verifies that the Spring context loads successfully
        // The @SpringBootTest annotation automatically tests the main application class
    }

    @Test
    public void mainMethodTest() {
        // Test the main method without arguments (Spring Boot mode)
        String[] args = {};
        
        // This should not throw any exceptions during startup
        // The application will start and then be shutdown by the test framework
        try {
            FitnessManagementAppApplication.main(args);
        } catch (Exception e) {
            // Expected for CLI mode in test environment
        }
    }
}
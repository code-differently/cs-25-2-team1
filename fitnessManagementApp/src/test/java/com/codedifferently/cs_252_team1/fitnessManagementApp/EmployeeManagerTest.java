package com.codedifferently.cs_252_team1.fitnessManagementApp;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;


public class EmployeeManagerTest {
    private Employee employee;
    private EmployeeManager manager;

    @BeforeEach
    public void setUp() {
        manager = new EmployeeManager();
        employee = manager.addEmployee(   
            "Mattie",
            "Weathersby", 
            "mattie@email.com",
            "302000000",
            "Management",
            "Assistant Manager",
            50000.00,
            LocalDate.of(2025, 9, 18),
            WorkStatus.ACTIVE
        );
    }

    @Test
    public void testAddNewEmployee() {
        // Act
        Employee employee2 = manager.addEmployee( 
            "Jane", 
            "Doe", 
            "janedoe@email.com", 
            "3022000000", 
            "Crew Member", 
            "Cashier", 
            35000.00, 
            LocalDate.of(2025, 1, 13), 
            WorkStatus.ACTIVE
        );

        // Assert
        assertNotNull(employee);
        assertEquals(1, employee.getEmployeeId());  
        assertEquals("Mattie", employee.getFirstName());
        assertEquals("Weathersby", employee.getLastName());

        assertNotNull(employee2);
        assertEquals(2, employee2.getEmployeeId());
        assertEquals("Jane", employee2.getFirstName());
        assertEquals("Doe", employee2.getLastName());
    }
}
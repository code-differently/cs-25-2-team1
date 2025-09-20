package com.codedifferently.cs_252_team1.fitnessManagementApp;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;


public class EmployeeManager{
    private Employee employee;
    @BeforeEach
    public void setUp() {
        employee = new Employee(
            1,
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
    public void testAddNewEmployee(){
        //act
        assertNotNull(employee);
        assertEquals(1, employee.getEmployeeId());
        assertEquals("Mattie", employee.getFirstName());
        assertEquals("Weathersby", employee.getLastName());
    }
    
}
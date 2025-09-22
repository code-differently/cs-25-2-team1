package com.codedifferently.cs_252_team1.fitnessManagementApp;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class EmployeeManagerExceptionTest {
    private EmployeeManager manager;
    private Employee testEmployee;

    @BeforeEach
    public void setUp() {
        manager = new EmployeeManager();
        testEmployee = manager.addEmployee(   
            "John",
            "Doe", 
            "john.doe@email.com",
            "555-1234",
            "IT",
            "Developer",
            75000.00,
            LocalDate.now(),
            WorkStatus.ACTIVE
        );
    }

    @Test
    public void testGetEmployeeByIdSuccess() throws EmployeeNotFoundException {
        // Test successful retrieval
        Employee retrievedEmployee = manager.getEmployeeById(testEmployee.getEmployeeId());
        
        assertNotNull(retrievedEmployee);
        assertEquals(testEmployee.getEmployeeId(), retrievedEmployee.getEmployeeId());
        assertEquals("John", retrievedEmployee.getFirstName());
        assertEquals("Doe", retrievedEmployee.getLastName());
    }

    @Test
    public void testGetEmployeeByIdThrowsException() {
        // Test that EmployeeNotFoundException is thrown when getting non-existent employee
        int nonExistentId = 999;
        
        EmployeeNotFoundException thrown = assertThrows(EmployeeNotFoundException.class, () -> {
            manager.getEmployeeById(nonExistentId);
        });
        assertNotNull(thrown);
    }

    @Test
    public void testUpdateEmployeeSuccess() throws EmployeeNotFoundException {
        // Test successful update
        Employee updatedEmployee = manager.updateEmployee(
            testEmployee.getEmployeeId(),
            "Jane",
            "Smith",
            "jane.smith@email.com",
            "555-5678",
            "HR",
            "Manager",
            85000.00,
            LocalDate.now(),
            WorkStatus.ACTIVE
        );
        
        assertNotNull(updatedEmployee);
        assertEquals("Jane", updatedEmployee.getFirstName());
        assertEquals("Smith", updatedEmployee.getLastName());
        assertEquals("jane.smith@email.com", updatedEmployee.getEmail());
        assertEquals("555-5678", updatedEmployee.getPhoneNumber());
        assertEquals("HR", updatedEmployee.getDepartment());
        assertEquals("Manager", updatedEmployee.getPosition());
        assertEquals(85000.00, updatedEmployee.getSalary());
    }

    @Test
    public void testUpdateEmployeeThrowsException() {
        // Test that EmployeeNotFoundException is thrown when updating non-existent employee
        int nonExistentId = 999;
        
        assertThrows(EmployeeNotFoundException.class, () -> {
            manager.updateEmployee(
                nonExistentId,
                "Jane",
                "Smith",
                "jane.smith@email.com",
                "555-5678",
                "HR",
                "Manager",
                85000.00,
                LocalDate.now(),
                WorkStatus.ACTIVE
            );
        });
    }

    @Test
    public void testDeleteEmployeeSuccess() throws EmployeeNotFoundException {
        // Test successful deletion
        Employee deletedEmployee = manager.deleteEmployee(testEmployee.getEmployeeId());
        
        assertNotNull(deletedEmployee);
        assertEquals(testEmployee.getEmployeeId(), deletedEmployee.getEmployeeId());
        assertEquals("John", deletedEmployee.getFirstName());
        assertEquals("Doe", deletedEmployee.getLastName());
        
        // Verify employee is actually deleted by trying to get it again
        EmployeeNotFoundException thrown = assertThrows(EmployeeNotFoundException.class, () -> {
            manager.getEmployeeById(testEmployee.getEmployeeId());
        });
        assertNotNull(thrown);
    }

    @Test
    public void testDeleteEmployeeThrowsException() {
        // Test that EmployeeNotFoundException is thrown when deleting non-existent employee
        int nonExistentId = 999;
        
        EmployeeNotFoundException thrown = assertThrows(EmployeeNotFoundException.class, () -> {
            manager.deleteEmployee(nonExistentId);
        });
        assertNotNull(thrown);
    }
}
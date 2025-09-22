package com.codedifferently.cs_252_team1.fitnessManagementApp;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class EmployeeManagerTest {
    private EmployeeManager manager;
    private Employee employee;

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
        Employee newEmployee = manager.addEmployee(
            "John", 
            "Doe", 
            "john@email.com", 
            "555-1234", 
            "IT", 
            "Developer", 
            75000.00, 
            LocalDate.now(), 
            WorkStatus.ACTIVE
        );
        
        // Assert
        assertNotNull(newEmployee);
        assertEquals("John", newEmployee.getFirstName());
        assertEquals("Doe", newEmployee.getLastName());
        assertEquals("john@email.com", newEmployee.getEmail());
        assertEquals("555-1234", newEmployee.getPhoneNumber());
        assertEquals("IT", newEmployee.getDepartment());
        assertEquals("Developer", newEmployee.getPosition());
        assertEquals(75000.00, newEmployee.getSalary());
        assertEquals(WorkStatus.ACTIVE, newEmployee.getWorkStatus());
        assertTrue(newEmployee.getEmployeeId() > 0);
    }

    @Test
    public void testAddEmployeeValidation() {
        // Test that the manager can handle various valid inputs
        Employee emp1 = manager.addEmployee("Jane", "Smith", "jane@test.com", "123-456-7890", 
                                           "HR", "Manager", 80000.0, LocalDate.now(), WorkStatus.ACTIVE);
        assertNotNull(emp1);
        assertEquals("Jane", emp1.getFirstName());
    }

    @Test
    public void testListAllEmployees() {
    // Test that listAllEmployees returns correct count
        var employees = manager.listAllEmployees();
        assertTrue(employees.size() >= 1); // Should include the employee from setUp()

    // Add another employee and verify count increases
        manager.addEmployee("Test", "User", "test@email.com", "111-1111", 
                       "IT", "Dev", 50000.0, LocalDate.now(), WorkStatus.ACTIVE);
        var updatedEmployees = manager.listAllEmployees();
        assertEquals(employees.size() + 1, updatedEmployees.size());
}

    @Test
    public void testEmployeeIdAutoIncrement() {
        // Test that employee IDs auto-increment
        Employee emp1 = manager.addEmployee("Test1", "User1", "test1@email.com", "111-1111", 
                                           "Dept1", "Pos1", 50000.0, LocalDate.now(), WorkStatus.ACTIVE);
        Employee emp2 = manager.addEmployee("Test2", "User2", "test2@email.com", "222-2222", 
                                           "Dept2", "Pos2", 60000.0, LocalDate.now(), WorkStatus.ACTIVE);
        
        assertTrue(emp2.getEmployeeId() > emp1.getEmployeeId());
    }

    @Test
    public void testDifferentWorkStatuses() {
        // Test different work statuses
        Employee activeEmp = manager.addEmployee("Active", "User", "active@email.com", "111-1111", 
                                                "IT", "Dev", 70000.0, LocalDate.now(), WorkStatus.ACTIVE);
        Employee inactiveEmp = manager.addEmployee("Inactive", "User", "inactive@email.com", "222-2222", 
                                                  "IT", "Dev", 70000.0, LocalDate.now(), WorkStatus.INACTIVE);
        
        assertEquals(WorkStatus.ACTIVE, activeEmp.getWorkStatus());
        assertEquals(WorkStatus.INACTIVE, inactiveEmp.getWorkStatus());
    }

    @Test
    public void testDifferentDepartmentsAndPositions() {
        // Test various departments and positions
        Employee itEmp = manager.addEmployee("IT", "Employee", "it@email.com", "111-1111", 
                                            "Information Technology", "Software Developer", 
                                            75000.0, LocalDate.now(), WorkStatus.ACTIVE);
        Employee hrEmp = manager.addEmployee("HR", "Employee", "hr@email.com", "222-2222", 
                                            "Human Resources", "HR Specialist", 
                                            65000.0, LocalDate.now(), WorkStatus.ACTIVE);
        
        assertEquals("Information Technology", itEmp.getDepartment());
        assertEquals("Software Developer", itEmp.getPosition());
        assertEquals("Human Resources", hrEmp.getDepartment());
        assertEquals("HR Specialist", hrEmp.getPosition());
    }

    @Test
    public void testSalaryRange() {
        // Test different salary ranges
        Employee lowSalaryEmp = manager.addEmployee("Low", "Salary", "low@email.com", "111-1111", 
                                                   "Entry", "Intern", 30000.0, LocalDate.now(), WorkStatus.ACTIVE);
        Employee highSalaryEmp = manager.addEmployee("High", "Salary", "high@email.com", "222-2222", 
                                                    "Executive", "CEO", 200000.0, LocalDate.now(), WorkStatus.ACTIVE);
        
        assertEquals(30000.0, lowSalaryEmp.getSalary());
        assertEquals(200000.0, highSalaryEmp.getSalary());
    }

    @Test
    public void testHireDateVariations() {
        // Test different hire dates
        LocalDate pastDate = LocalDate.of(2020, 1, 15);
        LocalDate futureDate = LocalDate.of(2026, 12, 31);
        
        Employee pastHireEmp = manager.addEmployee("Past", "Hire", "past@email.com", "111-1111", 
                                                  "IT", "Dev", 70000.0, pastDate, WorkStatus.ACTIVE);
        Employee futureHireEmp = manager.addEmployee("Future", "Hire", "future@email.com", "222-2222", 
                                                    "IT", "Dev", 70000.0, futureDate, WorkStatus.ACTIVE);
        
        assertEquals(pastDate, pastHireEmp.getHireDate());
        assertEquals(futureDate, futureHireEmp.getHireDate());
    }

    @Test
    public void testDefaultConstructor() {
        // Test that EmployeeManager can be created with default constructor
        EmployeeManager newManager = new EmployeeManager();
        assertNotNull(newManager);
        
        // Test that it can add employees
        Employee emp = newManager.addEmployee("Test", "User", "test@email.com", "111-1111", 
                                             "IT", "Dev", 50000.0, LocalDate.now(), WorkStatus.ACTIVE);
        assertNotNull(emp);
        assertEquals(1, emp.getEmployeeId()); // Should start from ID 1
    }

    @Test
public void testAddEmployeeWithNullValues() {
    // Test how the system handles null inputs
    IllegalArgumentException thrown1 = assertThrows(IllegalArgumentException.class, () -> {
        manager.addEmployee(null, "Doe", "test@email.com", "123-456-7890", 
                           "IT", "Dev", 50000.0, LocalDate.now(), WorkStatus.ACTIVE);
    });
}

@Test
public void testAddEmployeeWithEmptyStrings() {
    // Test how the system handles empty strings
    IllegalArgumentException thrown2 = assertThrows(IllegalArgumentException.class, () -> {
        manager.addEmployee("", "Doe", "test@email.com", "123-456-7890", 
                           "IT", "Dev", 50000.0, LocalDate.now(), WorkStatus.ACTIVE);
    });
}

@Test
public void testAddEmployeeWithNegativeSalary() {
    // Test negative salary validation
    IllegalArgumentException thrown3 = assertThrows(IllegalArgumentException.class, () -> {
        manager.addEmployee("John", "Doe", "test@email.com", "123-456-7890", 
                           "IT", "Dev", -1000.0, LocalDate.now(), WorkStatus.ACTIVE);
    });
}
}
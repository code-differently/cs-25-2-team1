package com.codedifferently.cs_252_team1.fitnessManagementApp;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
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
        assertEquals("mattie@email.com", employee.getEmail());
        assertEquals("302000000", employee.getPhoneNumber());
        assertEquals("Management", employee.getDepartment());
        assertEquals("Assistant Manager", employee.getPosition());
        assertEquals(50000.00, employee.getSalary());
        assertEquals(LocalDate.of(2025, 9, 18), employee.getHireDate());
        assertEquals(WorkStatus.ACTIVE, employee.getWorkStatus());

        assertNotNull(employee2);
        assertEquals(2, employee2.getEmployeeId());
        assertEquals("Jane", employee2.getFirstName());
        assertEquals("Doe", employee2.getLastName());
        assertEquals("janedoe@email.com", employee2.getEmail());
        assertEquals("3022000000", employee2.getPhoneNumber());
        assertEquals("Crew Member", employee2.getDepartment());
        assertEquals("Cashier", employee2.getPosition());
        assertEquals(35000.00, employee2.getSalary());
        assertEquals(LocalDate.of(2025, 1, 13), employee2.getHireDate());
        assertEquals(WorkStatus.ACTIVE, employee2.getWorkStatus());
    }

    @Test
    public void testAddEmployeeValidation() {
        // Test null first name
        assertThrows(IllegalArgumentException.class, () -> {
            manager.addEmployee(null, "Doe", "john@email.com", "1234567890", 
                "IT", "Developer", 60000.00, LocalDate.now(), WorkStatus.ACTIVE);
        });

        // Test empty first name
        assertThrows(IllegalArgumentException.class, () -> {
            manager.addEmployee("", "Doe", "john@email.com", "1234567890", 
                "IT", "Developer", 60000.00, LocalDate.now(), WorkStatus.ACTIVE);
        });

        // Test null last name
        assertThrows(IllegalArgumentException.class, () -> {
            manager.addEmployee("John", null, "john@email.com", "1234567890", 
                "IT", "Developer", 60000.00, LocalDate.now(), WorkStatus.ACTIVE);
        });

        // Test empty last name
        assertThrows(IllegalArgumentException.class, () -> {
            manager.addEmployee("John", "", "john@email.com", "1234567890", 
                "IT", "Developer", 60000.00, LocalDate.now(), WorkStatus.ACTIVE);
        });

        // Test negative salary
        assertThrows(IllegalArgumentException.class, () -> {
            manager.addEmployee("John", "Doe", "john@email.com", "1234567890", 
                "IT", "Developer", -1000.00, LocalDate.now(), WorkStatus.ACTIVE);
        });
    }

    @Test
    public void testEmployeeIdAutoIncrement() {
        Employee emp1 = manager.addEmployee("John", "Doe", "john@email.com", "1111111111",
            "IT", "Developer", 60000.00, LocalDate.now(), WorkStatus.ACTIVE);
        
        Employee emp2 = manager.addEmployee("Jane", "Smith", "jane@email.com", "2222222222",
            "HR", "Recruiter", 55000.00, LocalDate.now(), WorkStatus.ACTIVE);
        
        Employee emp3 = manager.addEmployee("Bob", "Johnson", "bob@email.com", "3333333333",
            "Finance", "Accountant", 58000.00, LocalDate.now(), WorkStatus.INACTIVE);

        // First employee from setUp should have ID 1
        assertEquals(1, employee.getEmployeeId());
        // New employees should have incremental IDs
        assertEquals(2, emp1.getEmployeeId());
        assertEquals(3, emp2.getEmployeeId());
        assertEquals(4, emp3.getEmployeeId());
    }

    @Test
    public void testDifferentWorkStatuses() {
        Employee activeEmployee = manager.addEmployee("Active", "Worker", "active@email.com", "1111111111",
            "Sales", "Representative", 45000.00, LocalDate.now(), WorkStatus.ACTIVE);
        assertEquals(WorkStatus.ACTIVE, activeEmployee.getWorkStatus());

        Employee inactiveEmployee = manager.addEmployee("Inactive", "Worker", "inactive@email.com", "2222222222",
            "Marketing", "Coordinator", 42000.00, LocalDate.now(), WorkStatus.INACTIVE);
        assertEquals(WorkStatus.INACTIVE, inactiveEmployee.getWorkStatus());

        Employee terminatedEmployee = manager.addEmployee("Terminated", "Worker", "terminated@email.com", "3333333333",
            "Operations", "Supervisor", 48000.00, LocalDate.now(), WorkStatus.TERMINATED);
        assertEquals(WorkStatus.TERMINATED, terminatedEmployee.getWorkStatus());
    }

    @Test
    public void testDifferentDepartmentsAndPositions() {
        Employee itEmployee = manager.addEmployee("Tech", "Person", "tech@email.com", "1111111111",
            "Information Technology", "Software Engineer", 75000.00, LocalDate.now(), WorkStatus.ACTIVE);
        assertEquals("Information Technology", itEmployee.getDepartment());
        assertEquals("Software Engineer", itEmployee.getPosition());

        Employee hrEmployee = manager.addEmployee("HR", "Person", "hr@email.com", "2222222222",
            "Human Resources", "HR Manager", 65000.00, LocalDate.now(), WorkStatus.ACTIVE);
        assertEquals("Human Resources", hrEmployee.getDepartment());
        assertEquals("HR Manager", hrEmployee.getPosition());

        Employee financeEmployee = manager.addEmployee("Finance", "Person", "finance@email.com", "3333333333",
            "Finance", "Financial Analyst", 60000.00, LocalDate.now(), WorkStatus.ACTIVE);
        assertEquals("Finance", financeEmployee.getDepartment());
        assertEquals("Financial Analyst", financeEmployee.getPosition());
    }

    @Test
    public void testSalaryRange() {
        Employee lowSalaryEmployee = manager.addEmployee("Low", "Salary", "low@email.com", "1111111111",
            "Entry Level", "Intern", 25000.00, LocalDate.now(), WorkStatus.ACTIVE);
        assertEquals(25000.00, lowSalaryEmployee.getSalary());

        Employee midSalaryEmployee = manager.addEmployee("Mid", "Salary", "mid@email.com", "2222222222",
            "Management", "Manager", 75000.00, LocalDate.now(), WorkStatus.ACTIVE);
        assertEquals(75000.00, midSalaryEmployee.getSalary());

        Employee highSalaryEmployee = manager.addEmployee("High", "Salary", "high@email.com", "3333333333",
            "Executive", "Director", 120000.00, LocalDate.now(), WorkStatus.ACTIVE);
        assertEquals(120000.00, highSalaryEmployee.getSalary());
    }

    @Test
    public void testHireDateVariations() {
        LocalDate pastDate = LocalDate.of(2020, 1, 15);
        LocalDate currentDate = LocalDate.now();
        LocalDate futureDate = LocalDate.of(2026, 6, 1);

        Employee pastHire = manager.addEmployee("Past", "Hire", "past@email.com", "1111111111",
            "Operations", "Operator", 40000.00, pastDate, WorkStatus.ACTIVE);
        assertEquals(pastDate, pastHire.getHireDate());

        Employee currentHire = manager.addEmployee("Current", "Hire", "current@email.com", "2222222222",
            "Support", "Specialist", 45000.00, currentDate, WorkStatus.ACTIVE);
        assertEquals(currentDate, currentHire.getHireDate());

        Employee futureHire = manager.addEmployee("Future", "Hire", "future@email.com", "3333333333",
            "Planning", "Planner", 50000.00, futureDate, WorkStatus.ACTIVE);
        assertEquals(futureDate, futureHire.getHireDate());
    }

    @Test
    public void testDefaultConstructor() {
        EmployeeManager newManager = new EmployeeManager();
        assertNotNull(newManager);
        
        // Should be able to add employees to new manager
        Employee testEmployee = newManager.addEmployee("Test", "User", "test@email.com", "1234567890",
            "Test Dept", "Tester", 50000.00, LocalDate.now(), WorkStatus.ACTIVE);
        
        assertNotNull(testEmployee);
        assertEquals(1, testEmployee.getEmployeeId()); // Should start with ID 1
    }
}
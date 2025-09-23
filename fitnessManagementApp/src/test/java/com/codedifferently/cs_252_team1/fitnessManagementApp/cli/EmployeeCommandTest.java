package com.codedifferently.cs_252_team1.fitnessManagementApp.cli;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyDouble;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.codedifferently.cs_252_team1.fitnessManagementApp.Employee;
import com.codedifferently.cs_252_team1.fitnessManagementApp.EmployeeManager;
import com.codedifferently.cs_252_team1.fitnessManagementApp.EmployeeNotFoundException;
import com.codedifferently.cs_252_team1.fitnessManagementApp.WorkStatus;

@ExtendWith(MockitoExtension.class)
public class EmployeeCommandTest {

    @Mock
    private EmployeeManager employeeManager;

    private final ByteArrayOutputStream outContent = new ByteArrayOutputStream();
    private final ByteArrayOutputStream errContent = new ByteArrayOutputStream();
    private final PrintStream originalOut = System.out;
    private final PrintStream originalErr = System.err;

    @BeforeEach
    public void setUpStreams() {
        System.setOut(new PrintStream(outContent));
        System.setErr(new PrintStream(errContent));
    }

    @AfterEach
    public void restoreStreams() {
        System.setOut(originalOut);
        System.setErr(originalErr);
    }

    @Test
    public void testEmployeeCommandRun() {
        EmployeeCommand command = new EmployeeCommand();
        command.run();
        
        assertTrue(outContent.toString().contains("Use a subcommand: add, update, remove, list, get"));
    }

    @Test
public void testAddEmployeeCommandSuccess() {
    // Arrange
    EmployeeCommand.AddEmployeeCommand addCommand = new EmployeeCommand.AddEmployeeCommand();
    addCommand.setEmployeeManager(employeeManager);
    
    Employee mockEmployee = new Employee(1, "John", "Doe", "john@email.com", "1234567890",
        "IT", "Developer", 60000.00, LocalDate.now(), WorkStatus.ACTIVE);
    
    // Fix: Use consistent argument matchers
    when(employeeManager.addEmployee(anyString(), anyString(), anyString(), anyString(),
        anyString(), anyString(), anyDouble(), any(LocalDate.class), any(WorkStatus.class)))
        .thenReturn(mockEmployee);
    
    addCommand.firstName = "John";
    addCommand.lastName = "Doe";
    addCommand.email = "john@email.com";
    addCommand.phone = "1234567890";
    addCommand.department = "IT";
    addCommand.position = "Developer";
    addCommand.salary = 60000.00;
    addCommand.workStatus = WorkStatus.ACTIVE;

    // Act
    addCommand.run();

    // Assert
    verify(employeeManager).addEmployee(eq("John"), eq("Doe"), eq("john@email.com"),eq( "1234567890"),
        eq("IT"),eq("Developer"), eq(60000.00), any(LocalDate.class), eq(WorkStatus.ACTIVE));
    assertTrue(outContent.toString().contains("✅ Employee 'John Doe' added successfully"));
}

    @Test
    public void testAddEmployeeCommandError() {
        // Arrange
        EmployeeCommand.AddEmployeeCommand addCommand = new EmployeeCommand.AddEmployeeCommand();
        addCommand.setEmployeeManager(employeeManager);
        
        when(employeeManager.addEmployee(anyString(), anyString(), anyString(), anyString(),
            anyString(), anyString(), anyDouble(), any(LocalDate.class), any(WorkStatus.class)))
            .thenThrow(new IllegalArgumentException("Invalid employee data"));
        
        // Set up command fields
        addCommand.firstName = "John";
        addCommand.lastName = "Doe";
        addCommand.email = "john@email.com";
        addCommand.phone = "1234567890";
        addCommand.department = "IT";
        addCommand.position = "Developer";
        addCommand.salary = 60000.00;
        addCommand.workStatus = WorkStatus.ACTIVE;

        // Act
        addCommand.run();

        // Assert
        assertTrue(errContent.toString().contains("❌ Error adding employee: Invalid employee data"));
    }

    @Test
    public void testRemoveEmployeeCommandSuccess() throws EmployeeNotFoundException {
        // Arrange
        EmployeeCommand.RemoveEmployeeCommand removeCommand = new EmployeeCommand.RemoveEmployeeCommand();
        removeCommand.employeeManager = employeeManager;
        removeCommand.employeeId = 1;
        
        Employee mockEmployee = new Employee(1, "John", "Doe", "john@email.com", "1234567890",
            "IT", "Developer", 60000.00, LocalDate.now(), WorkStatus.ACTIVE);
        
        when(employeeManager.deleteEmployee(1)).thenReturn(mockEmployee);

        // Act
        removeCommand.run();

        // Assert
        verify(employeeManager).deleteEmployee(1);
        assertTrue(outContent.toString().contains("✅ Employee 'John Doe' (ID: 1) removed successfully"));
    }

    @Test
    public void testRemoveEmployeeCommandNotFound() throws EmployeeNotFoundException {
        // Arrange
        EmployeeCommand.RemoveEmployeeCommand removeCommand = new EmployeeCommand.RemoveEmployeeCommand();
        removeCommand.employeeManager = employeeManager;
        removeCommand.employeeId = 999;
        
        when(employeeManager.deleteEmployee(999))
            .thenThrow(new EmployeeNotFoundException("Employee with ID 999 not found"));

        // Act
        removeCommand.run();

        // Assert
        assertTrue(errContent.toString().contains("❌ Employee not found: Employee with ID 999 not found"));
    }

    @Test
    public void testRemoveEmployeeCommandGeneralError() throws EmployeeNotFoundException {
        // Arrange
        EmployeeCommand.RemoveEmployeeCommand removeCommand = new EmployeeCommand.RemoveEmployeeCommand();
        removeCommand.employeeManager = employeeManager;
        removeCommand.employeeId = 1;
        
        when(employeeManager.deleteEmployee(1))
            .thenThrow(new RuntimeException("Database connection error"));

        // Act
        removeCommand.run();

        // Assert
        assertTrue(errContent.toString().contains("❌ Error removing employee: Database connection error"));
    }

    @Test
    public void testListEmployeesCommandEmpty() {
        // Arrange
        EmployeeCommand.ListEmployeesCommand listCommand = new EmployeeCommand.ListEmployeesCommand();
        listCommand.employeeManager = employeeManager;
        
        when(employeeManager.listAllEmployees()).thenReturn(Collections.emptyList());

        // Act
        listCommand.run();

        // Assert
        assertTrue(outContent.toString().contains("📝 No employees found"));
    }

    @Test
    public void testListEmployeesCommandWithData() {
        // Arrange
        EmployeeCommand.ListEmployeesCommand listCommand = new EmployeeCommand.ListEmployeesCommand();
        listCommand.employeeManager = employeeManager;
        
        Employee emp1 = new Employee(1, "John", "Doe", "john@email.com", "1234567890",
            "IT", "Developer", 60000.00, LocalDate.now(), WorkStatus.ACTIVE);
        Employee emp2 = new Employee(2, "Jane", "Smith", "jane@email.com", "0987654321",
            "HR", "Manager", 70000.00, LocalDate.now(), WorkStatus.ACTIVE);
        
        List<Employee> employees = Arrays.asList(emp1, emp2);
        when(employeeManager.listAllEmployees()).thenReturn(employees);

        // Act
        listCommand.run();

        // Assert
        String output = outContent.toString();
        assertTrue(output.contains("👥 All Employees:"));
        assertTrue(output.contains("ID: 1 | Name: John Doe | Dept: IT | Position: Developer | Status: ACTIVE"));
        assertTrue(output.contains("ID: 2 | Name: Jane Smith | Dept: HR | Position: Manager | Status: ACTIVE"));
    }

    @Test
    public void testGetEmployeeCommandSuccess() throws EmployeeNotFoundException {
        // Arrange
        EmployeeCommand.GetEmployeeCommand getCommand = new EmployeeCommand.GetEmployeeCommand();
        getCommand.employeeManager = employeeManager;
        getCommand.employeeId = 1;
        
        Employee mockEmployee = new Employee(1, "John", "Doe", "john@email.com", "1234567890",
            "IT", "Developer", 60000.00, LocalDate.of(2020, 1, 1), WorkStatus.ACTIVE);
        
        when(employeeManager.getEmployeeById(1)).thenReturn(mockEmployee);

        // Act
        getCommand.run();

        // Assert
        String output = outContent.toString();
        assertTrue(output.contains("👤 Employee Details:"));
        assertTrue(output.contains("ID: 1"));
        assertTrue(output.contains("Name: John Doe"));
        assertTrue(output.contains("Email: john@email.com"));
        assertTrue(output.contains("Phone: 1234567890"));
        assertTrue(output.contains("Department: IT"));
        assertTrue(output.contains("Position: Developer"));
        assertTrue(output.contains("Salary: $60000.00"));
        assertTrue(output.contains("Work Status: ACTIVE"));
        assertTrue(output.contains("Hire Date: 2020-01-01"));
    }

    @Test
    public void testGetEmployeeCommandNotFound() throws EmployeeNotFoundException {
        // Arrange
        EmployeeCommand.GetEmployeeCommand getCommand = new EmployeeCommand.GetEmployeeCommand();
        getCommand.employeeManager = employeeManager;
        getCommand.employeeId = 999;
        
        when(employeeManager.getEmployeeById(999))
            .thenThrow(new EmployeeNotFoundException("Employee with ID 999 not found"));

        // Act
        getCommand.run();

        // Assert
        assertTrue(errContent.toString().contains("❌ Employee not found: Employee with ID 999 not found"));
    }

    @Test
    public void testGetEmployeeCommandGeneralError() throws EmployeeNotFoundException {
        // Arrange
        EmployeeCommand.GetEmployeeCommand getCommand = new EmployeeCommand.GetEmployeeCommand();
        getCommand.employeeManager = employeeManager;
        getCommand.employeeId = 1;
        
        when(employeeManager.getEmployeeById(1))
            .thenThrow(new RuntimeException("Database error"));

        // Act
        getCommand.run();

        // Assert
        assertTrue(errContent.toString().contains("❌ Error getting employee: Database error"));
    }
}

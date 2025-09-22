package com.codedifferently.cs_252_team1.fitnessManagementApp;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

@Service
public class EmployeeManager {
    private final Map<Integer, Employee> employeeMap;
    private final AtomicInteger idCounter;

    public EmployeeManager() {
        this.employeeMap = new HashMap<>();
        this.idCounter = new AtomicInteger(1); // Start IDs from 1
    }

    // Add a new employee
    public Employee addEmployee(String firstName, String lastName, String email, 
                                String phoneNumber, String department, String position, 
                                double salary, LocalDate hireDate, WorkStatus workStatus) {
        int newId = idCounter.getAndIncrement();
        Employee newEmployee = new Employee(newId, firstName, lastName, email, phoneNumber, 
                                            department, position, salary, hireDate, workStatus);
        employeeMap.put(newId, newEmployee);
        return newEmployee;
    }

    // Retrieve an employee by ID
    public Employee getEmployeeById(int employeeId) throws EmployeeNotFoundException {
        Employee employee = employeeMap.get(employeeId);
        if (employee == null) {
            throw new EmployeeNotFoundException("Employee with ID " + employeeId + " not found.");
        }
        return employee;
    }

    // Update an existing employee
    public Employee updateEmployee(int employeeId, String firstName, String lastName, String email, 
                                  String phoneNumber, String department, String position, 
                                  double salary, LocalDate hireDate, WorkStatus workStatus) throws EmployeeNotFoundException {
        Employee existingEmployee = employeeMap.get(employeeId);
        if (existingEmployee == null) {
            throw new EmployeeNotFoundException("Employee with ID " + employeeId + " not found.");
        }
        existingEmployee.setFirstName(firstName);
        existingEmployee.setLastName(lastName);
        existingEmployee.setEmail(email);
        existingEmployee.setPhoneNumber(phoneNumber);
        existingEmployee.setDepartment(department);
        existingEmployee.setPosition(position);
        existingEmployee.setSalary(salary);
        existingEmployee.setHireDate(hireDate);
        existingEmployee.setWorkStatus(workStatus);
        return existingEmployee;
    }

    // Delete an employee by ID
    public Employee deleteEmployee(int employeeId) throws EmployeeNotFoundException {
        Employee removedEmployee = employeeMap.remove(employeeId);
        if (removedEmployee == null) {
            throw new EmployeeNotFoundException("Employee with ID " + employeeId + " not found.");
        }
        return removedEmployee;
    }

    // List all employees
    public List<Employee> listAllEmployees() {
        return new ArrayList<>(employeeMap.values());
    }

    // Find employees by department
    public List<Employee> findEmployeesByDepartment(String department) {
        return employeeMap.values().stream()
                .filter(emp -> emp.getDepartment().equalsIgnoreCase(department))
                .collect(Collectors.toList());
    }
}



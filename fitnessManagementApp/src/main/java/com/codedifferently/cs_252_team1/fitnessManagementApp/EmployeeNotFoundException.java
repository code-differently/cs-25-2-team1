package com.codedifferently.cs_252_team1.fitnessManagementApp;

public class EmployeeNotFoundException extends Exception {
    
    public EmployeeNotFoundException(String message) {
        super(message);
    }
    
    public EmployeeNotFoundException() {
        super("Employee not found.");
    }
}

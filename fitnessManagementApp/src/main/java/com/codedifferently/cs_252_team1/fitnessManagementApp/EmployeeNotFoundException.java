package com.codedifferently.cs_252_team1.fitnessManagementApp;

/**
 * Custom exception thrown when an employee is not found in the system.
 * This exception provides more specific information than a generic exception.
 */
public class EmployeeNotFoundException extends Exception {
    
    /**
     * Constructs an EmployeeNotFoundException with the specified employee ID.
     * 
     * @param employeeId the ID of the employee that was not found
     */
    public EmployeeNotFoundException(String employeeId) {
        super("Employee with ID " + employeeId + " not found");
    }
    

}

package com.codedifferently.cs_252_team1.fitnessManagementApp;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Objects;

public class Employee implements Serializable {
    private static final long serialVersionUID = 1L;
    
    // Private fields with proper encapsulation
    private int employeeId;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private LocalDate hireDate;
    private double salary;
    private String department;
    private String position;
    private WorkStatus workStatus;
    
    // Constructors
    public Employee() {
        this.employeeId = 0;
        this.hireDate = LocalDate.now();
        this.workStatus = WorkStatus.ACTIVE;
        this.firstName = "";
        this.lastName = "";
        this.email = "";
        this.phoneNumber = "";
        this.salary = 0.0;
        this.department = "";
        this.position = "";
    }
    
    public Employee(int employeeId, String firstName, String lastName, String email, 
                   String phoneNumber, String department, String position, double salary, 
                   LocalDate hireDate, WorkStatus workStatus) {
        this.employeeId = employeeId;
        setFirstName(firstName);
        setLastName(lastName);
        setEmail(email);
        setPhoneNumber(phoneNumber);
        setDepartment(department);
        setPosition(position);
        setSalary(salary);
        setHireDate(hireDate);
        this.workStatus = workStatus != null ? workStatus : WorkStatus.ACTIVE;
    }
    
    // Getters and Setters with validation
    public int getEmployeeId() {
        return employeeId;
    }
    
    public void setEmployeeId(int employeeId) {
        this.employeeId = employeeId;
    }
    
    public String getFirstName() {
        return firstName;
    }
    
    public final void setFirstName(String firstName) {
        if (firstName == null || firstName.trim().length() < 2 || firstName.length() > 50) {
            throw new IllegalArgumentException("First name must be between 2 and 50 characters");
        }
        this.firstName = firstName.trim();
    }
    
    public String getLastName() {
        return lastName;
    }
    
    public final void setLastName(String lastName) {
        if (lastName == null || lastName.trim().length() < 2 || lastName.length() > 50) {
            throw new IllegalArgumentException("Last name must be between 2 and 50 characters");
        }
        this.lastName = lastName.trim();
    }
    
    public String getEmail() {
        return email;
    }
    
    public final void setEmail(String email) {
        this.email = email;
    }
    
    public String getPhoneNumber() {
        return phoneNumber;
    }
    
    public final void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
    
    public LocalDate getHireDate() {
        return hireDate;
    }
    
    public final void setHireDate(LocalDate hireDate) {
        this.hireDate = hireDate;
    }
    
    public double getSalary() {
        return salary;
    }
    
    public final void setSalary(double salary) {
        if (salary < 0) {
            throw new IllegalArgumentException("Salary cannot be negative");
        }
        this.salary = salary;
    }
    
    public String getDepartment() {
        return department;
    }
    
    public final void setDepartment(String department) {
        this.department = department != null ? department : "";
    }
    
    public String getPosition() {
        return position;
    }
    
    public final void setPosition(String position) {
        this.position = position != null ? position : "";
    }
    
    public WorkStatus getWorkStatus() {
        return workStatus;
    }
    
    public final void setWorkStatus(WorkStatus workStatus) {
        this.workStatus = workStatus != null ? workStatus : WorkStatus.ACTIVE;
    }
    
    // Computed properties (methods in Java)
    public String getFullName() {
        return firstName + " " + lastName;
    }
    
    public long getYearsOfService() {
        return ChronoUnit.YEARS.between(hireDate, LocalDate.now());
    }
    
    // Convenience method to check if employee is active
    public boolean isActive() {
        return workStatus == WorkStatus.ACTIVE;
    }
    
    // Business methods
    public void updateSalary(double newSalary) {
        setSalary(newSalary);
    }
    
    public void deactivate() {
        this.workStatus = WorkStatus.INACTIVE;
    }
    
    public void activate() {
        this.workStatus = WorkStatus.ACTIVE;
    }
    
    public void terminate() {
        this.workStatus = WorkStatus.TERMINATED;
    }
    
    public void putOnLeave() {
        this.workStatus = WorkStatus.ON_LEAVE;
    }
    
    // Override methods
    @Override
    public String toString() {
        return getFullName() + " - " + position + " in " + department + " (" + workStatus + ")";
    }
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Employee employee = (Employee) obj;
        return employeeId == employee.employeeId;
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(employeeId);
    }
}
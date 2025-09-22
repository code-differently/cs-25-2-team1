package com.codedifferently.cs_252_team1.fitnessManagementApp.cli;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.codedifferently.cs_252_team1.fitnessManagementApp.Employee;
import com.codedifferently.cs_252_team1.fitnessManagementApp.EmployeeManager;
import com.codedifferently.cs_252_team1.fitnessManagementApp.EmployeeNotFoundException;
import com.codedifferently.cs_252_team1.fitnessManagementApp.WorkStatus;

import picocli.CommandLine.Command;
import picocli.CommandLine.Option;
import picocli.CommandLine.Parameters;

@Component
@Command(name = "employee", description = "Manage gym employees",
         subcommands = {
             EmployeeCommand.AddEmployeeCommand.class,
             EmployeeCommand.UpdateEmployeeCommand.class,
             EmployeeCommand.RemoveEmployeeCommand.class,
             EmployeeCommand.ListEmployeesCommand.class,
             EmployeeCommand.GetEmployeeCommand.class
         })
public class EmployeeCommand implements Runnable {

    @Override
    public void run() {
        System.out.println("Use a subcommand: add, update, remove, list, get");
    }

    @Component
    @Command(name = "add", description = "Add a new employee")
    public static class AddEmployeeCommand implements Runnable {
        
        @Autowired
        private EmployeeManager employeeManager;

        @Option(names = {"-f", "--firstname"}, required = true, description = "Employee first name")
        public String firstName;

        @Option(names = {"-l", "--lastname"}, required = true, description = "Employee last name")
        public String lastName;

        @Option(names = {"-e", "--email"}, required = true, description = "Employee email")
        public String email;

        @Option(names = {"-p", "--phone"}, required = true, description = "Employee phone")
        public String phone;

        @Option(names = {"-d", "--department"}, required = true, description = "Employee department")
        public String department;

        @Option(names = {"-pos", "--position"}, required = true, description = "Employee position")
        public String position;

        @Option(names = {"-sal", "--salary"}, required = true, description = "Employee salary")
        public double salary;

        @Option(names = {"-s", "--status"}, description = "Work status (ACTIVE, INACTIVE, TERMINATED, ON_LEAVE)")
        public WorkStatus workStatus = WorkStatus.ACTIVE;

        public void setEmployeeManager(EmployeeManager employeeManager) {
            this.employeeManager = employeeManager;
        }
        
        public void setWorkStatus(WorkStatus workStatus) {
            this.workStatus = workStatus;
        }

        @Override
        public void run() {
            try {
                Employee employee = employeeManager.addEmployee(firstName, lastName, email, phone, 
                                                               department, position, salary, LocalDate.now(), workStatus);
                System.out.printf("✅ Employee '%s %s' added successfully with ID: %d%n", firstName, lastName, employee.getEmployeeId());
            } catch (Exception e) {
                System.err.printf("❌ Error adding employee: %s%n", e.getMessage());
            }
        }
    }

    @Component
    @Command(name = "update", description = "Update an existing employee")
    public static class UpdateEmployeeCommand implements Runnable {
        
        @Autowired
        public EmployeeManager employeeManager;

        @Parameters(index = "0", description = "Employee ID to update")
        public int employeeId;

        @Option(names = {"-f", "--firstname"}, description = "Employee first name")
        public String firstName;

        @Option(names = {"-l", "--lastname"}, description = "Employee last name")
        public String lastName;

        @Option(names = {"-e", "--email"}, description = "Employee email")
        public String email;

        @Option(names = {"-p", "--phone"}, description = "Employee phone")
        public String phone;

        @Option(names = {"-d", "--department"}, description = "Department")
        public String department;

        @Option(names = {"-pos", "--position"}, description = "Job position")
        public String position;

        @Option(names = {"-s", "--salary"}, description = "Salary")
        public Double salary;

        @Option(names = {"-st", "--status"}, description = "Work status (ACTIVE, INACTIVE, ON_LEAVE)")
        public WorkStatus workStatus;

        public void setEmployeeManager(EmployeeManager employeeManager) {
            this.employeeManager = employeeManager;
        }

        @Override
        public void run() {
            try {
                // Get current employee to preserve unchanged fields
                Employee currentEmployee = employeeManager.getEmployeeById(employeeId);
                
                // Use current values if new ones aren't provided
                String updateFirstName = firstName != null ? firstName : currentEmployee.getFirstName();
                String updateLastName = lastName != null ? lastName : currentEmployee.getLastName();
                String updateEmail = email != null ? email : currentEmployee.getEmail();
                String updatePhone = phone != null ? phone : currentEmployee.getPhoneNumber();
                String updateDepartment = department != null ? department : currentEmployee.getDepartment();
                String updatePosition = position != null ? position : currentEmployee.getPosition();
                double updateSalary = salary != null ? salary : currentEmployee.getSalary();
                WorkStatus updateWorkStatus = workStatus != null ? workStatus : currentEmployee.getWorkStatus();
                
                Employee updatedEmployee = employeeManager.updateEmployee(employeeId, updateFirstName, updateLastName, 
                                                                         updateEmail, updatePhone, updateDepartment, 
                                                                         updatePosition, updateSalary, 
                                                                         currentEmployee.getHireDate(), updateWorkStatus);
                
                System.out.printf("✅ Employee '%s %s' (ID: %d) updated successfully%n", 
                    updatedEmployee.getFirstName(), updatedEmployee.getLastName(), employeeId);
                System.out.printf("📝 Updated details: Email: %s | Department: %s | Position: %s | Salary: $%.2f | Status: %s%n", 
                    updatedEmployee.getEmail(), updatedEmployee.getDepartment(), updatedEmployee.getPosition(), 
                    updatedEmployee.getSalary(), updatedEmployee.getWorkStatus());
            } catch (EmployeeNotFoundException e) {
                System.err.printf("❌ Employee not found: %s%n", e.getMessage());
            } catch (Exception e) {
                System.err.printf("❌ Error updating employee: %s%n", e.getMessage());
            }
        }
    }

    @Component
    @Command(name = "remove", description = "Remove an employee")
    public static class RemoveEmployeeCommand implements Runnable {
        
        @Autowired
        public EmployeeManager employeeManager;

        @Parameters(index = "0", description = "Employee ID to remove")
        public int employeeId;

        public void setEmployeeManager(EmployeeManager employeeManager) {
            this.employeeManager = employeeManager;
        }

        @Override
        public void run() {
            try {
                Employee removedEmployee = employeeManager.deleteEmployee(employeeId);
                System.out.printf("✅ Employee '%s %s' (ID: %d) removed successfully%n", 
                    removedEmployee.getFirstName(), removedEmployee.getLastName(), employeeId);
            } catch (EmployeeNotFoundException e) {
                System.err.printf("❌ Employee not found: %s%n", e.getMessage());
            } catch (Exception e) {
                System.err.printf("❌ Error removing employee: %s%n", e.getMessage());
            }
        }
    }

    @Component
    @Command(name = "list", description = "List all employees")
    public static class ListEmployeesCommand implements Runnable {
        
        @Autowired
        public EmployeeManager employeeManager;

        public void setEmployeeManager(EmployeeManager employeeManager) {
            this.employeeManager = employeeManager;
        }

        @Override
        public void run() {
            var employees = employeeManager.listAllEmployees();
            if (employees.isEmpty()) {
                System.out.println("📝 No employees found");
            } else {
                System.out.println("👥 All Employees:");
                System.out.println("═".repeat(80));
                employees.forEach(employee -> {
                    System.out.printf("ID: %d | Name: %s %s | Dept: %s | Position: %s | Status: %s%n",
                        employee.getEmployeeId(),
                        employee.getFirstName(),
                        employee.getLastName(),
                        employee.getDepartment(),
                        employee.getPosition(),
                        employee.getWorkStatus());
                });
            }
        }
    }

    @Component
    @Command(name = "get", description = "Get employee details")
    public static class GetEmployeeCommand implements Runnable {
        
        @Autowired
        public EmployeeManager employeeManager;

        @Parameters(index = "0", description = "Employee ID")
        public int employeeId;

        public void setEmployeeManager(EmployeeManager employeeManager) {
            this.employeeManager = employeeManager;
        }

        @Override
        public void run() {
            try {
                Employee employee = employeeManager.getEmployeeById(employeeId);
                System.out.println("👤 Employee Details:");
                System.out.println("═".repeat(50));
                System.out.printf("ID: %d%n", employee.getEmployeeId());
                System.out.printf("Name: %s %s%n", employee.getFirstName(), employee.getLastName());
                System.out.printf("Email: %s%n", employee.getEmail());
                System.out.printf("Phone: %s%n", employee.getPhoneNumber());
                System.out.printf("Department: %s%n", employee.getDepartment());
                System.out.printf("Position: %s%n", employee.getPosition());
                System.out.printf("Salary: $%.2f%n", employee.getSalary());
                System.out.printf("Work Status: %s%n", employee.getWorkStatus());
                System.out.printf("Hire Date: %s%n", employee.getHireDate());
                System.out.printf("Years of Service: %d%n", employee.getYearsOfService());
            } catch (EmployeeNotFoundException e) {
                System.err.printf("❌ Employee not found: %s%n", e.getMessage());
            } catch (Exception e) {
                System.err.printf("❌ Error getting employee: %s%n", e.getMessage());
            }
        }
    }
}

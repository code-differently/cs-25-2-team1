package com.codedifferently.cs_252_team1.fitnessManagementApp;

import java.time.LocalDate;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class EmployeeTest{
    @Test
     public void testGetEmployeeID() {
        //arrange
      Employee employee = new Employee(
        1,
         LocalDate.of(2025, 9, 18),
         Employee.workStatus.ACTIVE,
         "Mattie",
         "Weathersby",
         "mattie@email.com",
         "302000000",
         50000.00,
         "Management",
         "Assistant Manager");
        //act
        int employeeId = employee.getEmployeeId();
     //assert
     assertEquals(1, employeeId);
    } 
    
}
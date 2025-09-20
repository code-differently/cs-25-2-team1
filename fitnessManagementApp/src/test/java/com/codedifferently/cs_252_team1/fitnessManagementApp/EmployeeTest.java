package com.codedifferently.cs_252_team1.fitnessManagementApp;

import java.time.LocalDate;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import static org.junit.jupiter.api.Assertions.*;

public class EmployeeTest {
    private Employee employee;

    @BeforeEach
    public void setUp() {
        employee = new Employee(
            1,
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
    public void testGetEmployeeID() {
        // act
        int employeeId = employee.getEmployeeId();
        
        // assert
        assertEquals(1, employeeId);
    } 

    @Test
    public void testGetFirstName() {
        // act
        String firstName = employee.getFirstName();

        // assert
        assertEquals("Mattie", firstName);
    }

    @Test
    public void testGetLastName() {
        // act
        String lastName = employee.getLastName();

        // assert
        assertEquals("Weathersby", lastName);
    }

    @Test
    public void testGetEmail() {
        // act
        String email = employee.getEmail();

        // assert
        assertEquals("mattie@email.com", email);
    }

    @Test
    public void testGetPhoneNumber() {
        // act
        String phoneNumber = employee.getPhoneNumber();

        // assert
        assertEquals("302000000", phoneNumber);
    }

    @Test
    public void testGetDepartment() {
        // act
        String department = employee.getDepartment();

        // assert
        assertEquals("Management", department);
    }

    @Test
    public void testGetPosition() {
        // act
        String position = employee.getPosition();

        // assert
        assertEquals("Assistant Manager", position);
    }

    @Test
    public void testGetSalary() {
        // act
        double salary = employee.getSalary();

        // assert
        assertEquals(50000.00, salary, 0.01);
    }

    @Test
    public void testGetHireDate() {
        // act
        LocalDate hireDate = employee.getHireDate();

        // assert
        assertEquals(LocalDate.of(2025, 9, 18), hireDate);
    }

    @Test
    public void testGetWorkStatus() {
        // act
        WorkStatus workStatus = employee.getWorkStatus();

        // assert
        assertEquals(WorkStatus.ACTIVE, workStatus);
    }

    @Test
    public void testGetFullName() {
        // act
        String fullName = employee.getFullName();

        // assert
        assertEquals("Mattie Weathersby", fullName);
    }

    @Test
    public void testGetYearsOfService() {
        // arrange
        Employee currentEmployee = new Employee(
            1,
            "John",
            "Doe",
            "john@email.com",
            "123456789",
            "IT",
            "Developer",
            60000.00,
            LocalDate.now().minusYears(2),
            WorkStatus.ACTIVE
        );

        // act
        long yearsOfService = currentEmployee.getYearsOfService();

        // assert
        assertEquals(2, yearsOfService);
    }

    @Test
    public void testIsActive() {
        // act
        boolean isActive = employee.isActive();

        // assert
        assertTrue(isActive);
    }

    @Test
    public void testIsActiveWithInactiveStatus() {
        // arrange
        employee.setWorkStatus(WorkStatus.INACTIVE);

        // act
        boolean isActive = employee.isActive();

        // assert
        assertFalse(isActive);
    }

    @Test
    public void testSetFirstName() {
        // act
        employee.setFirstName("John");

        // assert
        assertEquals("John", employee.getFirstName());
    }

    @Test
    public void testSetFirstNameThrowsExceptionForInvalidName() {
        // act & assert
        assertThrows(IllegalArgumentException.class, () -> {
            employee.setFirstName("A");
        });
    }

    @Test
    public void testSetLastName() {
        // act
        employee.setLastName("Smith");

        // assert
        assertEquals("Smith", employee.getLastName());
    }

    @Test
    public void testSetLastNameThrowsExceptionForInvalidName() {
        // act & assert
        assertThrows(IllegalArgumentException.class, () -> {
            employee.setLastName("B");
        });
    }

    @Test
    public void testSetSalary() {
        // act
        employee.setSalary(75000.00);

        // assert
        assertEquals(75000.00, employee.getSalary(), 0.01);
    }

    @Test
    public void testSetSalaryThrowsExceptionForNegativeValue() {
        // act & assert
        assertThrows(IllegalArgumentException.class, () -> {
            employee.setSalary(-1000.00);
        });
    }

    @Test
    public void testUpdateSalary() {
        // act
        employee.updateSalary(80000.00);

        // assert
        assertEquals(80000.00, employee.getSalary(), 0.01);
    }

    @Test
    public void testDeactivate() {
        // act
        employee.deactivate();

        // assert
        assertEquals(WorkStatus.INACTIVE, employee.getWorkStatus());
        assertFalse(employee.isActive());
    }

    @Test
    public void testActivate() {
        // arrange
        employee.setWorkStatus(WorkStatus.INACTIVE);

        // act
        employee.activate();

        // assert
        assertEquals(WorkStatus.ACTIVE, employee.getWorkStatus());
        assertTrue(employee.isActive());
    }

    @Test
    public void testTerminate() {
        // act
        employee.terminate();

        // assert
        assertEquals(WorkStatus.TERMINATED, employee.getWorkStatus());
        assertFalse(employee.isActive());
    }

    @Test
    public void testPutOnLeave() {
        // act
        employee.putOnLeave();

        // assert
        assertEquals(WorkStatus.ON_LEAVE, employee.getWorkStatus());
        assertFalse(employee.isActive());
    }

    @Test
    public void testToString() {
        // act
        String result = employee.toString();

        // assert
        assertEquals("Mattie Weathersby - Assistant Manager in Management (ACTIVE)", result);
    }

    @Test
    public void testEquals() {
        // arrange
        Employee sameEmployee = new Employee(
            1,
            "Different",
            "Name",
            "different@email.com",
            "999999999",
            "Different Dept",
            "Different Position",
            40000.00,
            LocalDate.now(),
            WorkStatus.INACTIVE
        );

        Employee differentEmployee = new Employee(
            2,
            "John",
            "Doe",
            "john@email.com",
            "123456789",
            "IT",
            "Developer",
            60000.00,
            LocalDate.now(),
            WorkStatus.ACTIVE
        );

        // act & assert
        assertEquals(employee, sameEmployee); // Same ID
        assertNotEquals(employee, differentEmployee); // Different ID
        assertNotEquals(employee, null);
        assertNotEquals(employee, "Not an Employee");
    }

    @Test
    public void testHashCode() {
        // arrange
        Employee sameEmployee = new Employee(
            1,
            "Different",
            "Name",
            "different@email.com",
            "999999999",
            "Different Dept",
            "Different Position",
            40000.00,
            LocalDate.now(),
            WorkStatus.INACTIVE
        );

        // act & assert
        assertEquals(employee.hashCode(), sameEmployee.hashCode());
    }

    @Test
    public void testDefaultConstructor() {
        // arrange
        Employee defaultEmployee = new Employee();

        // act & assert
        assertEquals(0, defaultEmployee.getEmployeeId());
        assertEquals("", defaultEmployee.getFirstName());
        assertEquals("", defaultEmployee.getLastName());
        assertEquals("", defaultEmployee.getEmail());
        assertEquals("", defaultEmployee.getPhoneNumber());
        assertEquals(0.0, defaultEmployee.getSalary(), 0.01);
        assertEquals("", defaultEmployee.getDepartment());
        assertEquals("", defaultEmployee.getPosition());
        assertEquals(WorkStatus.ACTIVE, defaultEmployee.getWorkStatus());
        assertEquals(LocalDate.now(), defaultEmployee.getHireDate());
    }
}
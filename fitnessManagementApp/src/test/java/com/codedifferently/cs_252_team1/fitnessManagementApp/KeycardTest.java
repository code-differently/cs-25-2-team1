package com.codedifferently.cs_252_team1.fitnessManagementApp;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class KeycardTest {
    
    private Member testMember;
    private Employee testEmployee;
    private KeyCard memberKeycard;
    private KeyCard employeeKeycard;
    
    @BeforeEach
    public void setUp() {
        // Create test member
        testMember = new Member();
        testMember.setFirstName("John");
        testMember.setLastName("Doe");
        testMember.setEmail("john.doe@email.com");
        testMember.setPhoneNumber("555-1234");
        
        // Create test employee
        testEmployee = new Employee();
        testEmployee.setFirstName("Jane");
        testEmployee.setLastName("Smith");
        testEmployee.setEmail("jane.smith@fitness.com");
        testEmployee.setPhoneNumber("555-0123");
        
        // Create test keycards
        memberKeycard = new KeyCard("MEM12345", testMember, LocalDate.now().plusYears(1));
        employeeKeycard = new KeyCard("EMP67890", testEmployee, LocalDate.now().plusYears(2));
    }
    
    @Test
    public void testKeycardCreation() {
        // Test member keycard creation using setup objects
        assertNotNull(memberKeycard);
        assertEquals("MEM12345", memberKeycard.getCardNumber());
        assertEquals("John Doe", memberKeycard.getCardHolderName());
        assertTrue(memberKeycard.isMemberCard());
        assertFalse(memberKeycard.isEmployeeCard());
    }

    @Test
    public void testKeycardAccess() {
        // Test keycard access using setup objects
        assertTrue(memberKeycard.isValid());
        assertTrue(memberKeycard.isActive());
        assertTrue(employeeKeycard.isValid());
        assertTrue(employeeKeycard.isActive());
    }

    @Test
    public void testKeycardRevocation() {
        // Initially should be valid
        assertTrue(memberKeycard.isValid());
        
        // Deactivate the card (equivalent to revoking access)
        memberKeycard.deactivate();
        assertFalse(memberKeycard.isValid());
        assertFalse(memberKeycard.isActive());
    }

    @Test
    public void testEmployeeKeycardCreation() {
        // Test employee keycard creation using setup objects
        assertNotNull(employeeKeycard);
        assertEquals("EMP67890", employeeKeycard.getCardNumber());
        assertEquals("Jane Smith", employeeKeycard.getCardHolderName());
        assertEquals("jane.smith@fitness.com", employeeKeycard.getCardHolderEmail());
        assertEquals("555-0123", employeeKeycard.getCardHolderPhone());
        assertTrue(employeeKeycard.isEmployeeCard());
        assertFalse(employeeKeycard.isMemberCard());
        assertEquals(KeyCardType.EMPLOYEE, employeeKeycard.getCardType());
    }

    @Test
    public void testMemberKeycardCreation() {
        // Test member keycard creation using setup objects
        assertNotNull(memberKeycard);
        assertEquals("MEM12345", memberKeycard.getCardNumber());
        assertEquals("John Doe", memberKeycard.getCardHolderName());
        assertEquals("john.doe@email.com", memberKeycard.getCardHolderEmail());
        assertEquals("555-1234", memberKeycard.getCardHolderPhone());
        assertTrue(memberKeycard.isMemberCard());
        assertFalse(memberKeycard.isEmployeeCard());
        assertEquals(KeyCardType.MEMBER, memberKeycard.getCardType());
    }

    @Test
    public void testKeycardExpiration() {
        Member member = new Member();
        member.setFirstName("Alice");
        member.setLastName("Brown");
        
        // Create keycard that expires yesterday
        LocalDate yesterday = LocalDate.now().minusDays(1);
        KeyCard expiredCard = new KeyCard("12345", member, yesterday);
        
        assertTrue(expiredCard.isExpired());
        assertFalse(expiredCard.isValid()); // Should be invalid because it's expired
        assertTrue(expiredCard.isActive()); // Still active, but expired
        
        // Create keycard that expires tomorrow
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        KeyCard validCard = new KeyCard("54321", member, tomorrow);
        
        assertFalse(validCard.isExpired());
        assertTrue(validCard.isValid()); // Should be valid
        assertTrue(validCard.isActive());
    }

    @Test
    public void testKeycardActivationDeactivation() {
        // Initially active and valid
        assertTrue(employeeKeycard.isActive());
        assertTrue(employeeKeycard.isValid());
        
        // Deactivate
        employeeKeycard.deactivate();
        assertFalse(employeeKeycard.isActive());
        assertFalse(employeeKeycard.isValid());
        
        // Reactivate
        employeeKeycard.activate();
        assertTrue(employeeKeycard.isActive());
        assertTrue(employeeKeycard.isValid());
    }

    @Test
    public void testAccessRecording() {
        // Initially no access recorded
        assertEquals(null, memberKeycard.getLastAccessTime());
        assertEquals(null, memberKeycard.getLastAccessLocation());
        
        // Record access
        memberKeycard.recordAccess("Main Entrance");
        
        assertNotNull(memberKeycard.getLastAccessTime());
        assertEquals("Main Entrance", memberKeycard.getLastAccessLocation());
        
        // Record another access
        memberKeycard.recordAccess("Gym Floor");
        assertEquals("Gym Floor", memberKeycard.getLastAccessLocation());
    }

    @Test
    public void testExpirationExtension() {
        Member member = new Member();
        member.setFirstName("Eva");
        member.setLastName("Davis");
        
        LocalDate initialExpiration = LocalDate.now().plusMonths(6);
        KeyCard keycard = new KeyCard("22222", member, initialExpiration);
        
        assertEquals(initialExpiration, keycard.getExpirationDate());
        
        // Extend expiration by 3 months
        keycard.extendExpiration(3);
        LocalDate expectedNewExpiration = initialExpiration.plusMonths(3);
        
        assertEquals(expectedNewExpiration, keycard.getExpirationDate());
    }

    @Test
    public void testDefaultConstructor() {
        KeyCard keycard = new KeyCard();
        
        assertNotNull(keycard);
        assertTrue(keycard.isActive());
        assertEquals(KeyCardType.EMPLOYEE, keycard.getCardType());
        assertEquals(LocalDate.now(), keycard.getIssueDate());
        assertEquals("Unknown", keycard.getCardHolderName());
        assertEquals(null, keycard.getCardHolderEmail());
        assertEquals(null, keycard.getCardHolderPhone());
    }

    @Test
    public void testNullExpirationDate() {
        Member member = new Member();
        member.setFirstName("Null");
        member.setLastName("Test");
        
        // Pass null expiration date - should default to 1 year from now
        KeyCard keycard = new KeyCard("NULL001", member, null);
        
        assertNotNull(keycard.getExpirationDate());
        LocalDate expectedExpiration = LocalDate.now().plusYears(1);
        assertEquals(expectedExpiration, keycard.getExpirationDate());
    }
}
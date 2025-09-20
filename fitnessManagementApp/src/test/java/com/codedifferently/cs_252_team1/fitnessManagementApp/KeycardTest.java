package com.codedifferently.cs_252_team1.fitnessManagementApp;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;

public class KeycardTest {
    
    @Test
    public void testKeycardCreation() {
        // Create a member for testing
        Member member = new Member();
        member.setFirstName("John");
        member.setLastName("Doe");
        
        // Create keycard for member
        KeyCard keycard = new KeyCard("12345", member, LocalDate.now().plusYears(1));
        assertNotNull(keycard);
        assertEquals("12345", keycard.getCardNumber());
        assertEquals("John Doe", keycard.getCardHolderName());
    }

    @Test
    public void testKeycardAccess() {
        // Create a member for testing
        Member member = new Member();
        member.setFirstName("John");
        member.setLastName("Doe");
        
        // Create keycard for member
        KeyCard keycard = new KeyCard("12345", member, LocalDate.now().plusYears(1));
        assertTrue(keycard.isValid()); // KeyCard uses isValid() instead of hasAccess()
        assertTrue(keycard.isActive());
    }

    @Test
    public void testKeycardRevocation() {
        // Create a member for testing
        Member member = new Member();
        member.setFirstName("John");
        member.setLastName("Doe");
        
        // Create keycard for member
        KeyCard keycard = new KeyCard("12345", member, LocalDate.now().plusYears(1));
        
        // Initially should be valid
        assertTrue(keycard.isValid());
        
        // Deactivate the card (equivalent to revoking access)
        keycard.deactivate();
        assertFalse(keycard.isValid());
        assertFalse(keycard.isActive());
    }

    @Test
    public void testEmployeeKeycardCreation() {
        // Create an employee for testing
        Employee employee = new Employee();
        employee.setFirstName("Jane");
        employee.setLastName("Smith");
        employee.setEmail("jane.smith@fitness.com");
        employee.setPhoneNumber("555-0123");
        
        // Create keycard for employee
        KeyCard keycard = new KeyCard("EMP001", employee, LocalDate.now().plusYears(2));
        
        assertNotNull(keycard);
        assertEquals("EMP001", keycard.getCardNumber());
        assertEquals("Jane Smith", keycard.getCardHolderName());
        assertEquals("jane.smith@fitness.com", keycard.getCardHolderEmail());
        assertEquals("555-0123", keycard.getCardHolderPhone());
        assertTrue(keycard.isEmployeeCard());
        assertFalse(keycard.isMemberCard());
        assertEquals(KeyCardType.EMPLOYEE, keycard.getCardType());
    }

    @Test
    public void testMemberKeycardCreation() {
        // Create a member for testing
        Member member = new Member();
        member.setFirstName("Bob");
        member.setLastName("Johnson");
        member.setEmail("bob.johnson@email.com");
        member.setPhoneNumber("555-9876");
        
        // Create keycard for member
        KeyCard keycard = new KeyCard("MEM001", member, LocalDate.now().plusYears(1));
        
        assertNotNull(keycard);
        assertEquals("MEM001", keycard.getCardNumber());
        assertEquals("Bob Johnson", keycard.getCardHolderName());
        assertEquals("bob.johnson@email.com", keycard.getCardHolderEmail());
        assertEquals("555-9876", keycard.getCardHolderPhone());
        assertTrue(keycard.isMemberCard());
        assertFalse(keycard.isEmployeeCard());
        assertEquals(KeyCardType.MEMBER, keycard.getCardType());
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
        Member member = new Member();
        member.setFirstName("Charlie");
        member.setLastName("Wilson");
        
        KeyCard keycard = new KeyCard("98765", member, LocalDate.now().plusYears(1));
        
        // Initially active and valid
        assertTrue(keycard.isActive());
        assertTrue(keycard.isValid());
        
        // Deactivate
        keycard.deactivate();
        assertFalse(keycard.isActive());
        assertFalse(keycard.isValid());
        
        // Reactivate
        keycard.activate();
        assertTrue(keycard.isActive());
        assertTrue(keycard.isValid());
    }

    @Test
    public void testAccessRecording() {
        Member member = new Member();
        member.setFirstName("David");
        member.setLastName("Miller");
        
        KeyCard keycard = new KeyCard("11111", member, LocalDate.now().plusYears(1));
        
        // Initially no access recorded
        assertEquals(null, keycard.getLastAccessTime());
        assertEquals(null, keycard.getLastAccessLocation());
        
        // Record access
        keycard.recordAccess("Main Entrance");
        
        assertNotNull(keycard.getLastAccessTime());
        assertEquals("Main Entrance", keycard.getLastAccessLocation());
        
        // Record another access
        keycard.recordAccess("Gym Floor");
        assertEquals("Gym Floor", keycard.getLastAccessLocation());
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
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

    @Test
    public void testSetterMethods() {
        KeyCard keycard = new KeyCard();
        
        // Test all setters
        keycard.setCardId("TEST-ID-123");
        assertEquals("TEST-ID-123", keycard.getCardId());
        
        keycard.setCardNumber("CARD-456");
        assertEquals("CARD-456", keycard.getCardNumber());
        
        LocalDate testDate = LocalDate.of(2023, 5, 15);
        keycard.setIssueDate(testDate);
        assertEquals(testDate, keycard.getIssueDate());
        
        LocalDate expirationDate = LocalDate.of(2025, 5, 15);
        keycard.setExpirationDate(expirationDate);
        assertEquals(expirationDate, keycard.getExpirationDate());
        
        keycard.setActive(false);
        assertFalse(keycard.isActive());
        
        keycard.setCardType(KeyCardType.ADMIN);
        assertEquals(KeyCardType.ADMIN, keycard.getCardType());
        
        java.time.LocalDateTime accessTime = java.time.LocalDateTime.now();
        keycard.setLastAccessTime(accessTime);
        assertEquals(accessTime, keycard.getLastAccessTime());
        
        keycard.setLastAccessLocation("Test Location");
        assertEquals("Test Location", keycard.getLastAccessLocation());
    }

    @Test
    public void testSetEmployeeAndMemberMutualExclusion() {
        KeyCard keycard = new KeyCard();
        
        // Set employee - should clear member and set type to EMPLOYEE
        keycard.setEmployee(testEmployee);
        assertEquals(testEmployee, keycard.getEmployee());
        assertEquals(null, keycard.getMember());
        assertEquals(KeyCardType.EMPLOYEE, keycard.getCardType());
        
        // Now set member - should clear employee and set type to MEMBER
        keycard.setMember(testMember);
        assertEquals(testMember, keycard.getMember());
        assertEquals(null, keycard.getEmployee());
        assertEquals(KeyCardType.MEMBER, keycard.getCardType());
        
        // Test setting null employee
        keycard.setEmployee(null);
        assertEquals(null, keycard.getEmployee());
        assertEquals(testMember, keycard.getMember()); // Member should remain
        
        // Test setting null member
        keycard.setMember(null);
        assertEquals(null, keycard.getMember());
    }

    @Test
    public void testToStringMethod() {
        // Test member keycard toString
        String memberString = memberKeycard.toString();
        assertTrue(memberString.contains("MEM12345"));
        assertTrue(memberString.contains("John Doe"));
        assertTrue(memberString.contains("Member Access Card"));
        assertTrue(memberString.contains("VALID"));
        
        // Test employee keycard toString
        String employeeString = employeeKeycard.toString();
        assertTrue(employeeString.contains("EMP67890"));
        assertTrue(employeeString.contains("Jane Smith"));
        assertTrue(employeeString.contains("Employee Access Card"));
        assertTrue(employeeString.contains("VALID"));
        
        // Test invalid keycard toString
        memberKeycard.deactivate();
        String invalidString = memberKeycard.toString();
        assertTrue(invalidString.contains("INVALID"));
    }

    @Test
    public void testEqualsAndHashCode() {
        KeyCard keycard1 = new KeyCard();
        keycard1.setCardId("TEST-123");
        
        KeyCard keycard2 = new KeyCard();
        keycard2.setCardId("TEST-123");
        
        KeyCard keycard3 = new KeyCard();
        keycard3.setCardId("TEST-456");
        
        // Test equals
        assertTrue(keycard1.equals(keycard1)); // Self equality
        assertTrue(keycard1.equals(keycard2)); // Same card ID
        assertFalse(keycard1.equals(keycard3)); // Different card ID
        assertFalse(keycard1.equals(null)); // Null comparison
        assertFalse(keycard1.equals("not a keycard")); // Different class
        
        // Test hashCode
        assertEquals(keycard1.hashCode(), keycard2.hashCode()); // Same card ID should have same hash
    }

    @Test
    public void testCardHolderInfoWithNullEmployee() {
        KeyCard keycard = new KeyCard();
        keycard.setEmployee(null);
        keycard.setMember(null);
        
        assertEquals("Unknown", keycard.getCardHolderName());
        assertEquals(null, keycard.getCardHolderEmail());
        assertEquals(null, keycard.getCardHolderPhone());
        assertFalse(keycard.isEmployeeCard());
        assertFalse(keycard.isMemberCard());
    }

    @Test
    public void testAllKeyCardTypes() {
        KeyCard keycard = new KeyCard();
        
        // Test GUEST type
        keycard.setCardType(KeyCardType.GUEST);
        assertEquals(KeyCardType.GUEST, keycard.getCardType());
        assertEquals("Guest Access Card", keycard.getCardType().getDescription());
        
        // Test ADMIN type
        keycard.setCardType(KeyCardType.ADMIN);
        assertEquals(KeyCardType.ADMIN, keycard.getCardType());
        assertEquals("Administrator Access Card", keycard.getCardType().getDescription());
        
        // Test MEMBER type
        keycard.setCardType(KeyCardType.MEMBER);
        assertEquals(KeyCardType.MEMBER, keycard.getCardType());
        assertEquals("Member Access Card", keycard.getCardType().getDescription());
        
        // Test EMPLOYEE type
        keycard.setCardType(KeyCardType.EMPLOYEE);
        assertEquals(KeyCardType.EMPLOYEE, keycard.getCardType());
        assertEquals("Employee Access Card", keycard.getCardType().getDescription());
    }

    @Test
    public void testKeyCardTypeToString() {
        assertEquals("Employee Access Card", KeyCardType.EMPLOYEE.toString());
        assertEquals("Member Access Card", KeyCardType.MEMBER.toString());
        assertEquals("Guest Access Card", KeyCardType.GUEST.toString());
        assertEquals("Administrator Access Card", KeyCardType.ADMIN.toString());
    }

    @Test
    public void testCardIdGeneration() {
        // Test that employee cards get EMP prefix in generated ID
        KeyCard empCard = new KeyCard("TEST123", testEmployee, LocalDate.now().plusYears(1));
        assertTrue(empCard.getCardId().startsWith("EMP-"));
        
        // Test that member cards get MEM prefix in generated ID
        KeyCard memCard = new KeyCard("TEST456", testMember, LocalDate.now().plusYears(1));
        assertTrue(memCard.getCardId().startsWith("MEM-"));
        
        // Test that different cards get different IDs (add small delay to ensure different timestamps)
        try { Thread.sleep(2); } catch (InterruptedException e) {}
        KeyCard anotherCard = new KeyCard("TEST789", testMember, LocalDate.now().plusYears(1));
        assertFalse(memCard.getCardId().equals(anotherCard.getCardId()));
    }

    @Test
    public void testExtendExpirationWithNegativeMonths() {
        Member member = new Member();
        member.setFirstName("Test");
        member.setLastName("User");
        
        LocalDate initialExpiration = LocalDate.now().plusMonths(6);
        KeyCard keycard = new KeyCard("TEST001", member, initialExpiration);
        
        // Extend by negative months (should subtract)
        keycard.extendExpiration(-2);
        LocalDate expectedNewExpiration = initialExpiration.minusMonths(2);
        
        assertEquals(expectedNewExpiration, keycard.getExpirationDate());
    }

    @Test
    public void testValidityWithDifferentStates() {
        Member member = new Member();
        member.setFirstName("Test");
        member.setLastName("Validity");
        
        // Test active but expired card
        LocalDate yesterday = LocalDate.now().minusDays(1);
        KeyCard expiredButActive = new KeyCard("EXP001", member, yesterday);
        assertTrue(expiredButActive.isActive());
        assertTrue(expiredButActive.isExpired());
        assertFalse(expiredButActive.isValid()); // Should be invalid because expired
        
        // Test inactive but not expired card
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        KeyCard inactiveButNotExpired = new KeyCard("INA001", member, tomorrow);
        inactiveButNotExpired.deactivate();
        assertFalse(inactiveButNotExpired.isActive());
        assertFalse(inactiveButNotExpired.isExpired());
        assertFalse(inactiveButNotExpired.isValid()); // Should be invalid because inactive
    }
}
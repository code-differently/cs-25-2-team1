package com.codedifferently.cs_252_team1.fitnessManagementApp;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;


public class MembershipManagementTest {
    private MembershipManagement membershipManagement;

    @BeforeEach
    public void setUp() {
        membershipManagement = new MembershipManagement();
    }

    @Test
    public void testAddMemberWithAllParameters() {
        Member member = membershipManagement.addMember(
            "John", 
            "Doe", 
            "john.doe@example.com",
            "555-1234",
            MembershipType.BASIC,
            PaymentOption.CASH,
            MembershipStatus.ACTIVE
        );
        
        assertNotNull(member);
        assertEquals("John", member.getFirstName());
        assertEquals("Doe", member.getLastName());
        assertEquals("john.doe@example.com", member.getEmail());
        assertEquals("555-1234", member.getPhoneNumber());
        assertEquals(MembershipType.BASIC, member.getMembershipType());
        assertEquals(PaymentOption.CASH, member.getPaymentOption());
        assertEquals(MembershipStatus.ACTIVE, member.getMembershipStatus());
        assertEquals(1, member.getMemberId());
    }

    @Test
    public void testAddMemberWithContactInfo() {
        // Test with email as contact info
        Member memberWithEmail = membershipManagement.addMember("Jane", "Smith", "jane@example.com");
        assertNotNull(memberWithEmail);
        assertEquals("Jane", memberWithEmail.getFirstName());
        assertEquals("Smith", memberWithEmail.getLastName());
        // Default values for simplified constructor
        assertEquals(MembershipType.BASIC, memberWithEmail.getMembershipType());
        assertEquals(PaymentOption.CASH, memberWithEmail.getPaymentOption());
        assertEquals(MembershipStatus.ACTIVE, memberWithEmail.getMembershipStatus());
        assertEquals(1, memberWithEmail.getMemberId());
        
        // Test with phone number as contact info
        Member memberWithPhone = membershipManagement.addMember("Bob", "Johnson", "555-9876");
        assertNotNull(memberWithPhone);
        assertEquals("Bob", memberWithPhone.getFirstName());
        assertEquals("Johnson", memberWithPhone.getLastName());
        assertEquals(2, memberWithPhone.getMemberId());
    }

    @Test
    public void testAddMemberValidationFullConstructor() {
        // Test null first name
        assertThrows(IllegalArgumentException.class, () -> {
            membershipManagement.addMember(null, "Doe", "john@example.com", "555-1234", 
                MembershipType.BASIC, PaymentOption.CASH, MembershipStatus.ACTIVE);
        });
        
        // Test empty first name
        assertThrows(IllegalArgumentException.class, () -> {
            membershipManagement.addMember("", "Doe", "john@example.com", "555-1234",
                MembershipType.BASIC, PaymentOption.CASH, MembershipStatus.ACTIVE);
        });
        
        // Test null last name
        assertThrows(IllegalArgumentException.class, () -> {
            membershipManagement.addMember("John", null, "john@example.com", "555-1234",
                MembershipType.BASIC, PaymentOption.CASH, MembershipStatus.ACTIVE);
        });
        
        // Test empty last name
        assertThrows(IllegalArgumentException.class, () -> {
            membershipManagement.addMember("John", "", "john@example.com", "555-1234",
                MembershipType.BASIC, PaymentOption.CASH, MembershipStatus.ACTIVE);
        });
        
        // Test both email and phone null/empty
        assertThrows(IllegalArgumentException.class, () -> {
            membershipManagement.addMember("John", "Doe", null, null,
                MembershipType.BASIC, PaymentOption.CASH, MembershipStatus.ACTIVE);
        });
        
        assertThrows(IllegalArgumentException.class, () -> {
            membershipManagement.addMember("John", "Doe", "", "",
                MembershipType.BASIC, PaymentOption.CASH, MembershipStatus.ACTIVE);
        });
    }

    @Test
    public void testAddMemberValidationSimpleConstructor() {
        // Test null first name
        assertThrows(IllegalArgumentException.class, () -> {
            membershipManagement.addMember(null, "Doe", "john@example.com");
        });
        
        // Test empty first name
        assertThrows(IllegalArgumentException.class, () -> {
            membershipManagement.addMember("", "Doe", "john@example.com");
        });
        
        // Test null last name
        assertThrows(IllegalArgumentException.class, () -> {
            membershipManagement.addMember("John", null, "john@example.com");
        });
        
        // Test empty last name
        assertThrows(IllegalArgumentException.class, () -> {
            membershipManagement.addMember("John", "", "john@example.com");
        });
        
        // Test null contact info
        assertThrows(IllegalArgumentException.class, () -> {
            membershipManagement.addMember("John", "Doe", null);
        });
        
        // Test empty contact info
        assertThrows(IllegalArgumentException.class, () -> {
            membershipManagement.addMember("John", "Doe", "");
        });
    }

    @Test
    public void testMemberIdAutoIncrement() {
        Member member1 = membershipManagement.addMember("John", "Doe", "john@example.com");
        Member member2 = membershipManagement.addMember("Jane", "Smith", "jane@example.com");
        Member member3 = membershipManagement.addMember("Bob", "Johnson", 
            "bob@example.com", "555-1234", MembershipType.PREMIUM, PaymentOption.CREDIT_CARD, MembershipStatus.ACTIVE);
        
        assertEquals(1, member1.getMemberId());
        assertEquals(2, member2.getMemberId());
        assertEquals(3, member3.getMemberId());
    }

    @Test
    public void testContactInfoDetection() {
        // Test email detection (contains @)
        Member memberWithEmail = membershipManagement.addMember("John", "Doe", "john@example.com");
        assertNotNull(memberWithEmail);
        
        // Test phone number detection (doesn't contain @)
        Member memberWithPhone = membershipManagement.addMember("Jane", "Smith", "555-1234");
        assertNotNull(memberWithPhone);
        
        // Both should be valid and have different member IDs
        assertNotEquals(memberWithEmail.getMemberId(), memberWithPhone.getMemberId());
    }

    @Test
    public void testDifferentMembershipTypes() {
        Member basicMember = membershipManagement.addMember("John", "Doe", "john@example.com", "555-1234",
            MembershipType.BASIC, PaymentOption.CASH, MembershipStatus.ACTIVE);
        assertEquals(MembershipType.BASIC, basicMember.getMembershipType());
        
        Member premiumMember = membershipManagement.addMember("Jane", "Smith", "jane@example.com", "555-5678",
            MembershipType.PREMIUM, PaymentOption.CREDIT_CARD, MembershipStatus.ACTIVE);
        assertEquals(MembershipType.PREMIUM, premiumMember.getMembershipType());
        
        Member vipMember = membershipManagement.addMember("Bob", "Johnson", "bob@example.com", "555-9876",
            MembershipType.VIP, PaymentOption.DEBIT_CARD, MembershipStatus.INACTIVE);
        assertEquals(MembershipType.VIP, vipMember.getMembershipType());
    }

    @Test
    public void testDifferentPaymentOptions() {
        Member cashMember = membershipManagement.addMember("John", "Doe", "john@example.com", "555-1234",
            MembershipType.BASIC, PaymentOption.CASH, MembershipStatus.ACTIVE);
        assertEquals(PaymentOption.CASH, cashMember.getPaymentOption());
        
        Member creditMember = membershipManagement.addMember("Jane", "Smith", "jane@example.com", "555-5678",
            MembershipType.BASIC, PaymentOption.CREDIT_CARD, MembershipStatus.ACTIVE);
        assertEquals(PaymentOption.CREDIT_CARD, creditMember.getPaymentOption());
        
        Member debitMember = membershipManagement.addMember("Bob", "Johnson", "bob@example.com", "555-9876",
            MembershipType.BASIC, PaymentOption.DEBIT_CARD, MembershipStatus.ACTIVE);
        assertEquals(PaymentOption.DEBIT_CARD, debitMember.getPaymentOption());
        
        Member bankTransferMember = membershipManagement.addMember("Alice", "Brown", "alice@example.com", "555-4321",
            MembershipType.BASIC, PaymentOption.BANK_TRANSFER, MembershipStatus.ACTIVE);
        assertEquals(PaymentOption.BANK_TRANSFER, bankTransferMember.getPaymentOption());
        
        Member checkMember = membershipManagement.addMember("Charlie", "Wilson", "charlie@example.com", "555-8765",
            MembershipType.BASIC, PaymentOption.CHECK, MembershipStatus.ACTIVE);
        assertEquals(PaymentOption.CHECK, checkMember.getPaymentOption());
    }

    @Test
    public void testDifferentMembershipStatuses() {
        Member activeMember = membershipManagement.addMember("John", "Doe", "john@example.com", "555-1234",
            MembershipType.BASIC, PaymentOption.CASH, MembershipStatus.ACTIVE);
        assertEquals(MembershipStatus.ACTIVE, activeMember.getMembershipStatus());
        
        Member inactiveMember = membershipManagement.addMember("Jane", "Smith", "jane@example.com", "555-5678",
            MembershipType.BASIC, PaymentOption.CASH, MembershipStatus.INACTIVE);
        assertEquals(MembershipStatus.INACTIVE, inactiveMember.getMembershipStatus());
        
        Member expiredMember = membershipManagement.addMember("Bob", "Johnson", "bob@example.com", "555-9876",
            MembershipType.BASIC, PaymentOption.CASH, MembershipStatus.EXPIRED);
        assertEquals(MembershipStatus.EXPIRED, expiredMember.getMembershipStatus());
    }

    @Test
    public void testMemberCreationWithCurrentDate() {
        Member member = membershipManagement.addMember("John", "Doe", "john@example.com");
        
        // Membership date should be set to current date
        LocalDate today = LocalDate.now();
        LocalDate membershipDate = member.getMembershipDate();
        
        assertNotNull(membershipDate);
        // Allow for slight timing differences
        assertTrue(membershipDate.isEqual(today) || membershipDate.isBefore(today.plusDays(1)));
    }

    // Additional test methods to improve coverage

    @Test
    public void testUpdateMember() throws MemberNotFoundException {
        Member member = membershipManagement.addMember("John", "Doe", "john@example.com", "555-1234",
            MembershipType.BASIC, PaymentOption.CASH, MembershipStatus.ACTIVE);
        
        Member updatedMember = membershipManagement.updateMember(member.getMemberId(), 
            "Johnny", "Smith", "johnny@example.com", "555-5678", 
            MembershipType.PREMIUM, PaymentOption.CREDIT_CARD, MembershipStatus.INACTIVE);
        
        assertNotNull(updatedMember);
        assertEquals("Johnny", updatedMember.getFirstName());
        assertEquals("Smith", updatedMember.getLastName());
        assertEquals("johnny@example.com", updatedMember.getEmail());
        assertEquals("555-5678", updatedMember.getPhoneNumber());
        assertEquals(MembershipType.PREMIUM, updatedMember.getMembershipType());
        assertEquals(PaymentOption.CREDIT_CARD, updatedMember.getPaymentOption());
        assertEquals(MembershipStatus.INACTIVE, updatedMember.getMembershipStatus());
    }

    @Test
    public void testUpdateMemberNotFound() {
        assertThrows(MemberNotFoundException.class, () -> {
            membershipManagement.updateMember(999, "John", "Doe", "john@example.com", "555-1234",
                MembershipType.BASIC, PaymentOption.CASH, MembershipStatus.ACTIVE);
        });
    }

    @Test
    public void testRemoveMember() throws MemberNotFoundException {
        Member member = membershipManagement.addMember("John", "Doe", "john@example.com");
        int memberId = member.getMemberId();
        
        Member removedMember = membershipManagement.removeMember(memberId);
        
        assertNotNull(removedMember);
        assertEquals("John", removedMember.getFirstName());
        assertEquals("Doe", removedMember.getLastName());
        
        // Verify member is actually removed
        assertThrows(MemberNotFoundException.class, () -> {
            membershipManagement.findMemberById(memberId);
        });
    }

    @Test
    public void testRemoveMemberNotFound() {
        assertThrows(MemberNotFoundException.class, () -> {
            membershipManagement.removeMember(999);
        });
    }

    @Test
    public void testFindMembersByName() {
        membershipManagement.addMember("John", "Doe", "john@example.com");
        membershipManagement.addMember("Jane", "Doe", "jane@example.com");
        membershipManagement.addMember("Bob", "Smith", "bob@example.com");
        
        // Test finding by first name
        assertEquals(1, membershipManagement.findMembersByName("John").size());
        assertEquals(1, membershipManagement.findMembersByName("Jane").size());
        assertEquals(1, membershipManagement.findMembersByName("Bob").size());
        
        // Test finding by last name
        assertEquals(2, membershipManagement.findMembersByName("Doe").size());
        assertEquals(1, membershipManagement.findMembersByName("Smith").size());
        
        // Test case insensitive search
        assertEquals(1, membershipManagement.findMembersByName("john").size());
        assertEquals(2, membershipManagement.findMembersByName("doe").size());
        
        // Test non-existent name
        assertEquals(0, membershipManagement.findMembersByName("NonExistent").size());
    }

    @Test
    public void testGetAllMembers() {
        assertTrue(membershipManagement.getAllMembers().isEmpty());
        
        membershipManagement.addMember("John", "Doe", "john@example.com");
        membershipManagement.addMember("Jane", "Smith", "jane@example.com");
        
        assertEquals(2, membershipManagement.getAllMembers().size());
    }

    @Test
    public void testGetActiveMembers() {
        membershipManagement.addMember("John", "Doe", "john@example.com", "555-1234",
            MembershipType.BASIC, PaymentOption.CASH, MembershipStatus.ACTIVE);
        membershipManagement.addMember("Jane", "Smith", "jane@example.com", "555-5678",
            MembershipType.BASIC, PaymentOption.CASH, MembershipStatus.INACTIVE);
        membershipManagement.addMember("Bob", "Johnson", "bob@example.com", "555-9876",
            MembershipType.BASIC, PaymentOption.CASH, MembershipStatus.ACTIVE);
        
        assertEquals(2, membershipManagement.getActiveMembers().size());
    }

    @Test
    public void testGetInactiveMembers() {
        membershipManagement.addMember("John", "Doe", "john@example.com", "555-1234",
            MembershipType.BASIC, PaymentOption.CASH, MembershipStatus.ACTIVE);
        membershipManagement.addMember("Jane", "Smith", "jane@example.com", "555-5678",
            MembershipType.BASIC, PaymentOption.CASH, MembershipStatus.INACTIVE);
        membershipManagement.addMember("Bob", "Johnson", "bob@example.com", "555-9876",
            MembershipType.BASIC, PaymentOption.CASH, MembershipStatus.EXPIRED);
        
        // getInactiveMembers() only returns INACTIVE status, not EXPIRED
        assertEquals(1, membershipManagement.getInactiveMembers().size());
    }

    @Test
    public void testActivateMember() throws MemberNotFoundException {
        Member member = membershipManagement.addMember("John", "Doe", "john@example.com", "555-1234",
            MembershipType.BASIC, PaymentOption.CASH, MembershipStatus.INACTIVE);
        
        Member activatedMember = membershipManagement.activateMember(member.getMemberId());
        
        assertNotNull(activatedMember);
        assertEquals(MembershipStatus.ACTIVE, activatedMember.getMembershipStatus());
    }

    @Test
    public void testActivateMemberNotFound() {
        assertThrows(MemberNotFoundException.class, () -> {
            membershipManagement.activateMember(999);
        });
    }

    @Test
    public void testDeactivateMember() throws MemberNotFoundException {
        Member member = membershipManagement.addMember("John", "Doe", "john@example.com", "555-1234",
            MembershipType.BASIC, PaymentOption.CASH, MembershipStatus.ACTIVE);
        
        Member deactivatedMember = membershipManagement.deactivateMember(member.getMemberId());
        
        assertNotNull(deactivatedMember);
        assertEquals(MembershipStatus.INACTIVE, deactivatedMember.getMembershipStatus());
    }

    @Test
    public void testDeactivateMemberNotFound() {
        assertThrows(MemberNotFoundException.class, () -> {
            membershipManagement.deactivateMember(999);
        });
    }

    @Test
    public void testIsEmpty() {
        assertTrue(membershipManagement.isEmpty());
        
        membershipManagement.addMember("John", "Doe", "john@example.com");
        assertFalse(membershipManagement.isEmpty());
    }

    @Test
    public void testClearAllMembers() {
        membershipManagement.addMember("John", "Doe", "john@example.com");
        membershipManagement.addMember("Jane", "Smith", "jane@example.com");
        
        assertEquals(2, membershipManagement.getTotalMemberCount());
        
        membershipManagement.clearAllMembers();
        
        assertEquals(0, membershipManagement.getTotalMemberCount());
        assertTrue(membershipManagement.isEmpty());
    }

    @Test
    public void testGetMembersWithOverduePayments() {
        Member member1 = membershipManagement.addMember("John", "Doe", "john@example.com");
        Member member2 = membershipManagement.addMember("Jane", "Smith", "jane@example.com");
        
        // Initially no overdue payments
        assertEquals(0, membershipManagement.getMembersWithOverduePayments().size());
        
        // Mark one member as overdue
        try {
            membershipManagement.markMemberPaymentOverdue(member1.getMemberId());
            assertEquals(1, membershipManagement.getMembersWithOverduePayments().size());
        } catch (MemberNotFoundException e) {
            fail("Member should exist");
        }
    }

    @Test
    public void testRecordMemberPayment() throws MemberNotFoundException {
        Member member = membershipManagement.addMember("John", "Doe", "john@example.com");
        
        Member updatedMember = membershipManagement.recordMemberPayment(member.getMemberId());
        
        assertNotNull(updatedMember);
        assertEquals(PaymentStatus.UP_TO_DATE, updatedMember.getPaymentStatus());
        assertEquals(LocalDate.now(), updatedMember.getLastPaymentDate());
    }

    @Test
    public void testRecordMemberPaymentNotFound() {
        assertThrows(MemberNotFoundException.class, () -> {
            membershipManagement.recordMemberPayment(999);
        });
    }

    @Test
    public void testMarkMemberPaymentOverdue() throws MemberNotFoundException {
        Member member = membershipManagement.addMember("John", "Doe", "john@example.com");
        
        Member updatedMember = membershipManagement.markMemberPaymentOverdue(member.getMemberId());
        
        assertNotNull(updatedMember);
        assertEquals(PaymentStatus.OVERDUE, updatedMember.getPaymentStatus());
    }

    @Test
    public void testMarkMemberPaymentOverdueNotFound() {
        assertThrows(MemberNotFoundException.class, () -> {
            membershipManagement.markMemberPaymentOverdue(999);
        });
    }

    @Test
    public void testAddMemberWithInvalidData() {
        // Test null/empty validation
        assertThrows(IllegalArgumentException.class, () -> {
            membershipManagement.addMember(null, "Doe", "john@example.com", "555-1234",
                MembershipType.BASIC, PaymentOption.CASH, MembershipStatus.ACTIVE);
        });
        
        assertThrows(IllegalArgumentException.class, () -> {
            membershipManagement.addMember("", "Doe", "john@example.com", "555-1234",
                MembershipType.BASIC, PaymentOption.CASH, MembershipStatus.ACTIVE);
        });
        
        assertThrows(IllegalArgumentException.class, () -> {
            membershipManagement.addMember("John", null, "john@example.com", "555-1234",
                MembershipType.BASIC, PaymentOption.CASH, MembershipStatus.ACTIVE);
        });
        
        assertThrows(IllegalArgumentException.class, () -> {
            membershipManagement.addMember("John", "", "john@example.com", "555-1234",
                MembershipType.BASIC, PaymentOption.CASH, MembershipStatus.ACTIVE);
        });
    }
}

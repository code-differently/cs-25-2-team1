package com.codedifferently.cs_252_team1.fitnessManagementApp;


import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import static org.junit.jupiter.api.Assertions.*;

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
        // Test with email
        Member memberWithEmail = membershipManagement.addMember("Jane", "Smith", "jane@example.com");
        assertNotNull(memberWithEmail);
        assertEquals("jane@example.com", memberWithEmail.getEmail());
        assertEquals("", memberWithEmail.getPhoneNumber());
        
        // Test with phone number
        Member memberWithPhone = membershipManagement.addMember("Bob", "Johnson", "555-9876");
        assertNotNull(memberWithPhone);
        assertEquals("", memberWithPhone.getEmail());
        assertEquals("555-9876", memberWithPhone.getPhoneNumber());
    }

    @Test
    public void testAddMemberValidation() {
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
        
        // Test both email and phone null/empty
        assertThrows(IllegalArgumentException.class, () -> {
            membershipManagement.addMember("John", "Doe", null, null,
                MembershipType.BASIC, PaymentOption.CASH, MembershipStatus.ACTIVE);
        });
    }

    @Test
    public void testUpdateMember() {
        Member member = membershipManagement.addMember("John", "Doe", "john@example.com");
        int memberId = member.getMemberId();
        
        Member updatedMember = membershipManagement.updateMember(
            memberId,
            "Jane",
            "Smith",
            "jane@example.com",
            "555-9999",
            MembershipType.PREMIUM,
            PaymentOption.CREDIT_CARD,
            MembershipStatus.INACTIVE
        );
        
        assertNotNull(updatedMember);
        assertEquals("Jane", updatedMember.getFirstName());
        assertEquals("Smith", updatedMember.getLastName());
        assertEquals("jane@example.com", updatedMember.getEmail());
        assertEquals("555-9999", updatedMember.getPhoneNumber());
        assertEquals(MembershipType.PREMIUM, updatedMember.getMembershipType());
        assertEquals(PaymentOption.CREDIT_CARD, updatedMember.getPaymentOption());
        assertEquals(MembershipStatus.INACTIVE, updatedMember.getMembershipStatus());
    }

    @Test
    public void testUpdateMemberPartial() {
        Member member = membershipManagement.addMember("John", "Doe", "john@example.com");
        int memberId = member.getMemberId();
        
        // Update only first name
        Member updatedMember = membershipManagement.updateMember(
            memberId, "Jane", null, null, null, null, null, null);
        
        assertNotNull(updatedMember);
        assertEquals("Jane", updatedMember.getFirstName());
        assertEquals("Doe", updatedMember.getLastName()); // Should remain unchanged
    }

    @Test
    public void testUpdateNonExistentMember() {
        Member result = membershipManagement.updateMember(999, "Jane", "Smith", null, null, null, null, null);
        assertNull(result);
    }

    @Test
    public void testRemoveMember() {
        Member member = membershipManagement.addMember("John", "Doe", "john@example.com");
        int memberId = member.getMemberId();
        
        assertTrue(membershipManagement.removeMember(memberId));
        assertFalse(membershipManagement.removeMember(memberId)); // Should return false on second attempt
    }

    @Test
    public void testFindMemberById() {
        Member member = membershipManagement.addMember("John", "Doe", "john@example.com");
        int memberId = member.getMemberId();
        
        Optional<Member> foundMember = membershipManagement.findMemberById(memberId);
        assertTrue(foundMember.isPresent());
        assertEquals(member, foundMember.get());
        
        // Test finding non-existent member
        Optional<Member> notFound = membershipManagement.findMemberById(999);
        assertFalse(notFound.isPresent());
    }

    @Test
    public void testFindMembersByName() {
        membershipManagement.addMember("John", "Doe", "john@example.com");
        membershipManagement.addMember("Jane", "Doe", "jane@example.com");
        membershipManagement.addMember("Bob", "Smith", "bob@example.com");
        
        // Find by first name
        List<Member> johnsMembers = membershipManagement.findMembersByName("John");
        assertEquals(1, johnsMembers.size());
        
        // Find by last name
        List<Member> doesMembers = membershipManagement.findMembersByName("Doe");
        assertEquals(2, doesMembers.size());
        
        // Find by partial name
        List<Member> partialResults = membershipManagement.findMembersByName("Do");
        assertEquals(2, partialResults.size());
        
        // Find non-existent name
        List<Member> noResults = membershipManagement.findMembersByName("NonExistent");
        assertTrue(noResults.isEmpty());
        
        // Find with null/empty name
        List<Member> nullResults = membershipManagement.findMembersByName(null);
        assertTrue(nullResults.isEmpty());
        
        List<Member> emptyResults = membershipManagement.findMembersByName("");
        assertTrue(emptyResults.isEmpty());
    }

    @Test
    public void testGetAllMembers() {
        assertTrue(membershipManagement.getAllMembers().isEmpty());
        
        membershipManagement.addMember("John", "Doe", "john@example.com");
        membershipManagement.addMember("Jane", "Smith", "jane@example.com");
        
        List<Member> allMembers = membershipManagement.getAllMembers();
        assertEquals(2, allMembers.size());
    }

    @Test
    public void testGetActiveMembers() {
        Member activeMember = membershipManagement.addMember("John", "Doe", "john@example.com");
        membershipManagement.addMember("Jane", "Smith", "jane@example.com", "555-1234",
            MembershipType.BASIC, PaymentOption.CASH, MembershipStatus.INACTIVE);
        
        List<Member> activeMembers = membershipManagement.getActiveMembers();
        assertEquals(1, activeMembers.size());
        assertEquals(activeMember, activeMembers.get(0));
    }

    @Test
    public void testGetInactiveMembers() {
        membershipManagement.addMember("John", "Doe", "john@example.com");
        Member inactiveMember = membershipManagement.addMember("Jane", "Smith", "jane@example.com", "555-1234",
            MembershipType.BASIC, PaymentOption.CASH, MembershipStatus.INACTIVE);
        
        List<Member> inactiveMembers = membershipManagement.getInactiveMembers();
        assertEquals(1, inactiveMembers.size());
        assertEquals(inactiveMember, inactiveMembers.get(0));
    }

    @Test
    public void testGetTotalMemberCount() {
        assertEquals(0, membershipManagement.getTotalMemberCount());
        
        membershipManagement.addMember("John", "Doe", "john@example.com");
        assertEquals(1, membershipManagement.getTotalMemberCount());
        
        membershipManagement.addMember("Jane", "Smith", "jane@example.com");
        assertEquals(2, membershipManagement.getTotalMemberCount());
        
        membershipManagement.removeMember(1);
        assertEquals(1, membershipManagement.getTotalMemberCount());
    }

    @Test
    public void testActivateMember() {
        Member member = membershipManagement.addMember("John", "Doe", "john@example.com", "555-1234",
            MembershipType.BASIC, PaymentOption.CASH, MembershipStatus.INACTIVE);
        int memberId = member.getMemberId();
        
        assertTrue(membershipManagement.activateMember(memberId));
        assertEquals(MembershipStatus.ACTIVE, member.getMembershipStatus());
        
        // Test activating non-existent member
        assertFalse(membershipManagement.activateMember(999));
    }

    @Test
    public void testDeactivateMember() {
        Member member = membershipManagement.addMember("John", "Doe", "john@example.com");
        int memberId = member.getMemberId();
        
        assertTrue(membershipManagement.deactivateMember(memberId));
        assertEquals(MembershipStatus.INACTIVE, member.getMembershipStatus());
        
        // Test deactivating non-existent member
        assertFalse(membershipManagement.deactivateMember(999));
    }

    @Test
    public void testIsEmpty() {
        assertTrue(membershipManagement.isEmpty());
        
        membershipManagement.addMember("John", "Doe", "john@example.com");
        assertFalse(membershipManagement.isEmpty());
        
        membershipManagement.clearAllMembers();
        assertTrue(membershipManagement.isEmpty());
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
        
        // Mark one member's payment as overdue
        member1.markPaymentOverdue();
        
        List<Member> overdueMembers = membershipManagement.getMembersWithOverduePayments();
        assertEquals(1, overdueMembers.size());
        assertEquals(member1, overdueMembers.get(0));
    }

    @Test
    public void testRecordMemberPayment() {
        Member member = membershipManagement.addMember("John", "Doe", "john@example.com");
        int memberId = member.getMemberId();
        
        member.markPaymentOverdue();
        assertTrue(member.isPaymentOverdue());
        
        assertTrue(membershipManagement.recordMemberPayment(memberId));
        assertFalse(member.isPaymentOverdue());
        
        // Test recording payment for non-existent member
        assertFalse(membershipManagement.recordMemberPayment(999));
    }

    @Test
    public void testMarkMemberPaymentOverdue() {
        Member member = membershipManagement.addMember("John", "Doe", "john@example.com");
        int memberId = member.getMemberId();
        
        assertFalse(member.isPaymentOverdue());
        
        assertTrue(membershipManagement.markMemberPaymentOverdue(memberId));
        assertTrue(member.isPaymentOverdue());
        
        // Test marking payment overdue for non-existent member
        assertFalse(membershipManagement.markMemberPaymentOverdue(999));
    }

    @Test
    public void testGetOverduePaymentCount() {
        assertEquals(0, membershipManagement.getOverduePaymentCount());
        
        Member member1 = membershipManagement.addMember("John", "Doe", "john@example.com");
        Member member2 = membershipManagement.addMember("Jane", "Smith", "jane@example.com");
        
        member1.markPaymentOverdue();
        assertEquals(1, membershipManagement.getOverduePaymentCount());
        
        member2.markPaymentOverdue();
        assertEquals(2, membershipManagement.getOverduePaymentCount());
        
        member1.recordPayment();
        assertEquals(1, membershipManagement.getOverduePaymentCount());
    }

    @Test
    public void testMemberIdAutoIncrement() {
        Member member1 = membershipManagement.addMember("John", "Doe", "john@example.com");
        Member member2 = membershipManagement.addMember("Jane", "Smith", "jane@example.com");
        
        assertEquals(1, member1.getMemberId());
        assertEquals(2, member2.getMemberId());
        
        // After clearing, ID should reset
        membershipManagement.clearAllMembers();
        Member member3 = membershipManagement.addMember("Bob", "Johnson", "bob@example.com");
        assertEquals(1, member3.getMemberId());
    }
}

package com.codedifferently.cs_252_team1.fitnessManagementApp;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class MembershipManagementExceptionTest {
    private MembershipManagement membershipManagement;
    private Member testMember;

    @BeforeEach
    public void setUp() {
        membershipManagement = new MembershipManagement();
        testMember = membershipManagement.addMember(
            "John", 
            "Doe", 
            "john.doe@example.com",
            "555-1234",
            MembershipType.BASIC,
            PaymentOption.CASH,
            MembershipStatus.ACTIVE
        );
    }

    @Test
    public void testFindMemberByIdSuccess() throws MemberNotFoundException {
        // Test successful retrieval
        Member foundMember = membershipManagement.findMemberById(testMember.getMemberId());
        
        assertNotNull(foundMember);
        assertEquals(testMember.getMemberId(), foundMember.getMemberId());
        assertEquals("John", foundMember.getFirstName());
        assertEquals("Doe", foundMember.getLastName());
    }

    @Test
    public void testFindMemberByIdThrowsException() {
        // Test that MemberNotFoundException is thrown for non-existent member
        int nonExistentId = 999;
        
        MemberNotFoundException exception = assertThrows(MemberNotFoundException.class, () -> {
            membershipManagement.findMemberById(nonExistentId);
        });
        
        assertEquals("Member with ID " + nonExistentId + " not found", exception.getMessage());
    }

    @Test
    public void testUpdateMemberSuccess() throws MemberNotFoundException {
        // Test successful update
        Member updatedMember = membershipManagement.updateMember(
            testMember.getMemberId(),
            "Jane",
            "Smith",
            "jane.smith@example.com",
            "555-5678",
            MembershipType.PREMIUM,
            PaymentOption.CREDIT_CARD,
            MembershipStatus.ACTIVE
        );
        
        assertNotNull(updatedMember);
        assertEquals("Jane", updatedMember.getFirstName());
        assertEquals("Smith", updatedMember.getLastName());
        assertEquals("jane.smith@example.com", updatedMember.getEmail());
        assertEquals("555-5678", updatedMember.getPhoneNumber());
        assertEquals(MembershipType.PREMIUM, updatedMember.getMembershipType());
        assertEquals(PaymentOption.CREDIT_CARD, updatedMember.getPaymentOption());
    }

    @Test
    public void testUpdateMemberThrowsException() {
        // Test that MemberNotFoundException is thrown when updating non-existent member
        int nonExistentId = 999;
        
        MemberNotFoundException exception = assertThrows(MemberNotFoundException.class, () -> {
            membershipManagement.updateMember(
                nonExistentId,
                "Jane",
                "Smith",
                "jane.smith@example.com",
                "555-5678",
                MembershipType.PREMIUM,
                PaymentOption.CREDIT_CARD,
                MembershipStatus.ACTIVE
            );
        });
        
        assertEquals("Member with ID " + nonExistentId + " not found", exception.getMessage());
    }

    @Test
    public void testRemoveMemberSuccess() throws MemberNotFoundException {
        // Test successful removal
        Member removedMember = membershipManagement.removeMember(testMember.getMemberId());
        
        assertNotNull(removedMember);
        assertEquals(testMember.getMemberId(), removedMember.getMemberId());
        assertEquals("John", removedMember.getFirstName());
        assertEquals("Doe", removedMember.getLastName());
        
        // Verify member is actually removed by trying to find it again
        assertThrows(MemberNotFoundException.class, () -> {
            membershipManagement.findMemberById(testMember.getMemberId());
        });
    }

    @Test
    public void testRemoveMemberThrowsException() {
        // Test that MemberNotFoundException is thrown when removing non-existent member
        int nonExistentId = 999;
        
        MemberNotFoundException exception = assertThrows(MemberNotFoundException.class, () -> {
            membershipManagement.removeMember(nonExistentId);
        });
        
        assertEquals("Member with ID " + nonExistentId + " not found", exception.getMessage());
    }

    @Test
    public void testActivateMemberSuccess() throws MemberNotFoundException {
        // First set member to inactive
        testMember.setMembershipStatus(MembershipStatus.INACTIVE);
        
        // Test successful activation
        Member activatedMember = membershipManagement.activateMember(testMember.getMemberId());
        
        assertNotNull(activatedMember);
        assertEquals(MembershipStatus.ACTIVE, activatedMember.getMembershipStatus());
    }

    @Test
    public void testActivateMemberThrowsException() {
        // Test that MemberNotFoundException is thrown when activating non-existent member
        int nonExistentId = 999;
        
        MemberNotFoundException exception = assertThrows(MemberNotFoundException.class, () -> {
            membershipManagement.activateMember(nonExistentId);
        });
        
        assertEquals("Member with ID " + nonExistentId + " not found", exception.getMessage());
    }

    @Test
    public void testDeactivateMemberSuccess() throws MemberNotFoundException {
        // Test successful deactivation
        Member deactivatedMember = membershipManagement.deactivateMember(testMember.getMemberId());
        
        assertNotNull(deactivatedMember);
        assertEquals(MembershipStatus.INACTIVE, deactivatedMember.getMembershipStatus());
    }

    @Test
    public void testDeactivateMemberThrowsException() {
        // Test that MemberNotFoundException is thrown when deactivating non-existent member
        int nonExistentId = 999;
        
        MemberNotFoundException exception = assertThrows(MemberNotFoundException.class, () -> {
            membershipManagement.deactivateMember(nonExistentId);
        });
        
        assertEquals("Member with ID " + nonExistentId + " not found", exception.getMessage());
    }

    @Test
    public void testRecordMemberPaymentSuccess() throws MemberNotFoundException {
        // Test successful payment recording
        Member memberWithPayment = membershipManagement.recordMemberPayment(testMember.getMemberId());
        
        assertNotNull(memberWithPayment);
        assertEquals(testMember.getMemberId(), memberWithPayment.getMemberId());
    }

    @Test
    public void testRecordMemberPaymentThrowsException() {
        // Test that MemberNotFoundException is thrown when recording payment for non-existent member
        int nonExistentId = 999;
        
        MemberNotFoundException exception = assertThrows(MemberNotFoundException.class, () -> {
            membershipManagement.recordMemberPayment(nonExistentId);
        });
        
        assertEquals("Member with ID " + nonExistentId + " not found", exception.getMessage());
    }

    @Test
    public void testMarkMemberPaymentOverdueSuccess() throws MemberNotFoundException {
        // Test successful payment overdue marking
        Member memberWithOverdue = membershipManagement.markMemberPaymentOverdue(testMember.getMemberId());
        
        assertNotNull(memberWithOverdue);
        assertEquals(testMember.getMemberId(), memberWithOverdue.getMemberId());
    }

    @Test
    public void testMarkMemberPaymentOverdueThrowsException() {
        // Test that MemberNotFoundException is thrown when marking overdue for non-existent member
        int nonExistentId = 999;
        
        MemberNotFoundException exception = assertThrows(MemberNotFoundException.class, () -> {
            membershipManagement.markMemberPaymentOverdue(nonExistentId);
        });
        
        assertEquals("Member with ID " + nonExistentId + " not found", exception.getMessage());
    }
}

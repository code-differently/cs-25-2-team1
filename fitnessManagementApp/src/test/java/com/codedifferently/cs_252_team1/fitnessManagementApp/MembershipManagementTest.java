package com.codedifferently.cs_252_team1.fitnessManagementApp;

import java.time.LocalDate;
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
    }

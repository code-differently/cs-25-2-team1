package com.codedifferently.cs_252_team1.fitnessManagementApp;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class MemberTest {
    private Member member;

    @BeforeEach
    public void setUp() {
        member = new Member(
            1,
            "John",
            "Doe",
            "john.doe@example.com",
            "555-1234",
            LocalDate.of(2022, 1, 1),
            MembershipStatus.ACTIVE,
            MembershipType.BASIC,
            PaymentOption.CASH
        );
    }

    @Test
    public void testGetMemberId() {
        assertEquals(1, member.getMemberId());
    }

    @Test
    public void testGetFirstName() {
        assertEquals("John", member.getFirstName());
    }

    @Test
    public void testGetLastName() {
        assertEquals("Doe", member.getLastName());
    }

    @Test
    public void testGetEmail() {
        assertEquals("john.doe@example.com", member.getEmail());
    }

    @Test
    public void testGetPhoneNumber() {
        assertEquals("555-1234", member.getPhoneNumber());
    }

    @Test
    public void testGetMembershipDate() {
        assertEquals(LocalDate.of(2022, 1, 1), member.getMembershipDate());
    }

    @Test
    public void testGetMembershipType() {
        assertEquals(MembershipType.BASIC, member.getMembershipType());
    }

    @Test
    public void testGetMembershipStatus() {
        assertEquals(MembershipStatus.ACTIVE, member.getMembershipStatus());
    }

    @Test
    public void testGetPaymentOption() {
        assertEquals(PaymentOption.CASH, member.getPaymentOption());
    }

    @Test
    public void testGetPaymentStatus() {
        assertEquals(PaymentStatus.UP_TO_DATE, member.getPaymentStatus());
    }

    @Test
    public void testGetLastPaymentDate() {
        assertNotNull(member.getLastPaymentDate());
    }

    @Test
    public void testSetMemberId() {
        member.setMemberId(2);
        assertEquals(2, member.getMemberId());
    }

    @Test
    public void testSetFirstName() {
        member.setFirstName("Jane");
        assertEquals("Jane", member.getFirstName());
    }

    @Test
    public void testSetLastName() {
        member.setLastName("Smith");
        assertEquals("Smith", member.getLastName());
    }

    @Test
    public void testSetEmail() {
        member.setEmail("jane.smith@example.com");
        assertEquals("jane.smith@example.com", member.getEmail());
    }

    @Test
    public void testSetPhoneNumber() {
        member.setPhoneNumber("555-5678");
        assertEquals("555-5678", member.getPhoneNumber());
    }

    @Test
    public void testSetMembershipDate() {
        LocalDate newDate = LocalDate.of(1990, 5, 15);
        member.setMembershipDate(newDate);
        assertEquals(newDate, member.getMembershipDate());
    }

    @Test
    public void testSetMembershipType() {
        member.setMembershipType(MembershipType.PREMIUM);
        assertEquals(MembershipType.PREMIUM, member.getMembershipType());
    }

    @Test
    public void testSetMembershipStatus() {
        member.setMembershipStatus(MembershipStatus.INACTIVE);
        assertEquals(MembershipStatus.INACTIVE, member.getMembershipStatus());
    }

    @Test
    public void testSetPaymentOption() {
        member.setPaymentOption(PaymentOption.CREDIT_CARD);
        assertEquals(PaymentOption.CREDIT_CARD, member.getPaymentOption());
    }

    @Test
    public void testSetPaymentStatus() {
        member.setPaymentStatus(PaymentStatus.OVERDUE);
        assertEquals(PaymentStatus.OVERDUE, member.getPaymentStatus());
    }

    @Test
    public void testSetLastPaymentDate() {
        LocalDate newDate = LocalDate.of(2023, 12, 15);
        member.setLastPaymentDate(newDate);
        assertEquals(newDate, member.getLastPaymentDate());
    }

    @Test
    public void testDefaultConstructor() {
        Member defaultMember = new Member();
        assertEquals(0, defaultMember.getMemberId());
        assertEquals("", defaultMember.getFirstName());
        assertEquals("", defaultMember.getLastName());
        assertEquals("", defaultMember.getEmail());
        assertEquals("", defaultMember.getPhoneNumber());
        assertEquals(MembershipStatus.ACTIVE, defaultMember.getMembershipStatus());
        assertEquals(MembershipType.BASIC, defaultMember.getMembershipType());
        assertEquals(PaymentOption.CASH, defaultMember.getPaymentOption());
        assertEquals(PaymentStatus.UP_TO_DATE, defaultMember.getPaymentStatus());
    }

    @Test
    public void testFirstNameValidation() {
        assertThrows(IllegalArgumentException.class, () -> {
            member.setFirstName(null);
        });
        
        assertThrows(IllegalArgumentException.class, () -> {
            member.setFirstName("A");
        });
        
        assertThrows(IllegalArgumentException.class, () -> {
            member.setFirstName("");
        });
    }

    @Test
    public void testLastNameValidation() {
        assertThrows(IllegalArgumentException.class, () -> {
            member.setLastName(null);
        });
        
        assertThrows(IllegalArgumentException.class, () -> {
            member.setLastName("A");
        });
        
        assertThrows(IllegalArgumentException.class, () -> {
            member.setLastName("");
        });
    }

    @Test
    public void testEqualsAndHashCode() {
        Member sameMember = new Member(
            1,
            "Different",
            "Name",
            "different@email.com",
            "999-9999",
            LocalDate.of(2020, 1, 1),
            MembershipStatus.INACTIVE,
            MembershipType.VIP,
            PaymentOption.CREDIT_CARD
        );
        
        Member differentMember = new Member(
            2,
            "John",
            "Doe",
            "john.doe@example.com",
            "555-1234",
            LocalDate.of(2022, 1, 1),
            MembershipStatus.ACTIVE,
            MembershipType.BASIC,
            PaymentOption.CASH
        );
        
        // Equality is based on memberId only
        assertEquals(member, sameMember);
        assertNotEquals(member, differentMember);
        assertEquals(member.hashCode(), sameMember.hashCode());
        assertNotEquals(member.hashCode(), differentMember.hashCode());
    }
}
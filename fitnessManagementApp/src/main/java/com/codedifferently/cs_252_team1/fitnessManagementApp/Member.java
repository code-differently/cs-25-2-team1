package com.codedifferently.cs_252_team1.fitnessManagementApp;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Objects;

public class Member implements Serializable {
    private static final long serialVersionUID = 1L;
    
    // Private fields with proper encapsulation
    private int memberId;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private LocalDate membershipDate;
    private MembershipStatus membershipStatus;
    private MembershipType membershipType;
    private PaymentOption paymentOption;
    private PaymentStatus paymentStatus;
    private LocalDate lastPaymentDate;
    
    // Constructors
    public Member() {
        this.memberId = 0;
        this.membershipDate = LocalDate.now();
        this.membershipStatus = MembershipStatus.ACTIVE;
        this.firstName = "";
        this.lastName = "";
        this.email = "";
        this.phoneNumber = "";
        this.membershipType = MembershipType.BASIC;
        this.paymentOption = PaymentOption.CASH;
        this.paymentStatus = PaymentStatus.UP_TO_DATE;
        this.lastPaymentDate = LocalDate.now();
    }

    public Member(int memberId, String firstName, String lastName, String email,
                  String phoneNumber, LocalDate membershipDate, MembershipStatus membershipStatus,
                  MembershipType membershipType, PaymentOption paymentOption) {
        this.memberId = memberId;
        setFirstName(firstName);
        setLastName(lastName);
        setEmail(email);
        setPhoneNumber(phoneNumber);
        setMembershipDate(membershipDate);
        this.membershipStatus = membershipStatus != null ? membershipStatus : MembershipStatus.ACTIVE;
        this.membershipType = membershipType != null ? membershipType : MembershipType.BASIC;
        this.paymentOption = paymentOption != null ? paymentOption : PaymentOption.CASH;
        this.paymentStatus = PaymentStatus.UP_TO_DATE;
        this.lastPaymentDate = LocalDate.now();
    }
    
    // Getters and Setters with validation
    public int getMemberId() {
        return memberId;
    }
    
    public void setMemberId(int memberId) {
        this.memberId = memberId;
    }
    
    public String getFirstName() {
        return firstName;
    }
    
    public final void setFirstName(String firstName) {
        if (firstName == null || firstName.trim().length() < 2 || firstName.length() > 50) {
            throw new IllegalArgumentException("First name must be between 2 and 50 characters");
        }
        this.firstName = firstName.trim();
    }
    
    public String getLastName() {
        return lastName;
    }
    
    public final void setLastName(String lastName) {
        if (lastName == null || lastName.trim().length() < 2 || lastName.length() > 50) {
            throw new IllegalArgumentException("Last name must be between 2 and 50 characters");
        }
        this.lastName = lastName.trim();
    }
    
    public String getEmail() {
        return email;
    }
    
    public final void setEmail(String email) {
        this.email = email;
    }
    
    public String getPhoneNumber() {
        return phoneNumber;
    }
    
    public final void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
    
    public LocalDate getMembershipDate() {
        return membershipDate;
    }
    
    public final void setMembershipDate(LocalDate membershipDate) {
        this.membershipDate = membershipDate;
    }
    
    public MembershipStatus getMembershipStatus() {
        return membershipStatus;
    }
    
    public final void setMembershipStatus(MembershipStatus membershipStatus) {
        this.membershipStatus = membershipStatus != null ? membershipStatus : MembershipStatus.ACTIVE;
    }
    
    public MembershipType getMembershipType() {
        return membershipType;
    }
    
    public void setMembershipType(MembershipType membershipType) {
        this.membershipType = membershipType != null ? membershipType : MembershipType.BASIC;
    }
    
    public PaymentOption getPaymentOption() {
        return paymentOption;
    }
    
    public void setPaymentOption(PaymentOption paymentOption) {
        this.paymentOption = paymentOption != null ? paymentOption : PaymentOption.CASH;
    }
    
    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }
    
    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus != null ? paymentStatus : PaymentStatus.UP_TO_DATE;
    }
    
    public LocalDate getLastPaymentDate() {
        return lastPaymentDate;
    }
    
    public void setLastPaymentDate(LocalDate lastPaymentDate) {
        this.lastPaymentDate = lastPaymentDate != null ? lastPaymentDate : LocalDate.now();
    }
    
    // Computed properties (methods in Java)
    public String getFullName() {
        return firstName + " " + lastName;
    }
    
    public long getYearsOfMembership() {
        return ChronoUnit.YEARS.between(membershipDate, LocalDate.now());
    }
    
    // Convenience method to check if member is active
    public boolean isActive() {
        return membershipStatus == MembershipStatus.ACTIVE;
    }
    
    // Business methods
    public void activate() {
        this.membershipStatus = MembershipStatus.ACTIVE;
    }
    
    public void deactivate() {
        this.membershipStatus = MembershipStatus.INACTIVE;
    }
    
    /**
     * Checks if the member's payment is overdue based on their payment status
     * and last payment date. Payments are considered overdue if:
     * 1. PaymentStatus is explicitly set to OVERDUE, or
     * 2. Last payment was more than 30 days ago (monthly billing cycle)
     * 
     * @return true if payment is overdue, false otherwise
     */
    public boolean isPaymentOverdue() {
        // Check if payment status is explicitly set to overdue
        if (paymentStatus == PaymentStatus.OVERDUE) {
            return true;
        }
        
        // Check if last payment was more than 30 days ago (assuming monthly billing)
        if (lastPaymentDate != null) {
            LocalDate today = LocalDate.now();
            long daysSinceLastPayment = ChronoUnit.DAYS.between(lastPaymentDate, today);
            return daysSinceLastPayment > 30;
        }
        
        // If no last payment date is set, consider it overdue
        return true;
    }
    
    /**
     * Records a payment made by the member, updating the payment status
     * and last payment date
     */
    public void recordPayment() {
        this.paymentStatus = PaymentStatus.UP_TO_DATE;
        this.lastPaymentDate = LocalDate.now();
    }
    
    /**
     * Marks the payment as overdue
     */
    public void markPaymentOverdue() {
        this.paymentStatus = PaymentStatus.OVERDUE;
    }
    

    
    // Override methods
    @Override
    public String toString() {
        return getFullName() + " (" + membershipStatus + ")";
    }
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Member member = (Member) obj;
        return memberId == member.memberId;
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(memberId);
    }
}
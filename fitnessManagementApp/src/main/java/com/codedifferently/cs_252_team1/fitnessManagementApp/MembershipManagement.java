package com.codedifferently.cs_252_team1.fitnessManagementApp;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * MembershipManagement class provides functionality for administrators to 
 * add, update, and remove members from the fitness management system.
 * 
 * This class satisfies the user story:
 * "As an administrator, I want to add, update, or remove members so that 
 * I can keep internal records accurate and up to date."
 */
public class MembershipManagement {
    private Map<Integer, Member> members;
    private int nextMemberId;
    
    public MembershipManagement() {
        this.members = new HashMap<>();
        this.nextMemberId = 1;
    }
    
    /**
     * Add a new member with all required information
     * @param firstName Member's first name
     * @param lastName Member's last name
     * @param email Member's email address
     * @param phoneNumber Member's phone number
     * @param membershipType Type of membership (BASIC, PREMIUM, VIP, etc.)
     * @param paymentOption Payment method (CASH, CREDIT_CARD, etc.)
     * @param membershipStatus Initial status (ACTIVE, INACTIVE)
     * @return The newly created Member object
     * @throws IllegalArgumentException if required fields are invalid
     */
    public Member addMember(String firstName, String lastName, String email, 
                           String phoneNumber, MembershipType membershipType,
                           PaymentOption paymentOption, MembershipStatus membershipStatus) {
        
        // Validate required fields
        if (firstName == null || firstName.trim().isEmpty()) {
            throw new IllegalArgumentException("First name is required");
        }
        if (lastName == null || lastName.trim().isEmpty()) {
            throw new IllegalArgumentException("Last name is required");
        }
        if ((email == null || email.trim().isEmpty()) && 
            (phoneNumber == null || phoneNumber.trim().isEmpty())) {
            throw new IllegalArgumentException("Either email or phone number must be provided");
        }
        
        // Create new member with auto-generated ID
        Member newMember = new Member(
            nextMemberId++,
            firstName,
            lastName,
            email != null ? email : "",
            phoneNumber != null ? phoneNumber : "",
            LocalDate.now(),
            membershipStatus != null ? membershipStatus : MembershipStatus.ACTIVE,
            membershipType != null ? membershipType : MembershipType.BASIC,
            paymentOption != null ? paymentOption : PaymentOption.CASH
        );
        
        // Add to members collection
        members.put(newMember.getMemberId(), newMember);
        
        return newMember;
    }
    
    /**
     * Overloaded method for adding a member with minimal required information
     * @param firstName Member's first name
     * @param lastName Member's last name
     * @param contactInfo Either email or phone number
     * @return The newly created Member object
     */
    public Member addMember(String firstName, String lastName, String contactInfo) {
        // Determine if contactInfo is email or phone based on format
        String email = "";
        String phoneNumber = "";
        
        if (contactInfo != null && contactInfo.contains("@")) {
            email = contactInfo;
        } else {
            phoneNumber = contactInfo;
        }
        
        return addMember(firstName, lastName, email, phoneNumber, 
                        MembershipType.BASIC, PaymentOption.CASH, MembershipStatus.ACTIVE);
    }
    
    /**
     * Update an existing member's details
     * @param memberId ID of the member to update
     * @param firstName New first name (null to keep current)
     * @param lastName New last name (null to keep current)
     * @param email New email (null to keep current)
     * @param phoneNumber New phone number (null to keep current)
     * @param membershipType New membership type (null to keep current)
     * @param paymentOption New payment option (null to keep current)
     * @param membershipStatus New membership status (null to keep current)
     * @return Updated Member object, or null if member not found
     */
    public Member updateMember(int memberId, String firstName, String lastName, 
                              String email, String phoneNumber, MembershipType membershipType,
                              PaymentOption paymentOption, MembershipStatus membershipStatus) {
        
        Member member = members.get(memberId);
        if (member == null) {
            return null;
        }
        
        // Update fields if new values are provided
        if (firstName != null && !firstName.trim().isEmpty()) {
            member.setFirstName(firstName);
        }
        if (lastName != null && !lastName.trim().isEmpty()) {
            member.setLastName(lastName);
        }
        if (email != null) {
            member.setEmail(email);
        }
        if (phoneNumber != null) {
            member.setPhoneNumber(phoneNumber);
        }
        if (membershipType != null) {
            member.setMembershipType(membershipType);
        }
        if (paymentOption != null) {
            member.setPaymentOption(paymentOption);
        }
        if (membershipStatus != null) {
            member.setMembershipStatus(membershipStatus);
        }
        
        return member;
    }
    
    /**
     * Remove a member from the system
     * @param memberId ID of the member to remove
     * @return True if member was found and removed, false otherwise
     */
    public boolean removeMember(int memberId) {
        return members.remove(memberId) != null;
    }
    
    /**
     * Find a member by ID
     * @param memberId ID of the member to find
     * @return Optional containing the member if found, empty otherwise
     */
    public Optional<Member> findMemberById(int memberId) {
        return Optional.ofNullable(members.get(memberId));
    }
    
    /**
     * Find members by name (first or last name contains the search term)
     * @param name Name or partial name to search for
     * @return List of members matching the search criteria
     */
    public List<Member> findMembersByName(String name) {
        List<Member> results = new ArrayList<>();
        if (name == null || name.trim().isEmpty()) {
            return results;
        }
        
        String searchTerm = name.toLowerCase().trim();
        for (Member member : members.values()) {
            if (member.getFirstName().toLowerCase().contains(searchTerm) ||
                member.getLastName().toLowerCase().contains(searchTerm) ||
                member.getFullName().toLowerCase().contains(searchTerm)) {
                results.add(member);
            }
        }
        
        return results;
    }
    
    /**
     * Get all members in the system
     * @return List of all members
     */
    public List<Member> getAllMembers() {
        return new ArrayList<>(members.values());
    }
    
    /**
     * Get all active members
     * @return List of active members
     */
    public List<Member> getActiveMembers() {
        List<Member> activeMembers = new ArrayList<>();
        for (Member member : members.values()) {
            if (member.getMembershipStatus() == MembershipStatus.ACTIVE) {
                activeMembers.add(member);
            }
        }
        return activeMembers;
    }
    
    /**
     * Get all inactive members
     * @return List of inactive members
     */
    public List<Member> getInactiveMembers() {
        List<Member> inactiveMembers = new ArrayList<>();
        for (Member member : members.values()) {
            if (member.getMembershipStatus() == MembershipStatus.INACTIVE) {
                inactiveMembers.add(member);
            }
        }
        return inactiveMembers;
    }
    
    /**
     * Get the total number of members
     * @return Total count of members
     */
    public int getTotalMemberCount() {
        return members.size();
    }
    
    /**
     * Activate a member's membership
     * @param memberId ID of the member to activate
     * @return True if member was found and activated, false otherwise
     */
    public boolean activateMember(int memberId) {
        Member member = members.get(memberId);
        if (member != null) {
            member.activate();
            return true;
        }
        return false;
    }
    
    /**
     * Deactivate a member's membership
     * @param memberId ID of the member to deactivate
     * @return True if member was found and deactivated, false otherwise
     */
    public boolean deactivateMember(int memberId) {
        Member member = members.get(memberId);
        if (member != null) {
            member.deactivate();
            return true;
        }
        return false;
    }
    
    /**
     * Check if the system contains any members
     * @return True if there are no members, false otherwise
     */
    public boolean isEmpty() {
        return members.isEmpty();
    }
    
    /**
     * Clear all members from the system (use with caution)
     */
    public void clearAllMembers() {
        members.clear();
        nextMemberId = 1;
    }
    
    
    
    /**
     * Get all members with overdue payments
     * @return List of members who have overdue payments
     */
    public List<Member> getMembersWithOverduePayments() {
        List<Member> overdueMembers = new ArrayList<>();
        for (Member member : members.values()) {
            if (member.isPaymentOverdue()) {
                overdueMembers.add(member);
            }
        }
        return overdueMembers;
    }
    
    /**
     * Record a payment for a specific member
     * @param memberId ID of the member making the payment
     * @return True if member was found and payment recorded, false otherwise
     */
    public boolean recordMemberPayment(int memberId) {
        Member member = members.get(memberId);
        if (member != null) {
            member.recordPayment();
            return true;
        }
        return false;
    }
    
    /**
     * Mark a member's payment as overdue
     * @param memberId ID of the member whose payment is overdue
     * @return True if member was found and marked as overdue, false otherwise
     */
    public boolean markMemberPaymentOverdue(int memberId) {
        Member member = members.get(memberId);
        if (member != null) {
            member.markPaymentOverdue();
            return true;
        }
        return false;
    }
    
    /**
     * Get count of members with overdue payments
     * @return Number of members with overdue payments
     */
    public int getOverduePaymentCount() {
        int count = 0;
        for (Member member : members.values()) {
            if (member.isPaymentOverdue()) {
                count++;
            }
        }
        return count;
    }
}

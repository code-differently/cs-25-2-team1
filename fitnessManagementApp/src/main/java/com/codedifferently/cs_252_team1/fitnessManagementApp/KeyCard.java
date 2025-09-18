package com.codedifferently.cs_252_team1.fitnessManagementApp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;

public class KeyCard {
    private String cardId;
    private String cardNumber;
    private LocalDate issueDate;
    private LocalDate expirationDate;
    private boolean isActive;
    private KeyCardType cardType;
    
    // Employee and Member associations
    private Employee employee;
    private Member member;
    
    // Last access tracking
    private LocalDateTime lastAccessTime;
    private String lastAccessLocation;
    
    // Constructors
    public KeyCard() {
        this.issueDate = LocalDate.now();
        this.isActive = true;
        this.cardType = KeyCardType.EMPLOYEE;
    }
    
    // Constructor for Employee key card
    public KeyCard(String cardNumber, Employee employee, LocalDate expirationDate) {
        this();
        this.cardNumber = cardNumber;
        this.employee = employee;
        this.member = null; // Ensure member is null for employee cards
        this.expirationDate = expirationDate != null ? expirationDate : LocalDate.now().plusYears(1);
        this.cardType = KeyCardType.EMPLOYEE;
        this.cardId = generateCardId();
    }
    
    // Constructor for Member key card
    public KeyCard(String cardNumber, Member member, LocalDate expirationDate) {
        this();
        this.cardNumber = cardNumber;
        this.member = member;
        this.employee = null; // Ensure employee is null for member cards
        this.expirationDate = expirationDate != null ? expirationDate : LocalDate.now().plusYears(1);
        this.cardType = KeyCardType.MEMBER;
        this.cardId = generateCardId();
    }
    
    // Generate unique card ID
    private String generateCardId() {
        String prefix = cardType == KeyCardType.EMPLOYEE ? "EMP" : "MEM";
        return prefix + "-" + System.currentTimeMillis();
    }
    
    // Getters and Setters
    public String getCardId() {
        return cardId;
    }
    
    public void setCardId(String cardId) {
        this.cardId = cardId;
    }
    
    public String getCardNumber() {
        return cardNumber;
    }
    
    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }
    
    public LocalDate getIssueDate() {
        return issueDate;
    }
    
    public void setIssueDate(LocalDate issueDate) {
        this.issueDate = issueDate;
    }
    
    public LocalDate getExpirationDate() {
        return expirationDate;
    }
    
    public void setExpirationDate(LocalDate expirationDate) {
        this.expirationDate = expirationDate;
    }
    
    public boolean isActive() {
        return isActive;
    }
    
    public void setActive(boolean active) {
        isActive = active;
    }
    
    public KeyCardType getCardType() {
        return cardType;
    }
    
    public void setCardType(KeyCardType cardType) {
        this.cardType = cardType;
    }
    
    public Employee getEmployee() {
        return employee;
    }
    
    public void setEmployee(Employee employee) {
        this.employee = employee;
        if (employee != null) {
            this.member = null; // Clear member when setting employee
            this.cardType = KeyCardType.EMPLOYEE;
        }
    }
    
    public Member getMember() {
        return member;
    }
    
    public void setMember(Member member) {
        this.member = member;
        if (member != null) {
            this.employee = null; // Clear employee when setting member
            this.cardType = KeyCardType.MEMBER;
        }
    }
    
    public LocalDateTime getLastAccessTime() {
        return lastAccessTime;
    }
    
    public void setLastAccessTime(LocalDateTime lastAccessTime) {
        this.lastAccessTime = lastAccessTime;
    }
    
    public String getLastAccessLocation() {
        return lastAccessLocation;
    }
    
    public void setLastAccessLocation(String lastAccessLocation) {
        this.lastAccessLocation = lastAccessLocation;
    }
    
    // Business Methods
    public boolean isExpired() {
        return LocalDate.now().isAfter(expirationDate);
    }
    
    public boolean isValid() {
        return isActive && !isExpired();
    }
    
    public void deactivate() {
        this.isActive = false;
    }
    
    public void activate() {
        this.isActive = true;
    }
    
    public void recordAccess(String location) {
        this.lastAccessTime = LocalDateTime.now();
        this.lastAccessLocation = location;
    }
    
    public void extendExpiration(int months) {
        this.expirationDate = this.expirationDate.plusMonths(months);
    }
    
    // Get card holder name
    public String getCardHolderName() {
        if (employee != null) {
            return employee.getFullName();
        }
        if (member != null) {
            return member.getFullName(); // Assuming Member has getFullName() method
        }
        return "Unknown";
    }
    
    // Get card holder contact info
    public String getCardHolderEmail() {
        if (employee != null) {
            return employee.getEmail();
        }
        if (member != null) {
            return member.getEmail(); // Assuming Member has getEmail() method
        }
        return null;
    }
    
    // Get card holder phone
    public String getCardHolderPhone() {
        if (employee != null) {
            return employee.getPhoneNumber();
        }
        if (member != null) {
            return member.getPhoneNumber(); // Assuming Member has getPhoneNumber() method
        }
        return null;
    }
    
    // Check if card belongs to employee
    public boolean isEmployeeCard() {
        return employee != null && cardType == KeyCardType.EMPLOYEE;
    }
    
    // Check if card belongs to member
    public boolean isMemberCard() {
        return member != null && cardType == KeyCardType.MEMBER;
    }
    
    @Override
    public String toString() {
        return String.format("KeyCard[%s] - %s (%s) - %s", 
                cardNumber, getCardHolderName(), cardType, 
                isValid() ? "VALID" : "INVALID");
    }
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        KeyCard keyCard = (KeyCard) obj;
        return Objects.equals(cardId, keyCard.cardId);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(cardId);
    }
}

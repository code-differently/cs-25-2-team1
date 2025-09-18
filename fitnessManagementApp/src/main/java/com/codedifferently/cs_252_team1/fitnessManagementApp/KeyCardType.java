package com.codedifferently.cs_252_team1.fitnessManagementApp;

public enum KeyCardType {
    EMPLOYEE("Employee Access Card"),
    MEMBER("Member Access Card"),
    GUEST("Guest Access Card"),
    ADMIN("Administrator Access Card");
    
    private final String description;
    
    KeyCardType(String description) {
        this.description = description;
    }
    
    public String getDescription() {
        return description;
    }
    
    @Override
    public String toString() {
        return description;
    }
}

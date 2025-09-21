package com.codedifferently.cs_252_team1.fitnessManagementApp;

/**
 * Custom exception thrown when a member is not found in the system.
 * This exception provides more specific information than a generic exception.
 */
public class MemberNotFoundException extends Exception {
    
    
    
    /**
     * Constructs a MemberNotFoundException with the specified member ID.
     * 
     * @param memberId the ID of the member that was not found
     */
    public MemberNotFoundException(int memberId) {
        super("Member with ID " + memberId + " not found");
    }
    
}

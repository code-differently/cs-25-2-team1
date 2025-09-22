package com.codedifferently.cs_252_team1.fitnessManagementApp.cli;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.codedifferently.cs_252_team1.fitnessManagementApp.Member;
import com.codedifferently.cs_252_team1.fitnessManagementApp.MemberNotFoundException;
import com.codedifferently.cs_252_team1.fitnessManagementApp.MembershipManagement;
import com.codedifferently.cs_252_team1.fitnessManagementApp.MembershipType;

@ExtendWith(MockitoExtension.class)
public class MemberCommandTest {

    @Mock
    private MembershipManagement membershipManagement;

    private final ByteArrayOutputStream outContent = new ByteArrayOutputStream();
    private final ByteArrayOutputStream errContent = new ByteArrayOutputStream();
    private final PrintStream originalOut = System.out;
    private final PrintStream originalErr = System.err;

    @BeforeEach
    public void setUpStreams() {
        System.setOut(new PrintStream(outContent));
        System.setErr(new PrintStream(errContent));
    }

    @AfterEach
    public void restoreStreams() {
        System.setOut(originalOut);
        System.setErr(originalErr);
    }

    @Test
    public void testMemberCommandRun() {
        MemberCommand command = new MemberCommand();
        command.run();
        
        assertTrue(outContent.toString().contains("Use a subcommand: add, update, remove, list, get"));
    }

    @Test
    public void testAddMemberCommandSuccess() {
        // Arrange
        MemberCommand.AddMemberCommand addCommand = new MemberCommand.AddMemberCommand();
        setFieldValue(addCommand, "membershipManagement", membershipManagement);
        
        // Create member using default constructor and setters
        Member mockMember = new Member();
        mockMember.setMemberId(1);
        mockMember.setFirstName("John");
        mockMember.setLastName("Doe");
        mockMember.setEmail("john@email.com");
        mockMember.setPhoneNumber("1234567890");
        mockMember.setMembershipType(MembershipType.PREMIUM);
        
        when(membershipManagement.addMember(anyString(), anyString(), anyString(), anyString(),
            any(MembershipType.class), any(), any())).thenReturn(mockMember);
        
        setFieldValue(addCommand, "firstName", "John");
        setFieldValue(addCommand, "lastName", "Doe");
        setFieldValue(addCommand, "email", "john@email.com");
        setFieldValue(addCommand, "phone", "1234567890");
        setFieldValue(addCommand, "membershipType", MembershipType.PREMIUM);

        // Act
        addCommand.run();

        // Assert
        verify(membershipManagement).addMember(eq("John"), eq("Doe"), eq("john@email.com"), eq("1234567890"),
            eq(MembershipType.PREMIUM), any(), any());
        assertTrue(outContent.toString().contains("✅ Member 'John Doe' added successfully with ID: 1"));
    }

    @Test
    public void testAddMemberCommandError() {
        // Arrange
        MemberCommand.AddMemberCommand addCommand = new MemberCommand.AddMemberCommand();
        setFieldValue(addCommand, "membershipManagement", membershipManagement);
        
        when(membershipManagement.addMember(anyString(), anyString(), anyString(), anyString(),
            any(MembershipType.class), any(), any())).thenThrow(new IllegalArgumentException("Invalid member data"));
        
        setFieldValue(addCommand, "firstName", "John");
        setFieldValue(addCommand, "lastName", "Doe");
        setFieldValue(addCommand, "email", "john@email.com");
        setFieldValue(addCommand, "phone", "1234567890");
        setFieldValue(addCommand, "membershipType", MembershipType.PREMIUM);

        // Act
        addCommand.run();

        // Assert
        assertTrue(errContent.toString().contains("❌ Error adding member: Invalid member data"));
    }

    @Test
    public void testAddMemberCommandWithDefaultMembership() {
        // Arrange
        MemberCommand.AddMemberCommand addCommand = new MemberCommand.AddMemberCommand();
        setFieldValue(addCommand, "membershipManagement", membershipManagement);
        
        Member mockMember = new Member();
        mockMember.setMemberId(1);
        mockMember.setFirstName("Jane");
        mockMember.setLastName("Smith");
        mockMember.setEmail("jane@email.com");
        mockMember.setPhoneNumber("0987654321");
        mockMember.setMembershipType(MembershipType.BASIC);
        
        when(membershipManagement.addMember(anyString(), anyString(), anyString(), anyString(),
            eq(MembershipType.BASIC), any(), any())).thenReturn(mockMember);
        
        setFieldValue(addCommand, "firstName", "Jane");
        setFieldValue(addCommand, "lastName", "Smith");
        setFieldValue(addCommand, "email", "jane@email.com");
        setFieldValue(addCommand, "phone", "0987654321");

        // Act
        addCommand.run();

        // Assert
        verify(membershipManagement).addMember(eq("Jane"), eq("Smith"), eq("jane@email.com"), eq("0987654321"),
            eq(MembershipType.BASIC), any(), any());
    }

    @Test
    public void testRemoveMemberCommandSuccess() throws MemberNotFoundException {
        // Arrange
        MemberCommand.RemoveMemberCommand removeCommand = new MemberCommand.RemoveMemberCommand();
        setFieldValue(removeCommand, "membershipManagement", membershipManagement);
        setFieldValue(removeCommand, "memberId", 1);
        
        Member mockMember = new Member();
        mockMember.setMemberId(1);
        mockMember.setFirstName("John");
        mockMember.setLastName("Doe");
        
        when(membershipManagement.deleteMember(1)).thenReturn(mockMember);

        // Act
        removeCommand.run();

        // Assert
        verify(membershipManagement).deleteMember(1);
        assertTrue(outContent.toString().contains("✅ Member 'John Doe' (ID: 1) removed successfully"));
    }

    @Test
    public void testRemoveMemberCommandNotFound() throws MemberNotFoundException {
        // Arrange
        MemberCommand.RemoveMemberCommand removeCommand = new MemberCommand.RemoveMemberCommand();
        setFieldValue(removeCommand, "membershipManagement", membershipManagement);
        setFieldValue(removeCommand, "memberId", 999);
        
        when(membershipManagement.deleteMember(999))
            .thenThrow(new MemberNotFoundException(999));

        // Act
        removeCommand.run();

        // Assert
        assertTrue(errContent.toString().contains("❌ Member not found: Member with ID 999 not found"));
    }

    @Test
    public void testRemoveMemberCommandGeneralError() throws MemberNotFoundException {
        // Arrange
        MemberCommand.RemoveMemberCommand removeCommand = new MemberCommand.RemoveMemberCommand();
        setFieldValue(removeCommand, "membershipManagement", membershipManagement);
        setFieldValue(removeCommand, "memberId", 1);
        
        when(membershipManagement.deleteMember(1))
            .thenThrow(new RuntimeException("Database connection error"));

        // Act
        removeCommand.run();

        // Assert
        assertTrue(errContent.toString().contains("❌ Error removing member: Database connection error"));
    }

    @Test
public void testListMembersCommandEmpty() {
    // Arrange
    MemberCommand.ListMembersCommand listCommand = new MemberCommand.ListMembersCommand();
    setFieldValue(listCommand, "membershipManagement", membershipManagement);
    
    when(membershipManagement.listAllMembers()).thenReturn(Collections.emptyList());

    // Act
    listCommand.run();

    // Assert
    verify(membershipManagement).listAllMembers(); // Add this verification
    assertTrue(outContent.toString().contains("📝 No members found"));
}

    @Test
    public void testListMembersCommandWithData() {
        // Arrange
        MemberCommand.ListMembersCommand listCommand = new MemberCommand.ListMembersCommand();
        setFieldValue(listCommand, "membershipManagement", membershipManagement);
        
        Member member1 = new Member();
        member1.setMemberId(1);
        member1.setFirstName("John");
        member1.setLastName("Doe");
        member1.setEmail("john@email.com");
        member1.setMembershipType(MembershipType.PREMIUM);
        
        Member member2 = new Member();
        member2.setMemberId(2);
        member2.setFirstName("Jane");
        member2.setLastName("Smith");
        member2.setEmail("jane@email.com");
        member2.setMembershipType(MembershipType.BASIC);
        
        List<Member> members = Arrays.asList(member1, member2);
        when(membershipManagement.listAllMembers()).thenReturn(members);

        // Act
        listCommand.run();

        // Assert
        String output = outContent.toString();
        assertTrue(output.contains("👥 All Members:"));
        assertTrue(output.contains("ID: 1 | Name: John Doe | Email: john@email.com | Type: PREMIUM"));
        assertTrue(output.contains("ID: 2 | Name: Jane Smith | Email: jane@email.com | Type: BASIC"));
    }

    @Test
    public void testGetMemberCommandSuccess() throws MemberNotFoundException {
        // Arrange
        MemberCommand.GetMemberCommand getCommand = new MemberCommand.GetMemberCommand();
        setFieldValue(getCommand, "membershipManagement", membershipManagement);
        setFieldValue(getCommand, "memberId", 1);
        
        Member mockMember = new Member();
        mockMember.setMemberId(1);
        mockMember.setFirstName("John");
        mockMember.setLastName("Doe");
        mockMember.setEmail("john@email.com");
        mockMember.setPhoneNumber("1234567890");
        mockMember.setMembershipType(MembershipType.PREMIUM);
        
        when(membershipManagement.findMemberById(1)).thenReturn(mockMember);

        // Act
        getCommand.run();

        // Assert
        String output = outContent.toString();
        assertTrue(output.contains("👤 Member Details:"));
        assertTrue(output.contains("ID: 1"));
        assertTrue(output.contains("Name: John Doe"));
        assertTrue(output.contains("Email: john@email.com"));
        assertTrue(output.contains("Phone: 1234567890"));
        assertTrue(output.contains("Membership Type: PREMIUM"));
    }

    @Test
    public void testGetMemberCommandNotFound() throws MemberNotFoundException {
        // Arrange
        MemberCommand.GetMemberCommand getCommand = new MemberCommand.GetMemberCommand();
        setFieldValue(getCommand, "membershipManagement", membershipManagement);
        setFieldValue(getCommand, "memberId", 999);
        
        when(membershipManagement.findMemberById(999))
            .thenThrow(new MemberNotFoundException(999));

        // Act
        getCommand.run();

        // Assert
        assertTrue(errContent.toString().contains("❌ Member not found: Member with ID 999 not found"));
    }

    @Test
    public void testGetMemberCommandGeneralError() throws MemberNotFoundException {
        // Arrange
        MemberCommand.GetMemberCommand getCommand = new MemberCommand.GetMemberCommand();
        setFieldValue(getCommand, "membershipManagement", membershipManagement);
        setFieldValue(getCommand, "memberId", 1);
        
        when(membershipManagement.findMemberById(1))
            .thenThrow(new RuntimeException("Database error"));

        // Act
        getCommand.run();

        // Assert
        assertTrue(errContent.toString().contains("❌ Error getting member: Database error"));
    }

    @Test
    public void testDefaultConstructor() {
        MemberCommand command = new MemberCommand();
        assertNotNull(command);
    }

    // Helper method to set private fields using reflection
    private void setFieldValue(Object target, String fieldName, Object value) {
        try {
            java.lang.reflect.Field field = target.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            field.set(target, value);
        } catch (NoSuchFieldException | IllegalAccessException e) {
            try {
                java.lang.reflect.Field field = target.getClass().getSuperclass().getDeclaredField(fieldName);
                field.setAccessible(true);
                field.set(target, value);
            } catch (NoSuchFieldException | IllegalAccessException ex) {
                throw new RuntimeException("Failed to set field: " + fieldName, ex);
            }
        }
    }
}

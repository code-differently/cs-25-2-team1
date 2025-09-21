package com.codedifferently.cs_252_team1.fitnessManagementApp.cli;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.codedifferently.cs_252_team1.fitnessManagementApp.Member;
import com.codedifferently.cs_252_team1.fitnessManagementApp.MemberNotFoundException;
import com.codedifferently.cs_252_team1.fitnessManagementApp.MembershipManagement;
import com.codedifferently.cs_252_team1.fitnessManagementApp.MembershipStatus;
import com.codedifferently.cs_252_team1.fitnessManagementApp.MembershipType;
import com.codedifferently.cs_252_team1.fitnessManagementApp.PaymentOption;

import picocli.CommandLine.Command;
import picocli.CommandLine.Option;
import picocli.CommandLine.Parameters;

@Component
@Command(name = "member", description = "Manage gym members",
         subcommands = {
             MemberCommand.AddMemberCommand.class,
             MemberCommand.RemoveMemberCommand.class,
             MemberCommand.ListMembersCommand.class,
             MemberCommand.GetMemberCommand.class
         })
public class MemberCommand implements Runnable {

    @Override
    public void run() {
        System.out.println("Use a subcommand: add, remove, list, get");
    }

    @Component
    @Command(name = "add", description = "Add a new member")
    public static class AddMemberCommand implements Runnable {
        
        @Autowired
        private MembershipManagement membershipManagement;

        @Option(names = {"-f", "--firstname"}, required = true, description = "Member first name")
        private String firstName;

        @Option(names = {"-l", "--lastname"}, required = true, description = "Member last name")
        private String lastName;

        @Option(names = {"-e", "--email"}, description = "Member email")
        private String email;

        @Option(names = {"-p", "--phone"}, description = "Member phone")
        private String phone;

        @Option(names = {"-t", "--type"}, description = "Membership type (BASIC, PREMIUM, VIP)")
        private MembershipType membershipType = MembershipType.BASIC;

        @Option(names = {"-po", "--payment"}, description = "Payment option (CASH, CREDIT_CARD, DEBIT_CARD, BANK_TRANSFER)")
        private PaymentOption paymentOption = PaymentOption.CASH;

        @Option(names = {"-s", "--status"}, description = "Membership status (ACTIVE, INACTIVE)")
        private MembershipStatus membershipStatus = MembershipStatus.ACTIVE;

        @Override
        public void run() {
            try {
                Member member = membershipManagement.addMember(firstName, lastName, email, phone, 
                                                             membershipType, paymentOption, membershipStatus);
                System.out.printf("✅ Member '%s %s' added successfully with ID: %d%n", firstName, lastName, member.getMemberId());
            } catch (Exception e) {
                System.err.printf("❌ Error adding member: %s%n", e.getMessage());
            }
        }
    }

    @Component
    @Command(name = "remove", description = "Remove a member")
    public static class RemoveMemberCommand implements Runnable {
        
        @Autowired
        private MembershipManagement membershipManagement;

        @Parameters(index = "0", description = "Member ID to remove")
        private int memberId;

        @Override
        public void run() {
            try {
                Member removedMember = membershipManagement.removeMember(memberId);
                System.out.printf("✅ Member '%s' (ID: %d) removed successfully%n", removedMember.getFullName(), memberId);
            } catch (MemberNotFoundException e) {
                System.err.printf("❌ Member not found: %s%n", e.getMessage());
            } catch (Exception e) {
                System.err.printf("❌ Error removing member: %s%n", e.getMessage());
            }
        }
    }

    @Component
    @Command(name = "list", description = "List all members")
    public static class ListMembersCommand implements Runnable {
        
        @Autowired
        private MembershipManagement membershipManagement;

        @Override
        public void run() {
            var members = membershipManagement.getAllMembers();
            if (members.isEmpty()) {
                System.out.println("📝 No members found");
            } else {
                System.out.println("📋 All Members:");
                System.out.println("═".repeat(80));
                members.forEach(member -> {
                    System.out.printf("ID: %d | Name: %s | Email: %s | Type: %s | Status: %s%n",
                        member.getMemberId(),
                        member.getFullName(),
                        member.getEmail(),
                        member.getMembershipType(),
                        member.getMembershipStatus());
                });
            }
        }
    }

    @Component
    @Command(name = "get", description = "Get member details")
    public static class GetMemberCommand implements Runnable {
        
        @Autowired
        private MembershipManagement membershipManagement;

        @Parameters(index = "0", description = "Member ID")
        private int memberId;

        @Override
        public void run() {
            try {
                Member member = membershipManagement.findMemberById(memberId);
                System.out.println("👤 Member Details:");
                System.out.println("═".repeat(50));
                System.out.printf("ID: %d%n", member.getMemberId());
                System.out.printf("Name: %s%n", member.getFullName());
                System.out.printf("Email: %s%n", member.getEmail());
                System.out.printf("Phone: %s%n", member.getPhoneNumber());
                System.out.printf("Membership Type: %s%n", member.getMembershipType());
                System.out.printf("Payment Option: %s%n", member.getPaymentOption());
                System.out.printf("Status: %s%n", member.getMembershipStatus());
                System.out.printf("Membership Date: %s%n", member.getMembershipDate());
                System.out.printf("Years of Membership: %d%n", member.getYearsOfMembership());
            } catch (MemberNotFoundException e) {
                System.err.printf("❌ Member not found: %s%n", e.getMessage());
            } catch (Exception e) {
                System.err.printf("❌ Error getting member: %s%n", e.getMessage());
            }
        }
    }
}

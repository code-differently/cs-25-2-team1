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
             MemberCommand.UpdateMemberCommand.class,
             MemberCommand.RemoveMemberCommand.class,
             MemberCommand.ListMembersCommand.class,
             MemberCommand.GetMemberCommand.class
         })
public class MemberCommand implements Runnable {

    @Override
    public void run() {
        System.out.println("Use a subcommand: add, update, remove, list, get");
    }

    @Component
    @Command(name = "add", description = "Add a new member")
    public static class AddMemberCommand implements Runnable {
        
        @Autowired
        private MembershipManagement membershipManagement;

        @Option(names = {"-f", "--firstname"}, required = true, description = "Member first name")
        public String firstName;

        @Option(names = {"-l", "--lastname"}, required = true, description = "Member last name")
        public String lastName;

        @Option(names = {"-e", "--email"}, description = "Member email")
        public String email;

        @Option(names = {"-p", "--phone"}, description = "Member phone")
        public String phone;

        @Option(names = {"-t", "--type"}, description = "Membership type (BASIC, PREMIUM, VIP)")
        public MembershipType membershipType = MembershipType.BASIC;

        @Option(names = {"-po", "--payment"}, description = "Payment option (CASH, CREDIT_CARD, DEBIT_CARD, BANK_TRANSFER)")
        public PaymentOption paymentOption = PaymentOption.CASH;

        @Option(names = {"-s", "--status"}, description = "Membership status (ACTIVE, INACTIVE)")
        public MembershipStatus membershipStatus = MembershipStatus.ACTIVE;

        public void setMembershipManagement(MembershipManagement membershipManagement) {
            this.membershipManagement = membershipManagement;
        }

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
    @Command(name = "update", description = "Update an existing member")
    public static class UpdateMemberCommand implements Runnable {
        
        @Autowired
        private MembershipManagement membershipManagement;

        @Parameters(index = "0", description = "Member ID to update")
        public int memberId;

        @Option(names = {"-f", "--firstname"}, description = "Member first name")
        public String firstName;

        @Option(names = {"-l", "--lastname"}, description = "Member last name")
        public String lastName;

        @Option(names = {"-e", "--email"}, description = "Member email")
        public String email;

        @Option(names = {"-p", "--phone"}, description = "Member phone")
        public String phone;

        @Option(names = {"-t", "--type"}, description = "Membership type (BASIC, PREMIUM, VIP)")
        public MembershipType membershipType;

        @Option(names = {"-po", "--payment"}, description = "Payment option (CASH, CREDIT_CARD, DEBIT_CARD, BANK_TRANSFER)")
        public PaymentOption paymentOption;

        @Option(names = {"-s", "--status"}, description = "Membership status (ACTIVE, INACTIVE)")
        public MembershipStatus membershipStatus;

        public void setMembershipManagement(MembershipManagement membershipManagement) {
            this.membershipManagement = membershipManagement;
        }

        @Override
        public void run() {
            try {
                Member updatedMember = membershipManagement.updateMember(memberId, firstName, lastName, email, phone, 
                                                                        membershipType, paymentOption, membershipStatus);
                System.out.printf("✅ Member '%s %s' (ID: %d) updated successfully%n", 
                    updatedMember.getFirstName(), updatedMember.getLastName(), memberId);
                System.out.printf("📝 Updated details: Email: %s | Type: %s | Status: %s%n", 
                    updatedMember.getEmail(), updatedMember.getMembershipType(), updatedMember.getMembershipStatus());
            } catch (MemberNotFoundException e) {
                System.err.printf("❌ Member not found: %s%n", e.getMessage());
            } catch (Exception e) {
                System.err.printf("❌ Error updating member: %s%n", e.getMessage());
            }
        }
    }

    @Component
    @Command(name = "remove", description = "Remove a member")
    public static class RemoveMemberCommand implements Runnable {
        
        @Autowired
        public MembershipManagement membershipManagement;

        @Parameters(index = "0", description = "Member ID to remove")
        public int memberId;

        public void setMembershipManagement(MembershipManagement membershipManagement) {
            this.membershipManagement = membershipManagement;
        }

        @Override
        public void run() {
            try {
                Member removedMember = membershipManagement.deleteMember(memberId);
                System.out.printf("✅ Member '%s %s' (ID: %d) removed successfully%n", 
                    removedMember.getFirstName(), removedMember.getLastName(), memberId);
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
        public MembershipManagement membershipManagement;

        public void setMembershipManagement(MembershipManagement membershipManagement) {
            this.membershipManagement = membershipManagement;
        }

        @Override
        public void run() {
            var members = membershipManagement.listAllMembers();
            if (members.isEmpty()) {
                System.out.println("📝 No members found");
            } else {
                System.out.println("👥 All Members:");
                System.out.println("═".repeat(80));
                members.forEach(member -> {
                    System.out.printf("ID: %d | Name: %s %s | Email: %s | Type: %s%n",
                        member.getMemberId(),
                        member.getFirstName(),
                        member.getLastName(),
                        member.getEmail(),
                        member.getMembershipType());
                });
            }
        }
    }

    @Component
    @Command(name = "get", description = "Get member details")
    public static class GetMemberCommand implements Runnable {
        
        @Autowired
        public MembershipManagement membershipManagement;

        @Parameters(index = "0", description = "Member ID")
        public int memberId;

        public void setMembershipManagement(MembershipManagement membershipManagement) {
            this.membershipManagement = membershipManagement;
        }

        @Override
        public void run() {
            try {
                Member member = membershipManagement.findMemberById(memberId);
                System.out.println("👤 Member Details:");
                System.out.println("═".repeat(50));
                System.out.printf("ID: %d%n", member.getMemberId());
                System.out.printf("Name: %s %s%n", member.getFirstName(), member.getLastName());
                System.out.printf("Email: %s%n", member.getEmail());
                System.out.printf("Phone: %s%n", member.getPhoneNumber());
                System.out.printf("Membership Type: %s%n", member.getMembershipType());
                System.out.printf("Payment Option: %s%n", member.getPaymentOption());
                System.out.printf("Status: %s%n", member.getMembershipStatus());
                if (member.getMembershipDate() != null) {
                    System.out.printf("Membership Date: %s%n", member.getMembershipDate());
                }
            } catch (MemberNotFoundException e) {
                System.err.printf("❌ Member not found: %s%n", e.getMessage());
            } catch (Exception e) {
                System.err.printf("❌ Error getting member: %s%n", e.getMessage());
            }
        }
    }
}


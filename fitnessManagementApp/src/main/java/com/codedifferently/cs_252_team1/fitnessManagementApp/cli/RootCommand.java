package com.codedifferently.cs_252_team1.fitnessManagementApp.cli;

import org.springframework.stereotype.Component;

import picocli.CommandLine.Command;

@Component
@Command(
    name = "fitness-app",
    description = "CLI for Fitness Management App",
    subcommands = {MemberCommand.class, EmployeeCommand.class}
)
public class RootCommand implements Runnable {
    
    @Override
    public void run() {
        System.out.println("🏋️ Welcome to Fitness Management App CLI");
        System.out.println("Available commands:");
        System.out.println("  member     - Manage gym members");
        System.out.println("  employee   - Manage gym employees");
        System.out.println();
        System.out.println("Use --help with any command for more information.");
    }
}

package com.codedifferently.cs_252_team1.fitnessManagementApp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;

import picocli.CommandLine;

@SpringBootApplication
public class FitnessManagementAppApplication {

	public static void main(String[] args) {
		ApplicationContext ctx = SpringApplication.run(FitnessManagementAppApplication.class, args);
		
		// If CLI arguments are provided, run CLI mode
		if (args.length > 0) {
			CommandLine commandLine = ctx.getBean(CommandLine.class);
			int exitCode = commandLine.execute(args);
			System.exit(exitCode);
		}
		
		// Otherwise, continue as a regular Spring Boot application
		System.out.println("🏋️ Fitness Management App started successfully!");
		System.out.println("Use CLI by providing arguments or access via web interface.");
	}

}

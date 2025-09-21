package com.codedifferently.cs_252_team1.fitnessManagementApp.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.codedifferently.cs_252_team1.fitnessManagementApp.cli.RootCommand;

import picocli.CommandLine;
import picocli.spring.PicocliSpringFactory;

@Configuration
public class CliConfiguration {

    @Autowired
    private ApplicationContext applicationContext;

    @Bean
    public CommandLine commandLine(RootCommand rootCommand) {
        return new CommandLine(rootCommand, new PicocliSpringFactory(applicationContext));
    }
}

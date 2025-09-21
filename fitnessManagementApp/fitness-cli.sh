#!/bin/bash

# Fitness Management App CLI Helper Script
# This script makes it easier to run CLI commands

JAR_PATH="build/libs/fitnessManagementApp-0.0.1-SNAPSHOT.jar"

if [ ! -f "$JAR_PATH" ]; then
    echo "Error: JAR file not found. Please run './gradlew build' first."
    exit 1
fi

# If no arguments provided, show help
if [ $# -eq 0 ]; then
    echo "🏋️ Fitness Management App CLI"
    echo "Usage: $0 [command] [options]"
    echo ""
    echo "Member Management Examples:"
    echo "  $0 member add --firstname \"John\" --lastname \"Doe\" --email \"john@example.com\""
    echo "  $0 member list"
    echo "  $0 member get 1"
    echo ""
    echo "Employee Management Examples:"
    echo "  $0 employee add --firstname \"Jane\" --lastname \"Smith\" --email \"jane@gym.com\" --phone \"555-1234\" --department \"Management\" --position \"Manager\" --salary 75000"
    echo "  $0 employee list"
    echo "  $0 employee get 1"
    echo ""
    echo "  $0 --help"
    echo ""
    exit 0
fi

# Run the JAR with provided arguments
java -jar "$JAR_PATH" "$@"

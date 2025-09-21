# Fitness Management App CLI

This Spring Boot application now includes a Command Line Interface (CLI) for managing gym members and employees.

## Features

- **Member Management**: Add, remove, list, and view member details
- **Employee Management**: Add, remove, list, and view employee details
- **Spring Boot Integration**: Fully integrated with Spring dependency injection
- **Picocli Framework**: Modern CLI framework with help documentation
- **Flexible Arguments**: Support for various membership types, payment options, and work statuses

## Building the Application

```bash
./gradlew clean build
```

## Running the CLI

### Method 1: Direct JAR execution
```bash
java -jar build/libs/fitnessManagementApp-0.0.1-SNAPSHOT.jar [command] [options]
```

### Method 2: Using the helper script
```bash
./fitness-cli.sh [command] [options]
```

## Available Commands

### Member Management

#### Add a new member
```bash
# Add member with email
./fitness-cli.sh member add --firstname "John" --lastname "Doe" --email "john.doe@example.com"

# Add member with phone
./fitness-cli.sh member add --firstname "Jane" --lastname "Smith" --phone "555-1234"

# Add member with full options
./fitness-cli.sh member add \
  --firstname "Alice" \
  --lastname "Johnson" \
  --email "alice@example.com" \
  --phone "555-5678" \
  --type "PREMIUM" \
  --payment "CREDIT_CARD" \
  --status "ACTIVE"
```

**Available Membership Types:**
- `BASIC` (default)
- `PREMIUM`
- `VIP`

**Available Payment Options:**
- `CASH` (default)
- `CREDIT_CARD`
- `DEBIT_CARD`
- `BANK_TRANSFER`

**Available Membership Status:**
- `ACTIVE` (default)
- `INACTIVE`

#### List all members
```bash
./fitness-cli.sh member list
```

#### Get member details
```bash
./fitness-cli.sh member get [member-id]
```

#### Remove a member
```bash
./fitness-cli.sh member remove [member-id]
```

### Employee Management

#### Add a new employee
```bash
# Add employee with all required fields
./fitness-cli.sh employee add \
  --firstname "John" \
  --lastname "Smith" \
  --email "john.smith@fitnessgym.com" \
  --phone "555-1234" \
  --department "Management" \
  --position "Manager" \
  --salary 75000

# Add employee with work status
./fitness-cli.sh employee add \
  --firstname "Jane" \
  --lastname "Doe" \
  --email "jane.doe@fitnessgym.com" \
  --phone "555-5678" \
  --department "Fitness" \
  --position "Trainer" \
  --salary 45000 \
  --status "ACTIVE"
```

**Available Work Status:**
- `ACTIVE` (default)
- `INACTIVE`
- `TERMINATED`
- `ON_LEAVE`

#### List all employees
```bash
./fitness-cli.sh employee list
```

#### Get employee details
```bash
./fitness-cli.sh employee get [employee-id]
```

#### Remove an employee
```bash
./fitness-cli.sh employee remove [employee-id]
```

### Help Commands

```bash
# General help
./fitness-cli.sh --help

# Member command help
./fitness-cli.sh member --help

# Employee command help
./fitness-cli.sh employee --help

# Specific subcommand help
./fitness-cli.sh member add --help
./fitness-cli.sh employee add --help
```

## Examples

```bash
# Build the application
./gradlew clean build

# Add some members
./fitness-cli.sh member add --firstname "John" --lastname "Doe" --email "john@example.com"
./fitness-cli.sh member add --firstname "Jane" --lastname "Smith" --phone "555-1234" --type "PREMIUM"

# Add some employees
./fitness-cli.sh employee add --firstname "Mike" --lastname "Johnson" --email "mike@fitnessgym.com" --phone "555-9999" --department "Management" --position "Manager" --salary 75000
./fitness-cli.sh employee add --firstname "Sarah" --lastname "Wilson" --email "sarah@fitnessgym.com" --phone "555-8888" --department "Fitness" --position "Trainer" --salary 45000

# List all members and employees
./fitness-cli.sh member list
./fitness-cli.sh employee list

# Get details for member and employee ID 1
./fitness-cli.sh member get 1
./fitness-cli.sh employee get 1

# Remove member ID 2 and employee ID 2
./fitness-cli.sh member remove 2
./fitness-cli.sh employee remove 2
```

## Running as Web Application

If you run the application without CLI arguments, it will start as a regular Spring Boot web application:

```bash
java -jar build/libs/fitnessManagementApp-0.0.1-SNAPSHOT.jar
```

The application will start on `http://localhost:8080`

## Technical Details

- **Framework**: Spring Boot 3.5.5
- **CLI Library**: Picocli 4.7.6
- **Java Version**: 17+
- **Build Tool**: Gradle

## Architecture

The CLI is implemented using:
- `@Component` annotations for Spring dependency injection
- `PicocliSpringFactory` for integrating Picocli with Spring
- Subcommand structure for organized command hierarchy
- Service layer integration for business logic

Each CLI command is a separate Spring component that can autowire other services, ensuring full integration with the Spring application context.

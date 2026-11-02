package com.vms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point for the Office Visitor Management System Spring Boot application.
 */
@SpringBootApplication
public class VisitorManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(VisitorManagementApplication.class, args);
        System.out.println("==========================================================");
        System.out.println("  Office Visitor Management System Started Successfully!  ");
        System.out.println("  Access Dashboard: http://localhost:8080/                ");
        System.out.println("  REST API Base:   http://localhost:8080/api/visitors    ");
        System.out.println("==========================================================");
    }
}

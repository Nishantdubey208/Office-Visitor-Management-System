-- =====================================================================
-- Database Initialization Script for Office Visitor Management System
-- Database Name: visitor_management_db
-- =====================================================================

CREATE DATABASE IF NOT EXISTS visitor_management_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE visitor_management_db;

-- Create Visitors Table (Preserves existing visitor data)
CREATE TABLE IF NOT EXISTS visitors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    visitor_id VARCHAR(30) NOT NULL UNIQUE,
    visitor_name VARCHAR(100) NOT NULL,
    mobile_number VARCHAR(15) NOT NULL,
    email VARCHAR(100) DEFAULT NULL,
    person_to_visit VARCHAR(50) NOT NULL,
    purpose VARCHAR(50) NOT NULL,
    visit_date DATE NOT NULL,
    visit_time TIME NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Checked In',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    checkout_time TIMESTAMP NULL DEFAULT NULL,
    INDEX idx_mobile_number (mobile_number),
    INDEX idx_visitor_name (visitor_name),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Admin Users Table (For Secure BCrypt-based Authentication)
CREATE TABLE IF NOT EXISTS admin_users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) DEFAULT NULL,
    full_name VARCHAR(100) DEFAULT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'ROLE_ADMIN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL DEFAULT NULL,
    INDEX idx_admin_username (username),
    INDEX idx_admin_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

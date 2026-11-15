
-- ============================================
-- KEKEGO CAMPUS TRANSPORTATION SYSTEM
-- DATABASE: campus_keke
-- VERSION: 1.0
-- ============================================


-- STEP 1: CREATE DATABASE
CREATE DATABASE IF NOT EXISTS campus_keke
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;


-- STEP 2: SELECT DATABASE
USE campus_keke;


-- ============================================
-- TABLE 1: STUDENTS
-- Stores student registration information
-- ============================================

CREATE TABLE IF NOT EXISTS students (

    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    full_name VARCHAR(150) NOT NULL,

    email VARCHAR(150) NOT NULL UNIQUE,

    phone VARCHAR(20) NOT NULL UNIQUE,

    matric_number VARCHAR(50) NOT NULL UNIQUE,

    password_hash VARCHAR(255) NOT NULL,

    email_verified_at DATETIME NULL,

    account_status VARCHAR(20) NOT NULL DEFAULT 'pending',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_student_status
    CHECK (
        account_status IN (
            'pending',
            'active',
            'suspended'
        )
    )

) ENGINE=InnoDB;


-- ============================================
-- TABLE 2: EMAIL_VERIFICATIONS
-- Stores student email verification records
-- ============================================

CREATE TABLE IF NOT EXISTS email_verifications (

    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    student_id BIGINT UNSIGNED NOT NULL,

    otp_hash CHAR(64) NOT NULL,

    expires_at DATETIME NOT NULL,

    attempts TINYINT UNSIGNED DEFAULT 0,

    max_attempts TINYINT UNSIGNED DEFAULT 5,

    consumed_at DATETIME NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_verification_student

    FOREIGN KEY (student_id)

    REFERENCES students(id)

    ON DELETE CASCADE,

    INDEX idx_student_verification (student_id),

    INDEX idx_otp_expiration (expires_at)

) ENGINE=InnoDB;



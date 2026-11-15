-- ========================================================
-- REDLINE CYBER SAFETY & THREAT INTELLIGENCE ECOSYSTEM
-- Production Database Schema (MySQL 8.0+)
-- ========================================================

CREATE DATABASE IF NOT EXISTS `redline_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `redline_db`;

-- Users Table
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(80) NOT NULL UNIQUE,
    `email` VARCHAR(120) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `role` VARCHAR(20) DEFAULT 'user',
    `awareness_score` INT DEFAULT 0,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_username` (`username`),
    INDEX `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Threat Categories
CREATE TABLE IF NOT EXISTS `threat_categories` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `slug` VARCHAR(60) NOT NULL UNIQUE,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NOT NULL,
    `icon` VARCHAR(50) DEFAULT 'ShieldAlert',
    `display_order` INT DEFAULT 0,
    INDEX `idx_category_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Threats Table
CREATE TABLE IF NOT EXISTS `threats` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `category_id` INT NOT NULL,
    `slug` VARCHAR(80) NOT NULL UNIQUE,
    `name` VARCHAR(120) NOT NULL,
    `short_desc` VARCHAR(255) NOT NULL,
    `risk_category` VARCHAR(40) DEFAULT 'High',
    `difficulty` VARCHAR(30) DEFAULT 'Beginner',
    `icon` VARCHAR(50) DEFAULT 'AlertTriangle',
    `views_count` INT DEFAULT 0,
    `full_content` LONGTEXT NOT NULL,
    INDEX `idx_threat_slug` (`slug`),
    INDEX `idx_threat_category` (`category_id`),
    CONSTRAINT `fk_threat_category` FOREIGN KEY (`category_id`) REFERENCES `threat_categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Security Tools Metadata
CREATE TABLE IF NOT EXISTS `security_tools` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `slug` VARCHAR(60) NOT NULL UNIQUE,
    `name` VARCHAR(100) NOT NULL,
    `short_desc` VARCHAR(255) NOT NULL,
    `icon` VARCHAR(50) DEFAULT 'Shield',
    `route` VARCHAR(100) NOT NULL,
    `badge` VARCHAR(50) DEFAULT 'Client/Server',
    `features_json` TEXT,
    INDEX `idx_tool_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Learning Modules
CREATE TABLE IF NOT EXISTS `learning_modules` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `slug` VARCHAR(80) NOT NULL UNIQUE,
    `title` VARCHAR(150) NOT NULL,
    `topic` VARCHAR(60) NOT NULL,
    `level` VARCHAR(30) DEFAULT 'Beginner',
    `duration_minutes` INT DEFAULT 10,
    `points` INT DEFAULT 50,
    `summary` TEXT NOT NULL,
    `steps_json` LONGTEXT,
    INDEX `idx_module_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Quiz Questions
CREATE TABLE IF NOT EXISTS `quiz_questions` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `category` VARCHAR(60) NOT NULL,
    `level` VARCHAR(30) DEFAULT 'Beginner',
    `question` TEXT NOT NULL,
    `options_json` TEXT NOT NULL,
    `correct_index` INT NOT NULL,
    `explanation` TEXT NOT NULL,
    INDEX `idx_quiz_cat_level` (`category`, `level`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Quiz Attempts
CREATE TABLE IF NOT EXISTS `quiz_attempts` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NULL,
    `category` VARCHAR(60) DEFAULT 'General',
    `level` VARCHAR(30) DEFAULT 'Beginner',
    `score` INT NOT NULL,
    `max_score` INT NOT NULL,
    `percentage` FLOAT DEFAULT 0.0,
    `completed_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_attempt_user` (`user_id`),
    CONSTRAINT `fk_attempt_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User Learning Progress
CREATE TABLE IF NOT EXISTS `user_progress` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `item_type` VARCHAR(40) NOT NULL,
    `item_id` VARCHAR(80) NOT NULL,
    `completed` BOOLEAN DEFAULT FALSE,
    `points_earned` INT DEFAULT 0,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_user_progress` (`user_id`, `item_type`),
    CONSTRAINT `fk_progress_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Saved Articles / Bookmarks
CREATE TABLE IF NOT EXISTS `saved_articles` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `threat_id` INT NOT NULL,
    `saved_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_saved_user` (`user_id`),
    CONSTRAINT `fk_saved_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_saved_threat` FOREIGN KEY (`threat_id`) REFERENCES `threats` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Cyber Alerts & Threat Advisories
CREATE TABLE IF NOT EXISTS `cyber_alerts` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `source` VARCHAR(80) NOT NULL,
    `severity` VARCHAR(30) DEFAULT 'Medium',
    `category` VARCHAR(60) DEFAULT 'Fraud Alert',
    `summary` TEXT NOT NULL,
    `recommended_action` TEXT,
    `original_url` VARCHAR(255),
    `affected_systems` VARCHAR(150) DEFAULT 'General Users / Android / Web',
    `published_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `is_active` BOOLEAN DEFAULT TRUE,
    INDEX `idx_alert_severity` (`severity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

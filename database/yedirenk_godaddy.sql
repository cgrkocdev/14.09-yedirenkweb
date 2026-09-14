SET NAMES utf8mb4;
SET time_zone = '+03:00';

CREATE TABLE IF NOT EXISTS users (
  id CHAR(32) PRIMARY KEY,
  email VARCHAR(254) NOT NULL UNIQUE,
  first_name VARCHAR(80) NOT NULL,
  last_name VARCHAR(80) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at_ms BIGINT UNSIGNED NOT NULL,
  last_login_at_ms BIGINT UNSIGNED NOT NULL,
  active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_users_created (created_at_ms)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cms_content (
  content_key VARCHAR(64) PRIMARY KEY,
  content_json LONGTEXT NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS applications (
  id CHAR(32) PRIMARY KEY, type VARCHAR(40) NOT NULL, name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL, phone VARCHAR(40) NOT NULL, subject VARCHAR(120) NOT NULL,
  message TEXT NOT NULL, consent TINYINT(1) NOT NULL, status VARCHAR(30) NOT NULL DEFAULT 'received',
  created_at_ms BIGINT UNSIGNED NOT NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_applications_created (created_at_ms), INDEX idx_applications_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS donations (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, reference_number VARCHAR(40) NOT NULL UNIQUE,
  first_name VARCHAR(80) NOT NULL, last_name VARCHAR(80) NOT NULL, phone VARCHAR(30) NOT NULL,
  email VARCHAR(254) NOT NULL, description VARCHAR(500) NOT NULL, city VARCHAR(100) NOT NULL DEFAULT '',
  district VARCHAR(100) NOT NULL DEFAULT '', campaign VARCHAR(500) NOT NULL, amount DECIMAL(15,2) NOT NULL,
  payment_method VARCHAR(40) NOT NULL, bank_account_code VARCHAR(10) NOT NULL,
  bank_account_iban VARCHAR(40) NOT NULL, transfer_amount DECIMAL(15,2) NOT NULL,
  items_json TEXT NOT NULL, receipt_original_name VARCHAR(120) NOT NULL, receipt_stored_name VARCHAR(100) NOT NULL,
  receipt_mime VARCHAR(80) NOT NULL, receipt_size INT UNSIGNED NOT NULL, consent TINYINT(1) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'received', created_at_ms BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_donations_created (created_at_ms), INDEX idx_donations_email (email), INDEX idx_donations_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS analytics_events (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, event_name VARCHAR(40) NOT NULL,
  session_id VARCHAR(80) NOT NULL, path VARCHAR(300) NOT NULL, referrer VARCHAR(500) NOT NULL DEFAULT '',
  data_json TEXT NOT NULL, ip VARCHAR(64) NOT NULL, user_agent VARCHAR(300) NOT NULL DEFAULT '',
  created_at_ms BIGINT UNSIGNED NOT NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_analytics_created (created_at), INDEX idx_analytics_session (session_id), INDEX idx_analytics_event (event_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS analytics_geo_cache (
  ip VARCHAR(64) PRIMARY KEY,
  country_code VARCHAR(12) NOT NULL DEFAULT '', country VARCHAR(100) NOT NULL DEFAULT '',
  region VARCHAR(120) NOT NULL DEFAULT '', city VARCHAR(120) NOT NULL DEFAULT '',
  timezone VARCHAR(100) NOT NULL DEFAULT '', isp VARCHAR(180) NOT NULL DEFAULT '',
  updated_at_ms BIGINT UNSIGNED NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_geo_updated (updated_at_ms)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

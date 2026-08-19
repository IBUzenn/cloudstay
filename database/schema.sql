-- =============================================================
-- CloudStay — Database Schema
-- MySQL 8.0 (Amazon RDS)
-- File: database/schema.sql
-- Run: mysql -u root -p cloudstay < database/schema.sql
-- =============================================================

-- Create and select database
CREATE DATABASE IF NOT EXISTS cloudstay
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE cloudstay;

-- Disable foreign key checks during schema creation
SET FOREIGN_KEY_CHECKS = 0;

-- =============================================================
-- TABLE: users
-- =============================================================
CREATE TABLE IF NOT EXISTS users (
    id            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    name          VARCHAR(100)    NOT NULL,
    email         VARCHAR(255)    NOT NULL,
    student_id    VARCHAR(50)     NULL COMMENT 'University student ID — NULL for admin/manager',
    password_hash VARCHAR(255)    NOT NULL,
    role          ENUM('student','manager','admin') NOT NULL DEFAULT 'student',
    is_active     TINYINT(1)      NOT NULL DEFAULT 1,
    created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_users_email      (email),
    UNIQUE KEY uq_users_student_id (student_id),
    INDEX idx_users_role           (role),
    INDEX idx_users_is_active      (is_active)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Platform users: students, managers, admins';


-- =============================================================
-- TABLE: hostels
-- =============================================================
CREATE TABLE IF NOT EXISTS hostels (
    id              INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    name            VARCHAR(150)    NOT NULL,
    location        VARCHAR(255)    NOT NULL,
    description     TEXT            NULL,
    amenities       JSON            NULL COMMENT 'Array of amenity strings e.g. ["WiFi","Laundry"]',
    contact_email   VARCHAR(255)    NULL,
    contact_phone   VARCHAR(20)     NULL,
    total_rooms     INT UNSIGNED    NOT NULL DEFAULT 0 COMMENT 'Denormalised count, updated by trigger',
    is_active       TINYINT(1)      NOT NULL DEFAULT 1,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    INDEX idx_hostels_is_active  (is_active),
    INDEX idx_hostels_location   (location),
    FULLTEXT INDEX ft_hostels_search (name, location, description)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Hostel buildings available for booking';


-- =============================================================
-- TABLE: rooms
-- =============================================================
CREATE TABLE IF NOT EXISTS rooms (
    id                  INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    hostel_id           INT UNSIGNED    NOT NULL,
    room_number         VARCHAR(20)     NOT NULL,
    room_type           ENUM('single','double','triple','suite') NOT NULL DEFAULT 'single',
    capacity            TINYINT UNSIGNED NOT NULL DEFAULT 1,
    price_per_semester  DECIMAL(10,2)   NOT NULL,
    status              ENUM('available','booked','maintenance') NOT NULL DEFAULT 'available',
    description         TEXT            NULL,
    created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_rooms_hostel_number (hostel_id, room_number),
    INDEX idx_rooms_hostel_id  (hostel_id),
    INDEX idx_rooms_status     (status),
    INDEX idx_rooms_type       (room_type),
    INDEX idx_rooms_price      (price_per_semester),

    CONSTRAINT fk_rooms_hostel
        FOREIGN KEY (hostel_id) REFERENCES hostels(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Individual rooms within hostels';


-- =============================================================
-- TABLE: bookings
-- =============================================================
CREATE TABLE IF NOT EXISTS bookings (
    id              INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    student_id      INT UNSIGNED    NOT NULL,
    room_id         INT UNSIGNED    NOT NULL,
    hostel_id       INT UNSIGNED    NOT NULL COMMENT 'Denormalised for query performance',
    check_in_date   DATE            NOT NULL,
    check_out_date  DATE            NOT NULL,
    status          ENUM('pending','approved','rejected','cancelled') NOT NULL DEFAULT 'pending',
    receipt_url     VARCHAR(1000)   NULL COMMENT 'S3 object URL for payment receipt',
    reviewed_by     INT UNSIGNED    NULL COMMENT 'Admin/manager who actioned this booking',
    review_note     TEXT            NULL COMMENT 'Optional note from reviewer',
    reviewed_at     TIMESTAMP       NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    INDEX idx_bookings_student_id   (student_id),
    INDEX idx_bookings_room_id      (room_id),
    INDEX idx_bookings_hostel_id    (hostel_id),
    INDEX idx_bookings_status       (status),
    INDEX idx_bookings_reviewed_by  (reviewed_by),
    INDEX idx_bookings_check_in     (check_in_date),
    INDEX idx_bookings_created_at   (created_at),
    -- Composite index for admin dashboard queries
    INDEX idx_bookings_hostel_status (hostel_id, status),

    CONSTRAINT fk_bookings_student
        FOREIGN KEY (student_id) REFERENCES users(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_bookings_room
        FOREIGN KEY (room_id) REFERENCES rooms(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_bookings_hostel
        FOREIGN KEY (hostel_id) REFERENCES hostels(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_bookings_reviewer
        FOREIGN KEY (reviewed_by) REFERENCES users(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    -- Business rule: check-out must be after check-in
    CONSTRAINT chk_booking_dates
        CHECK (check_out_date > check_in_date)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Student hostel room bookings';


-- =============================================================
-- TABLE: refresh_tokens
-- Stores hashed refresh tokens for server-side invalidation
-- =============================================================
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    user_id     INT UNSIGNED    NOT NULL,
    token_hash  VARCHAR(255)    NOT NULL COMMENT 'bcrypt hash of the refresh token',
    expires_at  TIMESTAMP       NOT NULL,
    created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    INDEX idx_refresh_tokens_user_id    (user_id),
    INDEX idx_refresh_tokens_expires_at (expires_at),

    CONSTRAINT fk_refresh_tokens_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Server-side refresh token store for JWT invalidation';


-- =============================================================
-- RE-ENABLE foreign key checks
-- =============================================================
SET FOREIGN_KEY_CHECKS = 1;


-- =============================================================
-- TRIGGER: After INSERT on rooms — update hostels.total_rooms
-- =============================================================
DROP TRIGGER IF EXISTS trg_rooms_after_insert;
DELIMITER $$
CREATE TRIGGER trg_rooms_after_insert
    AFTER INSERT ON rooms
    FOR EACH ROW
BEGIN
    UPDATE hostels
    SET total_rooms = (
        SELECT COUNT(*) FROM rooms WHERE hostel_id = NEW.hostel_id
    )
    WHERE id = NEW.hostel_id;
END $$
DELIMITER ;

-- =============================================================
-- TRIGGER: After DELETE on rooms — update hostels.total_rooms
-- =============================================================
DROP TRIGGER IF EXISTS trg_rooms_after_delete;
DELIMITER $$
CREATE TRIGGER trg_rooms_after_delete
    AFTER DELETE ON rooms
    FOR EACH ROW
BEGIN
    UPDATE hostels
    SET total_rooms = (
        SELECT COUNT(*) FROM rooms WHERE hostel_id = OLD.hostel_id
    )
    WHERE id = OLD.hostel_id;
END $$
DELIMITER ;


-- =============================================================
-- VIEW: v_room_availability
-- Student-facing: available rooms with hostel info
-- =============================================================
CREATE OR REPLACE VIEW v_room_availability AS
SELECT
    r.id                    AS room_id,
    r.room_number,
    r.room_type,
    r.capacity,
    r.price_per_semester,
    r.status,
    r.description           AS room_description,
    h.id                    AS hostel_id,
    h.name                  AS hostel_name,
    h.location              AS hostel_location,
    h.amenities             AS hostel_amenities
FROM rooms r
INNER JOIN hostels h ON r.hostel_id = h.id
WHERE r.status = 'available'
  AND h.is_active = 1;


-- =============================================================
-- VIEW: v_booking_summary
-- Admin-facing: bookings joined with student and room info
-- =============================================================
CREATE OR REPLACE VIEW v_booking_summary AS
SELECT
    b.id                    AS booking_id,
    b.status,
    b.check_in_date,
    b.check_out_date,
    b.receipt_url,
    b.review_note,
    b.reviewed_at,
    b.created_at,
    u.id                    AS student_id,
    u.name                  AS student_name,
    u.email                 AS student_email,
    u.student_id            AS student_number,
    r.id                    AS room_id,
    r.room_number,
    r.room_type,
    r.price_per_semester,
    h.id                    AS hostel_id,
    h.name                  AS hostel_name,
    h.location              AS hostel_location,
    rev.name                AS reviewed_by_name
FROM bookings b
INNER JOIN users u  ON b.student_id  = u.id
INNER JOIN rooms r  ON b.room_id     = r.id
INNER JOIN hostels h ON b.hostel_id  = h.id
LEFT  JOIN users rev ON b.reviewed_by = rev.id;

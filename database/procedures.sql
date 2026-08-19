-- =============================================================
-- CloudStay — Stored Procedures
-- MySQL 8.0
-- File: database/procedures.sql
-- Run AFTER schema.sql:
--   mysql -u root -p cloudstay < database/procedures.sql
-- =============================================================

USE cloudstay;

DELIMITER $$

-- =============================================================
-- PROCEDURE: sp_get_available_rooms
-- Returns available rooms for a hostel with optional filters.
-- Params:
--   p_hostel_id   INT  — NULL returns all hostels
--   p_room_type   ENUM — NULL returns all types
--   p_max_price   DECIMAL — NULL skips price filter
-- =============================================================
DROP PROCEDURE IF EXISTS sp_get_available_rooms $$
CREATE PROCEDURE sp_get_available_rooms(
    IN p_hostel_id  INT UNSIGNED,
    IN p_room_type  VARCHAR(20),
    IN p_max_price  DECIMAL(10,2)
)
BEGIN
    SELECT
        r.id                    AS room_id,
        r.room_number,
        r.room_type,
        r.capacity,
        r.price_per_semester,
        r.description           AS room_description,
        h.id                    AS hostel_id,
        h.name                  AS hostel_name,
        h.location,
        h.amenities
    FROM rooms r
    INNER JOIN hostels h ON r.hostel_id = h.id
    WHERE r.status = 'available'
      AND h.is_active = 1
      AND (p_hostel_id IS NULL OR r.hostel_id = p_hostel_id)
      AND (p_room_type IS NULL  OR r.room_type  = p_room_type)
      AND (p_max_price IS NULL  OR r.price_per_semester <= p_max_price)
    ORDER BY r.price_per_semester ASC, h.name ASC;
END $$


-- =============================================================
-- PROCEDURE: sp_create_booking
-- Atomically checks room availability and creates a booking.
-- Prevents race conditions using SELECT ... FOR UPDATE.
-- Returns booking record on success, error signal on failure.
-- Params:
--   p_student_id    INT  — authenticated student user id
--   p_room_id       INT  — room to book
--   p_check_in      DATE
--   p_check_out     DATE
-- OUT:
--   p_booking_id    INT  — created booking id, NULL on failure
--   p_error_code    INT  — 0=success, 1=room_unavailable, 2=active_booking_exists
-- =============================================================
DROP PROCEDURE IF EXISTS sp_create_booking $$
CREATE PROCEDURE sp_create_booking(
    IN  p_student_id    INT UNSIGNED,
    IN  p_room_id       INT UNSIGNED,
    IN  p_check_in      DATE,
    IN  p_check_out     DATE,
    OUT p_booking_id    INT UNSIGNED,
    OUT p_error_code    TINYINT
)
sp_create_booking: BEGIN
    DECLARE v_hostel_id     INT UNSIGNED;
    DECLARE v_room_status   VARCHAR(20);
    DECLARE v_active_count  INT;

    -- Initialise outputs
    SET p_booking_id = NULL;
    SET p_error_code = 0;

    -- Start transaction for atomicity
    START TRANSACTION;

    -- Lock the room row to prevent concurrent bookings
    SELECT hostel_id, status
    INTO   v_hostel_id, v_room_status
    FROM   rooms
    WHERE  id = p_room_id
    FOR UPDATE;

    -- Check room availability
    IF v_room_status != 'available' THEN
        SET p_error_code = 1; -- room_unavailable
        ROLLBACK;
        LEAVE sp_create_booking;
    END IF;

    -- Check student has no active booking (pending or approved)
    SELECT COUNT(*)
    INTO   v_active_count
    FROM   bookings
    WHERE  student_id = p_student_id
      AND  status IN ('pending','approved');

    IF v_active_count > 0 THEN
        SET p_error_code = 2; -- active_booking_exists
        ROLLBACK;
        LEAVE sp_create_booking;
    END IF;

    -- Insert booking
    INSERT INTO bookings (student_id, room_id, hostel_id, check_in_date, check_out_date, status)
    VALUES (p_student_id, p_room_id, v_hostel_id, p_check_in, p_check_out, 'pending');

    SET p_booking_id = LAST_INSERT_ID();

    COMMIT;
END $$


-- =============================================================
-- PROCEDURE: sp_update_booking_status
-- Approves or rejects a booking.
-- When approved: sets room status = 'booked'.
-- When rejected/cancelled: sets room status = 'available'.
-- Params:
--   p_booking_id    INT
--   p_new_status    ENUM('approved','rejected','cancelled')
--   p_reviewed_by   INT  — user id performing the action
--   p_review_note   TEXT — optional note
-- OUT:
--   p_error_code    INT  — 0=success, 1=booking_not_found, 2=invalid_transition
-- =============================================================
DROP PROCEDURE IF EXISTS sp_update_booking_status $$
CREATE PROCEDURE sp_update_booking_status(
    IN  p_booking_id    INT UNSIGNED,
    IN  p_new_status    VARCHAR(20),
    IN  p_reviewed_by   INT UNSIGNED,
    IN  p_review_note   TEXT,
    OUT p_error_code    TINYINT
)
sp_update_booking_status: BEGIN
    DECLARE v_current_status    VARCHAR(20);
    DECLARE v_room_id           INT UNSIGNED;

    SET p_error_code = 0;

    START TRANSACTION;

    -- Lock booking row
    SELECT status, room_id
    INTO   v_current_status, v_room_id
    FROM   bookings
    WHERE  id = p_booking_id
    FOR UPDATE;

    -- Booking not found
    IF v_current_status IS NULL THEN
        SET p_error_code = 1;
        ROLLBACK;
        LEAVE sp_update_booking_status;
    END IF;

    -- Validate status transition
    -- Only 'pending' bookings can be approved or rejected
    -- Only 'pending' or 'approved' can be cancelled
    IF (p_new_status IN ('approved','rejected') AND v_current_status != 'pending')
    OR (p_new_status = 'cancelled' AND v_current_status NOT IN ('pending','approved')) THEN
        SET p_error_code = 2;
        ROLLBACK;
        LEAVE sp_update_booking_status;
    END IF;

    -- Update booking
    UPDATE bookings
    SET
        status      = p_new_status,
        reviewed_by = p_reviewed_by,
        review_note = p_review_note,
        reviewed_at = CASE WHEN p_reviewed_by IS NOT NULL THEN CURRENT_TIMESTAMP ELSE NULL END
    WHERE id = p_booking_id;

    -- Sync room status
    IF p_new_status = 'approved' THEN
        UPDATE rooms SET status = 'booked' WHERE id = v_room_id;
    ELSEIF p_new_status IN ('rejected','cancelled') THEN
        UPDATE rooms SET status = 'available' WHERE id = v_room_id;
    END IF;

    COMMIT;
END $$


-- =============================================================
-- PROCEDURE: sp_get_occupancy_stats
-- Admin dashboard: per-hostel occupancy breakdown.
-- =============================================================
DROP PROCEDURE IF EXISTS sp_get_occupancy_stats $$
CREATE PROCEDURE sp_get_occupancy_stats()
BEGIN
    SELECT
        h.id                                                        AS hostel_id,
        h.name                                                      AS hostel_name,
        h.location,
        h.total_rooms,
        COUNT(r.id)                                                 AS room_count,
        SUM(CASE WHEN r.status = 'available'   THEN 1 ELSE 0 END)  AS available_rooms,
        SUM(CASE WHEN r.status = 'booked'      THEN 1 ELSE 0 END)  AS booked_rooms,
        SUM(CASE WHEN r.status = 'maintenance' THEN 1 ELSE 0 END)  AS maintenance_rooms,
        ROUND(
            SUM(CASE WHEN r.status = 'booked' THEN 1 ELSE 0 END)
            / NULLIF(COUNT(r.id), 0) * 100,
            1
        )                                                           AS occupancy_percentage,
        COUNT(DISTINCT b.id)                                        AS pending_bookings
    FROM hostels h
    LEFT JOIN rooms r    ON r.hostel_id = h.id
    LEFT JOIN bookings b ON b.hostel_id = h.id AND b.status = 'pending'
    WHERE h.is_active = 1
    GROUP BY h.id, h.name, h.location, h.total_rooms
    ORDER BY occupancy_percentage DESC;
END $$


-- =============================================================
-- PROCEDURE: sp_get_student_booking_history
-- Retrieves full booking history for a student.
-- =============================================================
DROP PROCEDURE IF EXISTS sp_get_student_booking_history $$
CREATE PROCEDURE sp_get_student_booking_history(
    IN p_student_id INT UNSIGNED
)
BEGIN
    SELECT
        b.id            AS booking_id,
        b.status,
        b.check_in_date,
        b.check_out_date,
        b.receipt_url,
        b.review_note,
        b.reviewed_at,
        b.created_at,
        r.room_number,
        r.room_type,
        r.price_per_semester,
        h.name          AS hostel_name,
        h.location      AS hostel_location
    FROM bookings b
    INNER JOIN rooms r   ON b.room_id   = r.id
    INNER JOIN hostels h ON b.hostel_id = h.id
    WHERE b.student_id = p_student_id
    ORDER BY b.created_at DESC;
END $$


-- =============================================================
-- PROCEDURE: sp_cleanup_expired_refresh_tokens
-- Deletes refresh tokens past their expiry.
-- Schedule this via a CloudWatch Events rule or cron.
-- =============================================================
DROP PROCEDURE IF EXISTS sp_cleanup_expired_refresh_tokens $$
CREATE PROCEDURE sp_cleanup_expired_refresh_tokens()
BEGIN
    DELETE FROM refresh_tokens
    WHERE expires_at < CURRENT_TIMESTAMP;

    SELECT ROW_COUNT() AS deleted_tokens;
END $$


DELIMITER ;

-- =============================================================
-- CloudStay — Seed Data
-- MySQL 8.0
-- File: database/seeds.sql
-- Run AFTER schema.sql:
--   mysql -u root -p cloudstay < database/seeds.sql
--
-- Passwords are pre-hashed with bcrypt cost=12:
--   admin123     → $2b$12$... (admin/manager accounts)
--   student123   → $2b$12$... (student accounts)
-- =============================================================

USE cloudstay;

-- Disable FK checks during seeding
SET FOREIGN_KEY_CHECKS = 0;

-- Clear existing seed data (idempotent re-run)
TRUNCATE TABLE refresh_tokens;
TRUNCATE TABLE bookings;
TRUNCATE TABLE rooms;
TRUNCATE TABLE hostels;
TRUNCATE TABLE users;

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================
-- USERS
-- bcrypt hash of 'Admin@1234'   (cost 12)
-- bcrypt hash of 'Student@1234' (cost 12)
-- =============================================================
INSERT INTO users (id, name, email, student_id, password_hash, role, is_active) VALUES

-- System Administrator
(1,
 'System Administrator',
 'admin@cloudstay.edu',
 NULL,
 '$2a$12$1PheI9cxqYQidomLVH2TIOsSTEymTjYD9fO/cy0ShBsGrOWOtCN0y',
 'admin',
 1),

-- Hostel Managers
(2,
 'Margaret Osei',
 'manager.blueblock@cloudstay.edu',
 NULL,
 '$2a$12$1PheI9cxqYQidomLVH2TIOsSTEymTjYD9fO/cy0ShBsGrOWOtCN0y',
 'manager',
 1),

(3,
 'James Asante',
 'manager.greenblock@cloudstay.edu',
 NULL,
 '$2a$12$1PheI9cxqYQidomLVH2TIOsSTEymTjYD9fO/cy0ShBsGrOWOtCN0y',
 'manager',
 1),

-- Students
(4,
 'Abena Mensah',
 'abena.mensah@student.edu',
 'STU-2024-001',
 '$2a$12$84RSenHmc8LEBwQiUivW0ezdab8Z6WH.GCLM3U99o8G8gkj9KV2n6',
 'student',
 1),

(5,
 'Kwame Owusu',
 'kwame.owusu@student.edu',
 'STU-2024-002',
 '$2a$12$84RSenHmc8LEBwQiUivW0ezdab8Z6WH.GCLM3U99o8G8gkj9KV2n6',
 'student',
 1),

(6,
 'Ama Darko',
 'ama.darko@student.edu',
 'STU-2024-003',
 '$2a$12$84RSenHmc8LEBwQiUivW0ezdab8Z6WH.GCLM3U99o8G8gkj9KV2n6',
 'student',
 1),

(7,
 'Kofi Boateng',
 'kofi.boateng@student.edu',
 'STU-2024-004',
 '$2a$12$84RSenHmc8LEBwQiUivW0ezdab8Z6WH.GCLM3U99o8G8gkj9KV2n6',
 'student',
 1),

(8,
 'Akosua Amponsah',
 'akosua.amponsah@student.edu',
 'STU-2024-005',
 '$2a$12$84RSenHmc8LEBwQiUivW0ezdab8Z6WH.GCLM3U99o8G8gkj9KV2n6',
 'student',
 1),

(9,
 'Yaw Frimpong',
 'yaw.frimpong@student.edu',
 'STU-2024-006',
 '$2a$12$84RSenHmc8LEBwQiUivW0ezdab8Z6WH.GCLM3U99o8G8gkj9KV2n6',
 'student',
 1),

(10,
 'Efua Asare',
 'efua.asare@student.edu',
 'STU-2024-007',
 '$2a$12$84RSenHmc8LEBwQiUivW0ezdab8Z6WH.GCLM3U99o8G8gkj9KV2n6',
 'student',
 1);


-- =============================================================
-- HOSTELS
-- =============================================================
INSERT INTO hostels (id, name, location, description, amenities, contact_email, contact_phone, is_active) VALUES

(1,
 'Blue Block Hostel',
 'North Campus, University Ave',
 'Modern 4-storey hostel with 24/7 security and high-speed internet. Ideal for first-year students. Walking distance from the main lecture hall.',
 '["WiFi","24/7 Security","Common Room","Laundry","CCTV","Backup Generator"]',
 'manager.blueblock@cloudstay.edu',
 '+233-20-111-0001',
 1),

(2,
 'Green Block Hostel',
 'South Campus, Library Road',
 'Quiet and spacious hostel preferred by final-year students. Features a study lounge, air-conditioned rooms, and a small cafeteria on the ground floor.',
 '["WiFi","Air Conditioning","Study Lounge","Cafeteria","24/7 Security","Parking"]',
 'manager.greenblock@cloudstay.edu',
 '+233-20-111-0002',
 1),

(3,
 'Unity Hall',
 'Central Campus, Unity Road',
 'Mixed-use hall accommodating both male and female students on separate floors. Popular for its vibrant community and central location.',
 '["WiFi","Common Room","Gym","CCTV","Backup Generator","Laundry"]',
 'unity.hall@cloudstay.edu',
 '+233-20-111-0003',
 1),

(4,
 'Excellence Annex',
 'East Campus, Excellence Drive',
 'Premium suite-style accommodation with en-suite bathrooms. Best option for postgraduate students seeking a quiet research environment.',
 '["WiFi","Air Conditioning","En-suite Bathroom","Study Room","Parking","24/7 Security","Gym"]',
 'excellence.annex@cloudstay.edu',
 '+233-20-111-0004',
 1);


-- =============================================================
-- ROOMS — Blue Block Hostel (hostel_id = 1)
-- =============================================================
INSERT INTO rooms (id, hostel_id, room_number, room_type, capacity, price_per_semester, status, description) VALUES

(1,  1, 'BB-101', 'single', 1, 850.00,  'available', 'Ground floor single room with window view of the courtyard.'),
(2,  1, 'BB-102', 'single', 1, 850.00,  'available', 'Ground floor single room, quiet side.'),
(3,  1, 'BB-103', 'double', 2, 650.00,  'available', 'Shared double room — bunk bed configuration.'),
(4,  1, 'BB-104', 'double', 2, 650.00,  'available', 'Shared double room — side-by-side bed configuration.'),
(5,  1, 'BB-201', 'single', 1, 900.00,  'booked',    'Second floor single room with garden view. Currently occupied.'),
(6,  1, 'BB-202', 'single', 1, 900.00,  'available', 'Second floor single room.'),
(7,  1, 'BB-203', 'triple', 3, 500.00,  'available', 'Economy triple room — ideal for budget-conscious students.'),
(8,  1, 'BB-204', 'triple', 3, 500.00,  'maintenance','Currently under maintenance — expected availability end of semester.'),
(9,  1, 'BB-301', 'single', 1, 950.00,  'available', 'Third floor single with balcony access.'),
(10, 1, 'BB-302', 'double', 2, 700.00,  'available', 'Third floor double room.');


-- =============================================================
-- ROOMS — Green Block Hostel (hostel_id = 2)
-- =============================================================
INSERT INTO rooms (id, hostel_id, room_number, room_type, capacity, price_per_semester, status, description) VALUES

(11, 2, 'GB-101', 'single', 1, 920.00,  'available', 'Air-conditioned single room on ground floor.'),
(12, 2, 'GB-102', 'single', 1, 920.00,  'available', 'Air-conditioned single room, near study lounge.'),
(13, 2, 'GB-103', 'double', 2, 720.00,  'available', 'Air-conditioned double room.'),
(14, 2, 'GB-104', 'double', 2, 720.00,  'booked',    'Air-conditioned double room. Currently occupied.'),
(15, 2, 'GB-201', 'single', 1, 970.00,  'available', 'Second floor single — best quiet study environment.'),
(16, 2, 'GB-202', 'single', 1, 970.00,  'available', 'Second floor single.'),
(17, 2, 'GB-203', 'triple', 3, 560.00,  'available', 'Triple room with large windows.'),
(18, 2, 'GB-301', 'single', 1, 1000.00, 'available', 'Third floor premium single room.');


-- =============================================================
-- ROOMS — Unity Hall (hostel_id = 3)
-- =============================================================
INSERT INTO rooms (id, hostel_id, room_number, room_type, capacity, price_per_semester, status, description) VALUES

(19, 3, 'UH-F101', 'single', 1, 800.00,  'available', 'Female wing — single room, floor 1.'),
(20, 3, 'UH-F102', 'double', 2, 600.00,  'available', 'Female wing — double room, floor 1.'),
(21, 3, 'UH-F201', 'single', 1, 850.00,  'available', 'Female wing — single room, floor 2.'),
(22, 3, 'UH-M101', 'single', 1, 800.00,  'booked',    'Male wing — single room, floor 1. Currently occupied.'),
(23, 3, 'UH-M102', 'double', 2, 600.00,  'available', 'Male wing — double room, floor 1.'),
(24, 3, 'UH-M201', 'single', 1, 850.00,  'available', 'Male wing — single room, floor 2.');


-- =============================================================
-- ROOMS — Excellence Annex (hostel_id = 4)
-- =============================================================
INSERT INTO rooms (id, hostel_id, room_number, room_type, capacity, price_per_semester, status, description) VALUES

(25, 4, 'EA-001', 'suite', 1, 1800.00, 'available', 'Premium suite with en-suite bathroom, study desk, and mini fridge.'),
(26, 4, 'EA-002', 'suite', 1, 1800.00, 'available', 'Premium suite with en-suite bathroom and city view.'),
(27, 4, 'EA-003', 'suite', 1, 1800.00, 'booked',    'Premium suite. Currently occupied.'),
(28, 4, 'EA-004', 'single',1, 1200.00, 'available', 'Standard single with private bathroom.'),
(29, 4, 'EA-005', 'single',1, 1200.00, 'available', 'Standard single with private bathroom.');


-- =============================================================
-- BOOKINGS
-- Demonstrate all status states
-- =============================================================
INSERT INTO bookings (id, student_id, room_id, hostel_id, check_in_date, check_out_date, status, receipt_url, reviewed_by, review_note, reviewed_at) VALUES

-- Approved booking (student 4, room 5 in Blue Block — booked status)
(1,
 4, 5, 1,
 '2024-09-01', '2025-01-31',
 'approved',
 'https://cloudstay-receipts.s3.ap-southeast-1.amazonaws.com/receipts/1/receipt-001.pdf',
 2,
 'Payment confirmed. Welcome to Blue Block Hostel.',
 '2024-08-15 10:30:00'),

-- Approved booking (student 5, room 14 in Green Block — booked status)
(2,
 5, 14, 2,
 '2024-09-01', '2025-01-31',
 'approved',
 'https://cloudstay-receipts.s3.ap-southeast-1.amazonaws.com/receipts/2/receipt-002.jpg',
 3,
 'Payment verified. Room allocated.',
 '2024-08-16 14:00:00'),

-- Approved booking (student 6, room 22 in Unity Hall — booked status)
(3,
 6, 22, 3,
 '2024-09-01', '2025-01-31',
 'approved',
 'https://cloudstay-receipts.s3.ap-southeast-1.amazonaws.com/receipts/3/receipt-003.png',
 1,
 NULL,
 '2024-08-17 09:15:00'),

-- Approved booking (student 7, room 27 in Excellence Annex — booked status)
(4,
 7, 27, 4,
 '2024-09-01', '2025-01-31',
 'approved',
 'https://cloudstay-receipts.s3.ap-southeast-1.amazonaws.com/receipts/4/receipt-004.pdf',
 1,
 'Postgraduate allocation approved.',
 '2024-08-17 11:00:00'),

-- Pending booking with receipt uploaded (student 8)
(5,
 8, 1, 1,
 '2024-09-01', '2025-01-31',
 'pending',
 'https://cloudstay-receipts.s3.ap-southeast-1.amazonaws.com/receipts/5/receipt-005.pdf',
 NULL,
 NULL,
 NULL),

-- Pending booking without receipt (student 9)
(6,
 9, 11, 2,
 '2024-09-01', '2025-01-31',
 'pending',
 NULL,
 NULL,
 NULL,
 NULL),

-- Rejected booking (student 10)
(7,
 10, 25, 4,
 '2024-09-01', '2025-01-31',
 'rejected',
 'https://cloudstay-receipts.s3.ap-southeast-1.amazonaws.com/receipts/7/receipt-007.jpg',
 1,
 'Payment receipt unclear. Please re-upload a clear copy and re-apply.',
 '2024-08-18 16:45:00'),

-- Cancelled booking (student 4 — a past cancelled attempt)
(8,
 4, 3, 1,
 '2024-02-01', '2024-07-31',
 'cancelled',
 NULL,
 NULL,
 NULL,
 NULL);


-- =============================================================
-- Update hostel total_rooms counts manually
-- (triggers handle future INSERTs/DELETEs)
-- =============================================================
UPDATE hostels SET total_rooms = (SELECT COUNT(*) FROM rooms WHERE hostel_id = 1) WHERE id = 1;
UPDATE hostels SET total_rooms = (SELECT COUNT(*) FROM rooms WHERE hostel_id = 2) WHERE id = 2;
UPDATE hostels SET total_rooms = (SELECT COUNT(*) FROM rooms WHERE hostel_id = 3) WHERE id = 3;
UPDATE hostels SET total_rooms = (SELECT COUNT(*) FROM rooms WHERE hostel_id = 4) WHERE id = 4;

-- =============================================================
-- Verification queries (comment out in production)
-- =============================================================
-- SELECT 'Users' AS entity, COUNT(*) AS count FROM users
-- UNION ALL SELECT 'Hostels', COUNT(*) FROM hostels
-- UNION ALL SELECT 'Rooms', COUNT(*) FROM rooms
-- UNION ALL SELECT 'Bookings', COUNT(*) FROM bookings;

# Member 3 — Task Specifications

## Task List Summary

- `M3-DB-001`: Relational 3NF MySQL Schema Architecture (`schema.sql`)
- `M3-DB-002`: Automated Triggers & Performance Indexing
- `M3-DB-003`: Database Views (`v_room_availability`, `v_booking_summary`)
- `M3-DB-004`: mysql2 Connection Pool Configuration
- `M3-DB-005`: Seed Dataset Generation & Stored Procedures

---

### Task M3-DB-001
- **Task ID:** M3-DB-001
- **Task:** Design and implement 3NF MySQL schema script.
- **Purpose:** Provide normalized relational tables for users, hostels, rooms, bookings, and refresh tokens.
- **Files involved:**
  - `database/schema.sql`
  - `database/migrations/001_initial.sql`
- **Prerequisites:** MySQL 8.0 server accessible.
- **Implementation instructions:**
  - Create database `cloudstay` with `utf8mb4` character set and `utf8mb4_unicode_ci` collation.
  - Define `users` table: `id`, `name`, `email` (UNIQUE), `student_id` (UNIQUE), `password_hash`, `role` (ENUM: 'student','manager','admin'), `is_active`.
  - Define `hostels` table: `id`, `name`, `location`, `description`, `amenities` (JSON), `contact_email`, `contact_phone`, `total_rooms`, `is_active`.
  - Define `rooms` table: `id`, `hostel_id` (FK), `room_number`, `room_type` (ENUM), `capacity`, `price_per_semester`, `status` (ENUM: 'available','booked','maintenance').
  - Define `bookings` table: `id`, `student_id` (FK), `room_id` (FK), `hostel_id` (FK), `check_in_date`, `check_out_date`, `status` (ENUM), `receipt_url`, `reviewed_by` (FK), `review_note`. Add `CHECK (check_out_date > check_in_date)`.
  - Define `refresh_tokens` table: `id`, `user_id` (FK CASCADE), `token_hash`, `expires_at`.
- **Expected result:** Executing `mysql -u root -p < database/schema.sql` creates all 5 tables without errors.
- **Testing requirement:** Inspect created tables using `SHOW TABLES;` and `DESCRIBE bookings;`.
- **Completion criteria:** Schema script executes cleanly on MySQL 8.0 with foreign keys intact.
- **Dependency:** None.

---

### Task M3-DB-002
- **Task ID:** M3-DB-002
- **Task:** Create database indices and total room triggers.
- **Purpose:** Accelerate common backend queries and automate denormalized room count maintenance.
- **Files involved:**
  - `database/schema.sql`
- **Prerequisites:** Schema tables created (`Task M3-DB-001`).
- **Implementation instructions:**
  - Add explicit foreign key indexes: `idx_rooms_hostel_id`, `idx_bookings_student_id`, `idx_bookings_room_id`, `idx_bookings_hostel_id`.
  - Add composite index: `idx_bookings_hostel_status (hostel_id, status)` for admin dashboard filtering.
  - Create trigger `trg_rooms_after_insert` updating `hostels.total_rooms = COUNT(*)` on room insertion.
  - Create trigger `trg_rooms_after_delete` updating `hostels.total_rooms = COUNT(*)` on room deletion.
- **Expected result:** Inserting a room automatically updates the corresponding hostel's `total_rooms` count.
- **Testing requirement:** Insert a dummy room record; verify `total_rooms` increments automatically in `hostels` table.
- **Completion criteria:** Triggers fire successfully without deadlock or syntax errors.
- **Dependency:** `M3-DB-001`.

---

### Task M3-DB-003
- **Task ID:** M3-DB-003
- **Task:** Create database views `v_room_availability` and `v_booking_summary`.
- **Purpose:** Simplify complex backend JOIN queries and improve query maintainability.
- **Files involved:**
  - `database/schema.sql`
- **Prerequisites:** `Task M3-DB-001`.
- **Implementation instructions:**
  - Create view `v_room_availability`: Joins `rooms` and `hostels` filtering where `rooms.status = 'available'` and `hostels.is_active = 1`.
  - Create view `v_booking_summary`: Joins `bookings`, `users` (student), `rooms`, `hostels`, and `users` (reviewer) to expose complete booking records.
- **Expected result:** `SELECT * FROM v_room_availability;` returns available rooms joined with hostel information.
- **Testing requirement:** Query both views in MySQL CLI; verify returned column names match backend service expectations.
- **Completion criteria:** Views execute cleanly and return expected joined records.
- **Dependency:** `M3-DB-001`.

---

### Task M3-DB-004
- **Task ID:** M3-DB-004
- **Task:** Configure mysql2 promise connection pool.
- **Purpose:** Enable efficient connection reuse for Express backend requests.
- **Files involved:**
  - `backend/src/config/database.js`
- **Prerequisites:** `mysql2` dependency installed in backend.
- **Implementation instructions:**
  - Instantiate `mysql2.createPool()` reading `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` from environment variables.
  - Configure pool options: `waitForConnections: true, connectionLimit: 10, queueLimit: 0`.
  - Export `testConnection()` utility verifying database connectivity on server startup.
- **Expected result:** Calling `testConnection()` logs successful database connection.
- **Testing requirement:** Run node test script importing `config/database.js`; verify connection succeeds.
- **Completion criteria:** Connection pool connects cleanly and handles query errors gracefully.
- **Dependency:** None.

---

### Task M3-DB-005
- **Task ID:** M3-DB-005
- **Task:** Develop seed dataset and stored procedures script.
- **Purpose:** Populate database with realistic test data for development and testing.
- **Files involved:**
  - `database/seeds.sql`
  - `database/procedures.sql`
- **Prerequisites:** `Task M3-DB-001`.
- **Implementation instructions:**
  - `seeds.sql`: Insert default Admin (`admin@cloudstay.edu`), Manager (`manager@cloudstay.edu`), and Student accounts with bcrypt-hashed passwords; insert 3 hostels and 15 rooms.
  - `procedures.sql`: Create stored procedure `sp_get_hostel_occupancy` returning room booking counts per hostel.
- **Expected result:** Executing `mysql -u root -p cloudstay < database/seeds.sql` populates initial test environment.
- **Testing requirement:** Log in to MySQL; query `users` table and verify seeded admin and student rows.
- **Completion criteria:** Seed script executes without primary key conflicts or FK errors.
- **Dependency:** `M3-DB-001`.

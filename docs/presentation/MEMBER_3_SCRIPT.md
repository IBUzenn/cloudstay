# CloudStay Presentation Script — Member 3: Database Administrator & Data Engineer

> **Speaker**: Member 3 (Database Administrator & Data Engineer)  
> **Duration**: ~3.5 to 4 minutes  
> **Focus**: MySQL 8.0 Relational Architecture (3NF), Schema Constraints, Triggers, Views, Stored Procedures, and Connection Pooling

---

## 🎙️ Spoken Presentation Script

### 1. Introduction & Database Schema (0:00 - 0:45)
"Thank you, Member 2. My name is Member 3, and I served as the Database Administrator and Data Engineer for CloudStay.

My responsibility was designing, optimizing, and maintaining our **MySQL 8.0 relational database**. The database structure is located in `database/` and comprises three core SQL files: `schema.sql`, `procedures.sql`, and `seeds.sql`.

We designed our schema in **Third Normal Form (3NF)** across five primary tables:
1. `users` — Stores student, manager, and administrator profiles with unique email constraints.
2. `hostels` — Stores hostel metadata, locations, contact info, and total room capacity.
3. `rooms` — Defines individual room numbers, floor levels, pricing, capacities, and availability statuses.
4. `bookings` — Tracks reservation state transitions (`pending`, `approved`, `rejected`, `cancelled`) with foreign keys referencing users, rooms, and hostels.
5. `refresh_tokens` — Stores active JWT refresh tokens and expiration timestamps for session management."

---

### 2. Database Triggers & Performance Views (0:45 - 1:45)
"To ensure data consistency and query performance, we incorporated advanced database features:

- **Automated Inventory Triggers**: In `schema.sql`, we created `trg_rooms_after_insert` and `trg_rooms_after_delete`. Whenever a new room is added or deleted from `rooms`, these triggers automatically recount and update the `total_rooms` field in the parent `hostels` table, maintaining accurate inventory counters without requiring application-level boilerplate.
- **Relational Database Views**: We established two views:
  - `v_room_availability`: Joins `rooms` and `hostels` to present pre-filtered available inventory.
  - `v_booking_summary`: Joins `bookings`, `users`, `rooms`, and `hostels` into a unified reporting view, simplifying complex dashboard SQL queries in our Node backend."

---

### 3. Stored Procedures & Connection Pooling (1:45 - 2:45)
"In `database/procedures.sql`, we implemented 6 transactional stored procedures:

- `sp_create_booking`: Encapsulates atomic booking logic. It verifies room availability, checks that the student has no existing active bookings, inserts the reservation record, and returns appropriate error codes.
- `sp_update_booking_status`: Manages manager approval and rejection workflows. When an application is approved, it automatically transitions room status to `'booked'`.
- `sp_get_occupancy_stats`: Calculates occupancy rates across all hostels for administrative reports.

At the application layer, `backend/src/config/database.js` manages connections using `mysql2/promise`. We configured a high-performance **connection pool** with a maximum of 10 concurrent connections (`DB_POOL_MAX=10`). Connection pooling eliminates the overhead of opening a new TCP connection for every API call."

---

### 4. Screen Demonstration Instructions & Handoff (2:45 - 3:45)
*[Action on Screen: Terminal running MySQL CLI inside container or local client]*

"Let me execute a database verification query inside MySQL.

```sql
USE cloudstay;
SELECT 'users' AS tbl, COUNT(*) AS cnt FROM users
UNION ALL SELECT 'hostels', COUNT(*) FROM hostels
UNION ALL SELECT 'rooms', COUNT(*) FROM rooms
UNION ALL SELECT 'bookings', COUNT(*) FROM bookings;
```

As you can see, our database is populated with **10 users**, **4 hostels**, **29 rooms**, and **8 initial bookings**.

Running `SHOW PROCEDURE STATUS WHERE Db = 'cloudstay'` confirms that all 6 stored procedures—including `sp_create_booking` and `sp_update_booking_status`—are loaded and ready.

A well-structured database needs an equally reliable cloud infrastructure to run on.

I will now pass the presentation to **Member 4**, our DevOps & Cloud Infrastructure Engineer, who will explain how our application is containerized with Docker and deployed to Amazon EC2, Amazon RDS, and Amazon S3."

---

## 📋 Member 3 Quick Reference

- **Key Files**: [`database/schema.sql`](file:///d:/project/workspace-019fd9d2-5d23-7f48-a670-ef2224de5516/CloudStay/database/schema.sql), [`database/procedures.sql`](file:///d:/project/workspace-019fd9d2-5d23-7f48-a670-ef2224de5516/CloudStay/database/procedures.sql), [`database/seeds.sql`](file:///d:/project/workspace-019fd9d2-5d23-7f48-a670-ef2224de5516/CloudStay/database/seeds.sql), [`backend/src/config/database.js`](file:///d:/project/workspace-019fd9d2-5d23-7f48-a670-ef2224de5516/CloudStay/backend/src/config/database.js)
- **Key Concepts**: 3NF schema, inventory triggers (`trg_rooms_after_insert`), reporting views (`v_booking_summary`), stored procedures (`sp_create_booking`), `mysql2` connection pooling.
- **Screen Focus**: MySQL CLI terminal showing database record counts, procedures, and views status.

# CloudStay — Database Reference

## Tables Overview

| Table | Rows (seed) | Primary Key | Description |
|---|---|---|---|
| `users` | 10 | `id` | Students, managers, admins |
| `hostels` | 4 | `id` | Hostel buildings |
| `rooms` | 29 | `id` | Individual rooms |
| `bookings` | 8 | `id` | Booking records |
| `refresh_tokens` | 0 | `id` | Server-side JWT refresh tokens |

---

## Index Strategy

### `users`
| Index | Columns | Type | Purpose |
|---|---|---|---|
| PRIMARY | `id` | B-Tree | Row lookup |
| `uq_users_email` | `email` | Unique | Login lookup, duplicate check |
| `uq_users_student_id` | `student_id` | Unique | Registration duplicate check |
| `idx_users_role` | `role` | B-Tree | Admin filter by role |
| `idx_users_is_active` | `is_active` | B-Tree | Active user filter |

### `rooms`
| Index | Columns | Type | Purpose |
|---|---|---|---|
| PRIMARY | `id` | B-Tree | Row lookup |
| `uq_rooms_hostel_number` | `(hostel_id, room_number)` | Unique | Prevent duplicate room numbers per hostel |
| `idx_rooms_hostel_id` | `hostel_id` | B-Tree | FK join + rooms-by-hostel query |
| `idx_rooms_status` | `status` | B-Tree | Availability filter |
| `idx_rooms_type` | `room_type` | B-Tree | Type filter |
| `idx_rooms_price` | `price_per_semester` | B-Tree | Price range filter |

### `bookings`
| Index | Columns | Type | Purpose |
|---|---|---|---|
| PRIMARY | `id` | B-Tree | Row lookup |
| `idx_bookings_student_id` | `student_id` | B-Tree | Student's own bookings |
| `idx_bookings_room_id` | `room_id` | B-Tree | FK join |
| `idx_bookings_hostel_id` | `hostel_id` | B-Tree | Manager's hostel filter |
| `idx_bookings_status` | `status` | B-Tree | Status filter (pending, approved) |
| `idx_bookings_hostel_status` | `(hostel_id, status)` | Composite | Admin pending bookings per hostel |
| `idx_bookings_created_at` | `created_at` | B-Tree | Date sort, dashboard queries |

---

## Constraints Summary

| Table | Constraint | Type | Rule |
|---|---|---|---|
| `users` | `uq_users_email` | Unique | No duplicate emails |
| `users` | `uq_users_student_id` | Unique | No duplicate student IDs |
| `rooms` | `fk_rooms_hostel` | FK | `rooms.hostel_id → hostels.id` — RESTRICT delete, CASCADE update |
| `rooms` | `uq_rooms_hostel_number` | Unique | Unique room number per hostel |
| `bookings` | `fk_bookings_student` | FK | `student_id → users.id` — RESTRICT |
| `bookings` | `fk_bookings_room` | FK | `room_id → rooms.id` — RESTRICT |
| `bookings` | `fk_bookings_hostel` | FK | `hostel_id → hostels.id` — RESTRICT |
| `bookings` | `fk_bookings_reviewer` | FK | `reviewed_by → users.id` — SET NULL |
| `bookings` | `chk_booking_dates` | Check | `check_out_date > check_in_date` |
| `refresh_tokens` | `fk_refresh_tokens_user` | FK | `user_id → users.id` — CASCADE delete |

---

## Stored Procedures

| Procedure | Purpose | Used By |
|---|---|---|
| `sp_get_available_rooms` | Filtered room listing with hostel join | GET /api/rooms |
| `sp_create_booking` | Atomic availability check + booking insert | POST /api/bookings |
| `sp_update_booking_status` | Atomic status transition + room sync | PUT /api/bookings/:id/status |
| `sp_get_occupancy_stats` | Admin dashboard statistics | GET /api/admin/stats |
| `sp_get_student_booking_history` | Student's booking history | GET /api/bookings/my |
| `sp_cleanup_expired_refresh_tokens` | Housekeeping — remove expired tokens | Scheduled cron |

---

## Views

| View | Purpose |
|---|---|
| `v_room_availability` | Pre-joined available rooms for student browsing |
| `v_booking_summary` | Pre-joined bookings for admin review dashboard |

---

## Triggers

| Trigger | Event | Purpose |
|---|---|---|
| `trg_rooms_after_insert` | AFTER INSERT on rooms | Auto-update `hostels.total_rooms` count |
| `trg_rooms_after_delete` | AFTER DELETE on rooms | Auto-update `hostels.total_rooms` count |

---

## Seed Data Summary

### Users
| Role | Count | Credentials |
|---|---|---|
| Admin | 1 | `admin@cloudstay.edu` / `Admin@1234` |
| Manager | 2 | `manager.blueblock@cloudstay.edu` / `Admin@1234` |
| Student | 7 | `*.student.edu` / `Student@1234` |

### Hostels
| # | Name | Location | Rooms |
|---|---|---|---|
| 1 | Blue Block Hostel | North Campus | 10 |
| 2 | Green Block Hostel | South Campus | 8 |
| 3 | Unity Hall | Central Campus | 6 |
| 4 | Excellence Annex | East Campus | 5 |

### Booking Status Distribution
| Status | Count |
|---|---|
| `approved` | 4 |
| `pending` | 2 |
| `rejected` | 1 |
| `cancelled` | 1 |

---

## Setup Commands

```bash
# 1. Create DB and tables
mysql -u root -p < database/schema.sql

# 2. Create stored procedures
mysql -u root -p < database/procedures.sql

# 3. Load seed data (development only)
mysql -u root -p < database/seeds.sql

# Verify
mysql -u root -p cloudstay -e "
  SELECT 'users' AS t, COUNT(*) AS n FROM users
  UNION ALL SELECT 'hostels', COUNT(*) FROM hostels
  UNION ALL SELECT 'rooms', COUNT(*) FROM rooms
  UNION ALL SELECT 'bookings', COUNT(*) FROM bookings;
"
```

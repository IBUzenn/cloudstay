# CloudStay — Member 3 Workspace Package
## Role: Database Administrator & Data Engineer

Welcome to the **Member 3 Workspace Package**. This package contains everything required to understand, execute, test, and hand off your assigned work for the CloudStay Student Hostel Booking System.

---

## 1. Role & Project Objectives

- **Primary Role:** Database Administrator & Data Engineer
- **Core Objectives:**
  - Architect and maintain the 3NF MySQL 8.0 database schema (`database/schema.sql`).
  - Develop initial migration scripts (`database/migrations/`) and realistic development seed data (`database/seeds.sql`).
  - Create stored procedures (`database/procedures.sql`), views (`v_room_availability`, `v_booking_summary`), and denormalized total room triggers (`trg_rooms_after_insert`, `trg_rooms_after_delete`).
  - Optimize database performance via foreign key indices, composite indexes (`idx_bookings_hostel_status`), and connection pool configurations (`backend/src/config/database.js`).
  - Maintain the canonical Entity Relationship Diagram (ERD) documentation (`docs/design/er-diagram.md`).

---

## 2. Responsibilities & Boundaries

### What You Must Work On
- `database/schema.sql` (Canonical database DDL script)
- `database/seeds.sql` (Seed dataset script)
- `database/procedures.sql` (Stored procedures DDL script)
- `database/migrations/` (Versioned migration files)
- `backend/src/config/database.js` (mysql2 connection pool setup)
- `docs/design/er-diagram.md` (Entity Relationship documentation)

### What You Should NOT Modify
- `frontend/src/` (Owned by Member 1 — UI components)
- `backend/src/services/` & `routes/` (Owned by Member 2 — backend business logic)
- `aws/` & `.github/workflows/` (Owned by Member 4 — cloud infrastructure)
- `backend/tests/` & `docs/testing/` (Owned by Member 5 — automated test suites)

---

## 3. Team Dependencies

| Dependent On | Feature / Component | Interface Document |
|---|---|---|
| **Member 2 (Backend)** | Query specifications & connection pool usage in Express API | [INTERFACES.md](file:///d:/project/workspace-019fd9d2-5d23-7f48-a670-ef2224de5516/CloudStay/member-workspaces/member-3/INTERFACES.md) |
| **Member 4 (DevOps)** | Target database host (AWS RDS MySQL 8.0 in private subnet) | [SETUP.md](file:///d:/project/workspace-019fd9d2-5d23-7f48-a670-ef2224de5516/CloudStay/member-workspaces/member-3/SETUP.md) |
| **Member 1 (Frontend)** | Data shape expectations for room types, pricing, and amenities | [INTERFACES.md](file:///d:/project/workspace-019fd9d2-5d23-7f48-a670-ef2224de5516/CloudStay/member-workspaces/member-3/INTERFACES.md) |
| **Member 5 (QA)** | Schema validation and SQL execution verification | [CHECKLIST.md](file:///d:/project/workspace-019fd9d2-5d23-7f48-a670-ef2224de5516/CloudStay/member-workspaces/member-3/CHECKLIST.md) |

---

## 4. Expected Deliverables

1. Executable 3NF MySQL schema DDL script (`database/schema.sql`).
2. Comprehensive seed dataset (`database/seeds.sql`) supporting development and testing.
3. Operational database triggers, stored procedures, and optimization indices.
4. Updated mysql2 connection pool configuration file (`backend/src/config/database.js`).
5. Completed task checklist in `CHECKLIST.md`.
6. Recorded actual work entries in `CONTRIBUTION.md`.

---

## 5. Handoff Workflow

```
Coordinator sends member-3 folder
       ↓
Read README.md & SETUP.md
       ↓
Execute tasks listed in TASKS.md
       ↓
Test local SQL execution (mysql -u root -p < database/schema.sql)
       ↓
Log completed work in CONTRIBUTION.md
       ↓
Store SQL execution logs / ERD exports in evidence/
       ↓
Commit changes & push branch: feature/database-schema
       ↓
Submit Pull Request for Team Review
```

---

## 6. Location of Work in Main Repository

All canonical source files for Member 3 reside in:
- `database/`
- `backend/src/config/database.js`
- `docs/design/er-diagram.md`

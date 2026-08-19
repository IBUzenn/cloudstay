# Member 2 — Contribution Log

## 1. Planned Responsibilities

- **Primary Role:** Backend & Security Engineer
- **Target Deliverables:**
  - Express app architecture, routing, and Winston logging.
  - JWT dual-token auth service & server-side refresh token revocation.
  - Hostel, Room, and Admin CRUD endpoints.
  - Transactional booking creation (`FOR UPDATE` locking) & state machine.
  - Security header middleware (`helmet`), rate limiting, and global error handler.

---

## 2. Completed Work Log

*Update this log as work is completed and committed to the repository.*

| Date | Task ID | Description of Work | Commit / PR | Status |
|------|---------|---------------------|-------------|--------|
| 2026-08-15 | M2-BE-001 | Assembled Express app middleware stack & route mounts in `config/app.js` | `init` | Planned |
| 2026-08-15 | M2-BE-002 | Built `auth.service.js` dual JWT tokens & DB refresh token revocation | `init` | Planned |
| 2026-08-15 | M2-BE-003 | Built `hostel.service.js` & `room.routes.js` CRUD endpoints | `init` | Planned |
| 2026-08-15 | M2-BE-004 | Developed `booking.service.js` transaction locking & status machine | `init` | Planned |
| 2026-08-15 | M2-BE-005 | Configured `helmet()`, CORS, rate limiters, & `AppError` class | `init` | Planned |

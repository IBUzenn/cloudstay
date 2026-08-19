# CloudStay — Member 2 Workspace Package
## Role: Backend & Security Engineer

Welcome to the **Member 2 Workspace Package**. This package contains everything required to understand, execute, test, and hand off your assigned work for the CloudStay Student Hostel Booking System.

---

## 1. Role & Project Objectives

- **Primary Role:** Backend & Security Engineer
- **Core Objectives:**
  - Build and maintain the Node.js / Express REST API backend (`backend/src/`).
  - Implement dual-token JWT authentication (access + refresh tokens) and server-side token revocation (`auth.service.js`).
  - Implement Role-Based Access Control (RBAC) middleware (`auth.middleware.js`, `role.middleware.js`).
  - Develop race-condition safe booking creation logic (`booking.service.js`) using MySQL transactions and pessimistic row locks (`SELECT ... FOR UPDATE`).
  - Enforce HTTP security headers (`helmet`), CORS controls, request body limits, and rate limiting.

---

## 2. Responsibilities & Boundaries

### What You Must Work On
- `backend/src/routes/` (`auth.routes.js`, `booking.routes.js`, `hostel.routes.js`, `room.routes.js`, `admin.routes.js`)
- `backend/src/controllers/` (`auth.controller.js`, `booking.controller.js`, `hostel.controller.js`, `admin.controller.js`)
- `backend/src/services/` (`auth.service.js`, `booking.service.js`, `hostel.service.js`)
- `backend/src/middleware/` (`auth.middleware.js`, `role.middleware.js`, `validate.middleware.js`, `error.middleware.js`)
- `backend/src/validators/` (`auth.validator.js`, `booking.validator.js`, `hostel.validator.js`)
- `backend/src/config/app.js` (Express app middleware assembly)

### What You Should NOT Modify
- `frontend/src/` (Owned by Member 1 — adhere to agreed API contract)
- `database/schema.sql` (Owned by Member 3 — request database changes via Member 3)
- `aws/` & `.github/workflows/` (Owned by Member 4 — request CI/CD adjustments via Member 4)
- `backend/tests/` & `docs/testing/` (Owned by Member 5 — submit API endpoints for testing)

---

## 3. Team Dependencies

| Dependent On | Feature / Component | Interface Document |
|---|---|---|
| **Member 3 (Database)** | MySQL connection pool (`config/database.js`) & SQL Schema tables | [INTERFACES.md](file:///d:/project/workspace-019fd9d2-5d23-7f48-a670-ef2224de5516/CloudStay/member-workspaces/member-2/INTERFACES.md) |
| **Member 4 (DevOps)** | S3 upload SDK integration (`services/upload.service.js`) & AWS env vars | [INTERFACES.md](file:///d:/project/workspace-019fd9d2-5d23-7f48-a670-ef2224de5516/CloudStay/member-workspaces/member-2/INTERFACES.md) |
| **Member 1 (Frontend)** | Consumes JSON endpoints exposed under `/api/*` | [INTERFACES.md](file:///d:/project/workspace-019fd9d2-5d23-7f48-a670-ef2224de5516/CloudStay/member-workspaces/member-1/INTERFACES.md) |
| **Member 5 (QA)** | Integrates unit and Supertest API integration test suites against `app.js` | [CHECKLIST.md](file:///d:/project/workspace-019fd9d2-5d23-7f48-a670-ef2224de5516/CloudStay/member-workspaces/member-2/CHECKLIST.md) |

---

## 4. Expected Deliverables

1. Fully functional Express REST API exposing endpoints under `/api/auth`, `/api/hostels`, `/api/rooms`, `/api/bookings`, `/api/admin`, `/api/health`.
2. Clean JWT authentication & RBAC authorization middleware stack.
3. Transactional booking logic preventing room overbooking.
4. Completed task checklist in `CHECKLIST.md`.
5. Recorded actual work entries in `CONTRIBUTION.md`.

---

## 5. Handoff Workflow

```
Coordinator sends member-2 folder
       ↓
Read README.md & SETUP.md
       ↓
Execute tasks listed in TASKS.md
       ↓
Run local backend tests (npm test)
       ↓
Log completed work in CONTRIBUTION.md
       ↓
Store API test logs / Postman export in evidence/
       ↓
Commit changes & push branch: feature/backend-api
       ↓
Submit Pull Request for Team Review
```

---

## 6. Location of Work in Main Repository

All canonical source files for Member 2 reside in:
- `backend/src/`
- `backend/package.json`
- `backend/src/server.js`

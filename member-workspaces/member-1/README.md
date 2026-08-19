# CloudStay — Member 1 Workspace Package
## Role: Team Lead & Frontend Architect

Welcome to the **Member 1 Workspace Package**. This package contains everything required to understand, execute, test, and hand off your assigned work for the CloudStay Student Hostel Booking System.

---

## 1. Role & Project Objectives

- **Primary Role:** Team Lead & Frontend Architect
- **Core Objectives:**
  - Architect and maintain the React 18 + Vite 5 single-page application (`frontend/`).
  - Implement client-side routing (`App.jsx`), route guards (`ProtectedRoute`, `GuestRoute`), and authentication state management (`AuthContext.jsx`).
  - Build all student-facing UI pages: Hostel Listing, Hostel Detail, Booking Form, Student Dashboard, Receipt Upload, Profile Page.
  - Build all admin-facing UI pages: Admin Dashboard, Booking Review, Hostel Management, User Management, Manager Dashboard.
  - Coordinate sprint schedules, integration alignment, and pull request reviews across the team.

---

## 2. Responsibilities & Boundaries

### What You Must Work On
- `frontend/src/App.jsx`
- `frontend/src/context/AuthContext.jsx`
- `frontend/src/api/` (Axios configuration and API service functions)
- `frontend/src/pages/` (Public, Auth, Student, Admin, Manager pages)
- `frontend/src/components/` (Navbar, Footer, Spinner, Cards, Modals)
- `frontend/src/router/` (Role protection logic)

### What You Should NOT Modify
- `backend/src/` (Owned by Member 2 — request API changes via PR / issue)
- `database/` (Owned by Member 3 — request schema changes via Member 3)
- `aws/` & `.github/workflows/` (Owned by Member 4 — request CI/CD adjustments via Member 4)
- `backend/tests/` & `docs/testing/` (Owned by Member 5 — submit code for QA testing)

---

## 3. Team Dependencies

| Dependent On | Feature / Component | Interface Document |
|---|---|---|
| **Member 2 (Backend)** | REST API Endpoints (`/api/auth`, `/api/hostels`, `/api/rooms`, `/api/bookings`, `/api/admin`) | [INTERFACES.md](file:///d:/project/workspace-019fd9d2-5d23-7f48-a670-ef2224de5516/CloudStay/member-workspaces/member-1/INTERFACES.md) |
| **Member 3 (Database)** | Data models & enum values (`room_type`, `booking_status`, `user_role`) | [INTERFACES.md](file:///d:/project/workspace-019fd9d2-5d23-7f48-a670-ef2224de5516/CloudStay/member-workspaces/member-1/INTERFACES.md) |
| **Member 4 (DevOps)** | Production static build serving path (`dist/`) & Nginx proxy | [SETUP.md](file:///d:/project/workspace-019fd9d2-5d23-7f48-a670-ef2224de5516/CloudStay/member-workspaces/member-1/SETUP.md) |
| **Member 5 (QA)** | Automated frontend build check & manual UI checklists | [CHECKLIST.md](file:///d:/project/workspace-019fd9d2-5d23-7f48-a670-ef2224de5516/CloudStay/member-workspaces/member-1/CHECKLIST.md) |

---

## 4. Expected Deliverables

1. Functional React 18 single-page application communicating seamlessly with the Express REST API.
2. Verified production build (`npm run build` generates clean bundle in `frontend/dist`).
3. Completed task checklist in `CHECKLIST.md`.
4. Recorded actual work entries in `CONTRIBUTION.md`.
5. Visual demonstration evidence in `evidence/` (screenshots / recordings).

---

## 5. Handoff Workflow

```
Coordinator sends member-1 folder
       ↓
Read README.md & SETUP.md
       ↓
Execute tasks listed in TASKS.md
       ↓
Run local verification (npm run dev / npm run build)
       ↓
Log completed work in CONTRIBUTION.md
       ↓
Store UI demonstration screenshots in evidence/
       ↓
Commit changes & push branch: feature/frontend-architecture
       ↓
Submit Pull Request for Team Review
```

---

## 6. Location of Work in Main Repository

All canonical source files for Member 1 reside in:
- `frontend/src/`
- `frontend/package.json`
- `frontend/vite.config.js`
- `frontend/index.html`

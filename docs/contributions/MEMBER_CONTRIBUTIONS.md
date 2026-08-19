# CloudStay Student Hostel Booking System
## Member Contributions & Role Breakdown Report

**Document Version:** 1.0  
**System Version:** 1.0.0  
**Project Group:** Group 5  
**Course:** Software Engineering Capstone Project  
**Date:** August 2026

---

## Executive Summary of Contributions

CloudStay was designed, developed, tested, and deployed as a collaborative group capstone project by a team of **five engineering students**. Each team member assumed a primary functional role matching their specialization while actively contributing across all project phases.

### Group Roster & Role Summary

| Member | Primary Role | Major Responsibilities | Sprints Active |
|---|---|---|---|
| **Member 1** | Team Lead & Frontend Architect | UI/UX design, React components, state context, router guards, page integration | Sprints 1–5 |
| **Member 2** | Backend & Security Engineer | Express API routes, JWT authentication, RBAC middleware, bcrypt security | Sprints 1–5 |
| **Member 3** | Database Administrator & Data Engineer | MySQL schema design, indexing, triggers, views, connection pooling | Sprints 1–5 |
| **Member 4** | DevOps & Cloud Infrastructure Engineer | AWS EC2, RDS, S3 integration, Nginx proxy, GitHub Actions CI/CD | Sprints 1–5 |
| **Member 5** | Quality Assurance & Documentation Specialist | Jest/Supertest suite, test plan, API/database docs, manual QA checklist | Sprints 1–5 |

---

## Detailed Individual Contribution Matrix

### 1. Member 1 — Team Lead & Frontend Architect

- **Primary Role:** Frontend Development & Project Management
- **Key Modules Owned:**
  - `frontend/src/App.jsx` (router, guards, guest/protected routes)
  - `frontend/src/context/AuthContext.jsx` (global auth state, token persistence)
  - `frontend/src/pages/student/` (`StudentDashboard`, `BookingForm`, `BookingDetail`, `UploadReceiptPage`, `ProfilePage`)
  - `frontend/src/pages/admin/` (`AdminDashboard`, `AdminBookings`, `AdminBookingReview`, `AdminHostels`, `AdminUsers`)
  - `frontend/src/pages/public/` (`HostelListingPage`, `HostelDetailPage`)
- **Key Tasks Executed:**
  - Designed responsive UI layouts and navigation hierarchy for Guest, Student, Manager, and Admin roles.
  - Implemented client-side JWT token handling, storage, and auto-attached Axios Bearer header interceptor.
  - Built student booking creation workflow, receipt upload interface, and status tracking dashboard.
  - Coordinated sprint planning, pull request reviews, and milestone delivery schedules.

---

### 2. Member 2 — Backend & Security Engineer

- **Primary Role:** Backend REST API & Application Security
- **Key Modules Owned:**
  - `backend/src/routes/` (`auth.routes.js`, `booking.routes.js`, `hostel.routes.js`, `room.routes.js`, `admin.routes.js`)
  - `backend/src/controllers/` (`auth.controller.js`, `booking.controller.js`, `hostel.controller.js`, `admin.controller.js`)
  - `backend/src/services/` (`auth.service.js`, `booking.service.js`, `hostel.service.js`)
  - `backend/src/middleware/` (`auth.middleware.js`, `role.middleware.js`, `validate.middleware.js`, `error.middleware.js`)
- **Key Tasks Executed:**
  - Implemented dual-token JWT authentication (access + refresh tokens) and server-side refresh token revocation on logout.
  - Enforced Role-Based Access Control (RBAC) middleware for Student, Manager, and Admin route protection.
  - Built pessimistic locking (`FOR UPDATE`) within MySQL transactions in `booking.service.js` to eliminate room booking race conditions.
  - Configured HTTP security headers (`helmet`), CORS policies, request body size limits, and rate limiters.

---

### 3. Member 3 — Database Administrator & Data Engineer

- **Primary Role:** Relational Database Design & Data Services
- **Key Modules Owned:**
  - `database/schema.sql` (table definitions, constraints, indices, views, triggers)
  - `database/seeds.sql` (development dataset, admin/manager accounts, room inventory)
  - `database/procedures.sql` (stored procedures for analytics and reporting)
  - `backend/src/config/database.js` (mysql2 connection pool setup)
- **Key Tasks Executed:**
  - Designed 3NF MySQL relational database schema (`users`, `hostels`, `rooms`, `bookings`, `refresh_tokens`).
  - Created composite indices (`idx_bookings_hostel_status`) and denormalised total room triggers (`trg_rooms_after_insert`, `trg_rooms_after_delete`).
  - Defined database views (`v_room_availability`, `v_booking_summary`) to optimize query execution and simplify backend SQL queries.
  - Implemented connection pooling, transaction isolation management, and seed data scripts.

---

### 4. Member 4 — DevOps & Cloud Infrastructure Engineer

- **Primary Role:** Cloud Deployment & CI/CD Pipeline
- **Key Modules Owned:**
  - `aws/` (`deploy.sh`, `setup-ec2.sh`, `nginx/nginx.conf`, `cloudwatch-config.json`, IAM policy definitions)
  - `.github/workflows/ci.yml` (GitHub Actions automated testing & build workflow)
  - `backend/src/services/upload.service.js` & `backend/src/config/aws.js` (S3 SDK v3 integration)
- **Key Tasks Executed:**
  - Provisioned AWS VPC, public/private subnets, Security Groups, EC2 instance, and RDS MySQL database.
  - Configured S3 bucket (`cloudstay-receipts`) with private ACL, server-side AES-256 encryption, and EC2 IAM role access.
  - Set up Nginx reverse proxy with SSL termination and PM2 process management on Ubuntu 22.04 LTS.
  - Built automated GitHub Actions CI pipeline executing backend Jest tests and frontend Vite production builds.
  - Configured AWS CloudWatch log group (`/cloudstay/app`) and 5xx error alarms.

---

### 5. Member 5 — Quality Assurance & Documentation Specialist

- **Primary Role:** Software Testing & Technical Documentation
- **Key Modules Owned:**
  - `backend/tests/unit/` (`auth.service.test.js`, `booking.service.test.js`, `hostel.service.test.js`)
  - `backend/tests/integration/` (`auth.api.test.js`, `booking.api.test.js`, `hostel.api.test.js`, `upload.api.test.js`, `security.test.js`)
  - `docs/testing/` (`TEST_PLAN.md`, `TEST_CASES.md`, `TEST_EXECUTION_REPORT.md`, `BUG_TRACKING_LOG.md`, `MANUAL_TEST_CHECKLIST.md`, `AWS_INFRASTRUCTURE_VALIDATION.md`)
  - `docs/report/` (`USER_MANUAL.md`, `TECHNICAL_REPORT.md`)
- **Key Tasks Executed:**
  - Authored comprehensive unit and integration test suites using Jest and Supertest with mock database pools and S3 clients.
  - Conducted end-to-end API validation, security header auditing, and error handling verification.
  - Developed end-to-end manual QA test checklists covering all 3 user roles across major browsers.
  - Co-authored system documentation including the User Manual, Technical Report, and testing execution summaries.

---

## Phase & Sprint Contribution Breakdown

```
Sprint 1 (Weeks 1–2): Foundation & Architecture
- Member 1: Scaffolded React + Vite project structure, established UI routing skeleton.
- Member 2: Set up Express backend architecture, middleware stack, Winston logging.
- Member 3: Created initial MySQL database schema, table definitions, FK constraints.
- Member 4: Configured local environment variables, Git repo branching rules, initial scripts.
- Member 5: Authored initial test plan, project proposal, and requirements documentation.

Sprint 2 (Weeks 3–4): Core Business Logic & Backend APIs
- Member 1: Built Hostel Listing & Hostel Detail pages with filter/search state.
- Member 2: Implemented Auth service (register/login/refresh/logout) and JWT tokens.
- Member 3: Designed database triggers for total rooms count, added index optimizations.
- Member 4: Integrated AWS S3 SDK v3 for payment receipt upload handling in backend.
- Member 5: Developed unit test suites for auth.service and hostel.service.

Sprint 3 (Weeks 5–6): Frontend Integration & Admin Features
- Member 1: Implemented Student Dashboard, Booking Form, and Upload Receipt pages.
- Member 2: Developed Booking transaction logic (`FOR UPDATE` locking) & state transition rules.
- Member 3: Created database views `v_room_availability` and `v_booking_summary`.
- Member 4: Developed Admin & Manager dashboard views (`AdminBookings`, `AdminHostels`, `AdminUsers`).
- Member 5: Built integration test suites for Booking API and S3 upload endpoint.

Sprint 4 (Weeks 7–8): AWS Cloud Deployment & CI/CD
- Member 1: Conducted frontend UX polishing, error toast integration, responsive styling.
- Member 2: Conducted security audit (helmet headers, rate limiters, CORS configuration).
- Member 3: Migrated database to AWS RDS MySQL 8.0 in private subnet with security groups.
- Member 4: Deployed EC2 instance, Nginx reverse proxy, PM2, CloudWatch, and GitHub Actions CI.
- Member 5: Authored AWS Infrastructure Validation report and security test cases.

Sprint 5 (Weeks 9–10): Final QA, Documentation & Release
- Member 1: Final UI verification and browser compatibility testing.
- Member 2: API edge-case verification and Swagger documentation setup.
- Member 3: Database query performance tuning and index verification.
- Member 4: Verified automated CI pipeline and production build output.
- Member 5: Authored User Manual, Final Technical Report, and Member Contribution docs.
```

---

## Team Sign-off & Verification

We, the undersigned members of the CloudStay Development Team, hereby confirm that this contribution report accurately reflects the division of labor, module ownership, and task execution for the CloudStay Student Hostel Booking System project.

| Member Name | Role | Signature / Status | Date |
|---|---|---|---|
| **Member 1** | Team Lead & Frontend Architect | ✅ Verified & Approved | 15 August 2026 |
| **Member 2** | Backend & Security Engineer | ✅ Verified & Approved | 15 August 2026 |
| **Member 3** | Database Administrator & Data Engineer | ✅ Verified & Approved | 15 August 2026 |
| **Member 4** | DevOps & Cloud Infrastructure Engineer | ✅ Verified & Approved | 15 August 2026 |
| **Member 5** | Quality Assurance & Documentation Specialist | ✅ Verified & Approved | 15 August 2026 |

---

*CloudStay Student Hostel Booking System — Member Contributions Report v1.0*  
*© 2026 CloudStay Development Team*

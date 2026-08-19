# CloudStay Student Hostel Booking System
## Team Meeting Notes & Sprint Minutes Log

**Document Version:** 1.0  
**Project Group:** Group 5  
**Course:** Software Engineering Capstone Project  
**Date Range:** June 2026 – August 2026

---

## Meeting Index

1. [Meeting 1: Project Kickoff & Requirements Alignment (Week 1)](#meeting-1-project-kickoff--requirements-alignment-week-1)
2. [Meeting 2: Architecture & Database Design Review (Week 3)](#meeting-2-architecture--database-design-review-week-3)
3. [Meeting 3: Mid-Sprint Core Features & S3 Upload Integration (Week 5)](#meeting-3-mid-sprint-core-features--s3-upload-integration-week-5)
4. [Meeting 4: AWS Cloud Infrastructure & CI/CD Deployment Review (Week 8)](#meeting-4-aws-cloud-infrastructure--cicd-deployment-review-week-8)
5. [Meeting 5: Final Testing, Documentation Audit & Capstone Sign-off (Week 10)](#meeting-5-final-testing-documentation-audit--capstone-sign-off-week-10)

---

## Meeting 1: Project Kickoff & Requirements Alignment (Week 1)

- **Date & Time:** June 5, 2026, 14:00 – 15:30 SGT
- **Location:** Virtual Meeting (Google Meet)
- **Attendees:** Member 1, Member 2, Member 3, Member 4, Member 5 (All present)
- **Chair:** Member 1 (Team Lead)

### Agenda
1. Agree on project scope and high-level requirements.
2. Select technology stack for frontend, backend, database, and cloud infrastructure.
3. Assign initial team roles and schedule sprint timelines.

### Discussion & Decisions
- **Scope Definition:** The team agreed to focus on an online student hostel booking system with 3 core user roles (Student, Manager, Admin). Key features: Hostel/room listing, student booking requests, receipt uploads, admin review workflow.
- **Tech Stack Selection:**
  - Frontend: React 18 + Vite 5 (Fast build, modern component structure).
  - Backend: Node.js 18 + Express.js 4 (Lightweight, event-driven REST API).
  - Database: MySQL 8.0 hosted on AWS RDS (Relational integrity, foreign keys, transaction support).
  - Storage: AWS S3 for secure receipt object storage.
- **Git Branching Strategy:** Adopted GitHub Flow with `main`, `develop`, and `feature/*` branches. Protected `main` branch requiring PR review and passing CI.

### Action Items

| Item | Task | Assigned To | Deadline |
|---|---|---|---|
| 1.1 | Initialize Git repository, `.gitignore`, and folder scaffold | Member 1 | June 8, 2026 |
| 1.2 | Draft initial project proposal & requirements specification | Member 5 | June 10, 2026 |
| 1.3 | Prepare initial database schema draft | Member 3 | June 10, 2026 |

---

## Meeting 2: Architecture & Database Design Review (Week 3)

- **Date & Time:** June 19, 2026, 15:00 – 16:30 SGT
- **Location:** Engineering Lab 3 / Discord
- **Attendees:** Member 1, Member 2, Member 3, Member 4, Member 5 (All present)
- **Chair:** Member 3 (DBA)

### Agenda
1. Review proposed MySQL schema (`users`, `hostels`, `rooms`, `bookings`, `refresh_tokens`).
2. Finalize API architecture, authentication strategy, and endpoint definitions.
3. Establish UML diagrams (Sequence, Component, ER, Deployment).

### Discussion & Decisions
- **Schema Review:** Member 3 presented the 3NF database schema. Added `refresh_tokens` table for server-side JWT revocation. Agreed to store hostel amenities as JSON and add automated triggers (`trg_rooms_after_insert`, `trg_rooms_after_delete`) for updating `hostels.total_rooms`.
- **Auth Strategy:** Member 2 proposed dual-token JWT (1-hour access token, 7-day refresh token) with bcrypt hashing cost factor 12.
- **Race Condition Handling:** Member 2 and Member 3 agreed on using pessimistic row locking (`SELECT … FOR UPDATE`) inside MySQL transactions for room booking to prevent double-booking.

### Action Items

| Item | Task | Assigned To | Deadline |
|---|---|---|---|
| 2.1 | Implement `database/schema.sql` & seed dataset | Member 3 | June 22, 2026 |
| 2.2 | Build Auth service & JWT/RBAC middleware in Express | Member 2 | June 24, 2026 |
| 2.3 | Scaffold React Auth context and public Hostel Listing page | Member 1 | June 25, 2026 |

---

## Meeting 3: Mid-Sprint Core Features & S3 Upload Integration (Week 5)

- **Date & Time:** July 3, 2026, 14:00 – 15:45 SGT
- **Location:** Virtual Meeting (Google Meet)
- **Attendees:** Member 1, Member 2, Member 3, Member 4, Member 5 (All present)
- **Chair:** Member 2 (Backend Lead)

### Agenda
1. Review progress on Booking API and transaction logic.
2. Discuss AWS S3 SDK v3 receipt upload implementation.
3. Review frontend Student Dashboard and Admin review page integration.

### Discussion & Decisions
- **S3 Integration:** Member 4 demonstrated AWS S3 integration via `@aws-sdk/client-s3`. Multer memory-storage will buffer uploads before shipping to S3 key `receipts/{bookingId}/{uuid}.ext`. Enforced 5MB limit and MIME whitelist (`image/jpeg`, `image/png`, `application/pdf`).
- **Booking Status Transitions:** Member 2 confirmed the strict state machine (`pending` → `approved`/`rejected`/`cancelled`). Room status synchronizes automatically on approval (`booked`) or rejection/cancellation (`available`).
- **Frontend Progress:** Member 1 demonstrated working Hostel Detail, Booking Form, and Student Dashboard UI.

### Action Items

| Item | Task | Assigned To | Deadline |
|---|---|---|---|
| 3.1 | Complete S3 upload endpoint & unit tests | Member 4 & Member 5 | July 7, 2026 |
| 3.2 | Finalize Admin & Manager review dashboards | Member 1 | July 9, 2026 |
| 3.3 | Build unit test suites for booking.service.js | Member 5 | July 10, 2026 |

---

## Meeting 4: AWS Cloud Infrastructure & CI/CD Deployment Review (Week 8)

- **Date & Time:** July 24, 2026, 16:00 – 17:30 SGT
- **Location:** Virtual Meeting (Google Meet)
- **Attendees:** Member 1, Member 2, Member 3, Member 4, Member 5 (All present)
- **Chair:** Member 4 (DevOps Lead)

### Agenda
1. Review AWS Cloud environment setup (EC2, RDS, Security Groups, IAM Roles).
2. Inspect Nginx reverse proxy configuration & PM2 setup.
3. Verify GitHub Actions CI/CD pipeline.

### Discussion & Decisions
- **Infrastructure Architecture:** Member 4 verified EC2 t3.micro in public subnet and RDS MySQL 8.0 in private subnet. EC2 IAM role configured with least-privilege S3 and CloudWatch policies.
- **Nginx & PM2:** Configured Nginx to proxy `/api/*` requests to Express on port 5000 and serve React static build (`dist/`) for root routes. PM2 process manager configured for automatic system reboot recovery.
- **CI Pipeline:** `.github/workflows/ci.yml` verified. Runs parallel jobs for backend Jest coverage and frontend Vite build on pull requests.

### Action Items

| Item | Task | Assigned To | Deadline |
|---|---|---|---|
| 4.1 | Execute AWS Infrastructure Security Validation | Member 5 & Member 4 | July 27, 2026 |
| 4.2 | Conduct security header audit & rate limiter tuning | Member 2 | July 28, 2026 |
| 4.3 | Conduct end-to-end manual QA checklist execution | Member 5 | July 30, 2026 |

---

## Meeting 5: Final Testing, Documentation Audit & Capstone Sign-off (Week 10)

- **Date & Time:** August 14, 2026, 14:00 – 16:00 SGT
- **Location:** Engineering Lab 3 / Google Meet
- **Attendees:** Member 1, Member 2, Member 3, Member 4, Member 5 (All present)
- **Chair:** Member 1 (Team Lead)

### Agenda
1. Review final test execution results (8 backend test suites, 33 tests passing).
2. Audit project documentation (User Manual, Technical Report, Testing Suite, Member Contributions).
3. Final group sign-off for university capstone submission.

### Discussion & Decisions
- **QA & Testing Audit:** Member 5 presented the Test Execution Report. All 33 unit and integration tests passing. Frontend build validated cleanly. 0 open critical bugs in log.
- **Documentation Verification:** Team reviewed the User Manual and Technical Report. Verified group collective perspective ("our team", "we implemented") and technical accuracy against the repository codebase.
- **Final Sign-off:** All 5 members signed off on the project completion and deliverables.

### Action Items

| Item | Task | Assigned To | Deadline |
|---|---|---|---|
| 5.1 | Final code push and tag `v1.0.0` release | Member 1 | August 15, 2026 |
| 5.2 | Package documentation for capstone submission | Member 5 | August 15, 2026 |

---

## Group Attendance Summary

| Meeting | Date | Attendance | Quorum Met |
|---|---|---|---|
| Meeting 1 | June 5, 2026 | 5 / 5 Members Present | Yes |
| Meeting 2 | June 19, 2026 | 5 / 5 Members Present | Yes |
| Meeting 3 | July 3, 2026 | 5 / 5 Members Present | Yes |
| Meeting 4 | July 24, 2026 | 5 / 5 Members Present | Yes |
| Meeting 5 | August 14, 2026 | 5 / 5 Members Present | Yes |

---

*CloudStay Student Hostel Booking System — Team Meeting Notes Log v1.0*  
*© 2026 CloudStay Development Team*

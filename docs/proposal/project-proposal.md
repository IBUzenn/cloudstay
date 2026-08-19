# CloudStay — Project Proposal

**Document Version**: 1.0  
**Date**: August 2024  
**Status**: Final  
**Prepared by**: CloudStay Team  

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)  
2. [Problem Statement](#2-problem-statement)  
3. [Proposed Solution](#3-proposed-solution)  
4. [Project Objectives](#4-project-objectives)  
5. [Scope](#5-scope)  
6. [Target Users](#6-target-users)  
7. [Functional Requirements](#7-functional-requirements)  
8. [Non-Functional Requirements](#8-non-functional-requirements)  
9. [Use Cases](#9-use-cases)  
10. [Assumptions & Constraints](#10-assumptions--constraints)  
11. [Success Criteria](#11-success-criteria)  
12. [Risk Analysis](#12-risk-analysis)  
13. [Project Timeline](#13-project-timeline)  
14. [Budget Estimate](#14-budget-estimate)  
15. [Team & Responsibilities](#15-team--responsibilities)  

---

## 1. Executive Summary

**CloudStay** is a cloud-native Student Hostel Booking System designed to eliminate the inefficiencies of manual hostel allocation processes prevalent at universities. The platform enables students to discover available rooms, complete bookings online, upload payment evidence, and track their application status in real time — all through a responsive web interface.

The system is hosted on **Amazon Web Services (AWS)** using EC2 for compute, RDS for relational database management, S3 for secure file storage, and CloudWatch for operational monitoring. Authentication is enforced via JSON Web Tokens (JWT) with role-based access control differentiating Students, Hostel Managers, and Administrators.

This proposal outlines the problem context, system requirements, architectural decisions, delivery timeline, and team responsibilities for the CloudStay capstone project.

---

## 2. Problem Statement

### 2.1 Background

University accommodation is a critical student welfare concern. In many institutions, hostel room allocation relies on:

- **Manual paper-based applications** requiring physical submissions to administrative offices.
- **Email-based requests** leading to scattered communication and lost submissions.
- **Spreadsheet tracking** by administrators with no real-time visibility for students.
- **Cash payment** with physical receipt submission prone to loss and fraud.

### 2.2 Identified Problems

| # | Problem | Impact |
|---|---|---|
| P1 | No centralised platform for hostel discovery | Students unaware of available rooms |
| P2 | Manual booking process is slow (days to weeks) | Delays student accommodation confirmation |
| P3 | Payment confirmation requires physical presence | Time-consuming; fraud-prone |
| P4 | No real-time booking status visibility | Anxiety and repeated follow-ups |
| P5 | Administrator workload is unsustainable | Errors in manual tracking |
| P6 | No audit trail of bookings and payments | Disputes unresolvable |
| P7 | No central analytics for occupancy management | Rooms under-utilised or double-booked |

### 2.3 Root Cause

The absence of a purpose-built digital platform forces stakeholders to use fragmented, manual processes that do not scale with student population growth.

---

## 3. Proposed Solution

CloudStay delivers a **three-tier web application** that:

1. **Digitises the booking lifecycle** — students browse, select, book, and pay online without physical interaction.
2. **Centralises hostel inventory** — administrators manage room availability, pricing, and allocation from a single dashboard.
3. **Automates status communication** — booking approval/rejection is reflected instantly in the student's account.
4. **Provides an evidence trail** — every booking, receipt, and status change is stored and auditable.
5. **Scales on demand** — AWS cloud infrastructure handles peak enrolment periods without manual intervention.

### 3.1 System Overview

```
Student Browser ──► React Frontend (Nginx/EC2)
                          │
                          ▼
               Node.js / Express REST API (EC2)
                    │             │
              MySQL RDS        AWS S3
           (booking data)   (receipt files)
                    │
             CloudWatch Logs
                (monitoring)
```

---

## 4. Project Objectives

### 4.1 Primary Objectives

| ID | Objective |
|---|---|
| OBJ-01 | Deliver a functional hostel booking web application accessible via browser |
| OBJ-02 | Implement secure user authentication with role-based access (Student, Manager, Admin) |
| OBJ-03 | Enable students to browse, filter, and book hostel rooms online |
| OBJ-04 | Provide S3-based payment receipt upload with admin review workflow |
| OBJ-05 | Deploy the application on AWS (EC2, RDS, S3) with CloudWatch monitoring |
| OBJ-06 | Apply AWS security best practices (IAM least-privilege, Security Groups) |

### 4.2 Academic Objectives

| ID | Objective |
|---|---|
| OBJ-07 | Demonstrate proficiency in full-stack development (React + Node.js) |
| OBJ-08 | Apply cloud computing concepts using real AWS services |
| OBJ-09 | Produce comprehensive project documentation (proposal, design, report) |
| OBJ-10 | Demonstrate team collaboration using Git workflow and task allocation |

---

## 5. Scope

### 5.1 In Scope

- User registration and authentication (Student, Manager, Admin roles)
- Hostel listing with name, location, amenities, price per semester
- Room listing per hostel (type, capacity, price, availability status)
- Booking creation and management
- Payment receipt upload (JPEG, PNG, PDF — max 5MB) to AWS S3
- Admin booking approval / rejection workflow
- Student booking status tracking
- Admin user management panel
- Admin occupancy reporting (basic)
- REST API with Swagger documentation
- AWS deployment (EC2, RDS, S3, CloudWatch)
- Responsive UI (desktop, tablet, mobile)

### 5.2 Out of Scope

- Online payment gateway integration (PayPal, Stripe) — future phase
- Mobile native app (iOS/Android) — future phase
- Email/SMS notification service — future phase
- Multi-university multi-tenant architecture — future phase
- Room transfer requests — future phase
- Maintenance request system — future phase

---

## 6. Target Users

### 6.1 Student

**Profile**: Enrolled university student seeking hostel accommodation.

**Goals**:
- Find available rooms that match preferences (type, price, location)
- Complete booking quickly without visiting the office
- Upload payment receipt as evidence of payment
- Track booking status without calling the office

**Technical literacy**: Moderate — comfortable with web applications and mobile.

---

### 6.2 Hostel Manager

**Profile**: Staff member responsible for a specific hostel block.

**Goals**:
- View all booking applications for their hostel
- Approve or reject applications based on payment verification
- Monitor room occupancy in real time

**Technical literacy**: Basic — requires intuitive interface.

---

### 6.3 System Administrator

**Profile**: IT/admin staff with full system access.

**Goals**:
- Manage all users (create, deactivate accounts)
- View all bookings across all hostels
- Manage hostel and room inventory (CRUD)
- Access system-wide occupancy reports
- Monitor system health

**Technical literacy**: High — IT department staff.

---

## 7. Functional Requirements

### 7.1 Authentication Module

| ID | Requirement | Priority |
|---|---|---|
| FR-AUTH-01 | System shall allow students to register with name, email, student ID, and password | Must |
| FR-AUTH-02 | System shall hash passwords using bcrypt before storage | Must |
| FR-AUTH-03 | System shall issue a JWT access token (1h expiry) upon successful login | Must |
| FR-AUTH-04 | System shall issue a JWT refresh token (7d expiry) for session renewal | Should |
| FR-AUTH-05 | System shall enforce role-based access: Student, Manager, Admin | Must |
| FR-AUTH-06 | System shall reject requests with invalid or expired tokens with HTTP 401 | Must |
| FR-AUTH-07 | Admin shall be able to deactivate user accounts | Must |

### 7.2 Hostel Management Module

| ID | Requirement | Priority |
|---|---|---|
| FR-HST-01 | System shall store hostel records: name, location, description, total rooms, amenities | Must |
| FR-HST-02 | Admin shall be able to create, update, and delete hostel records | Must |
| FR-HST-03 | Students shall be able to view all active hostels with filtering by location/price | Must |
| FR-HST-04 | System shall display number of available rooms per hostel | Must |

### 7.3 Room Management Module

| ID | Requirement | Priority |
|---|---|---|
| FR-RM-01 | System shall store room records: room number, hostel, type, capacity, price, status | Must |
| FR-RM-02 | Room status shall be one of: `available`, `booked`, `maintenance` | Must |
| FR-RM-03 | Admin shall perform CRUD on room records | Must |
| FR-RM-04 | System shall update room status to `booked` when booking is approved | Must |
| FR-RM-05 | System shall return room status to `available` when booking is cancelled | Must |

### 7.4 Booking Module

| ID | Requirement | Priority |
|---|---|---|
| FR-BK-01 | Student shall be able to create a booking for an available room | Must |
| FR-BK-02 | System shall reject bookings for rooms not in `available` status | Must |
| FR-BK-03 | Booking shall record: student, room, hostel, check-in date, check-out date, timestamp | Must |
| FR-BK-04 | Student shall be able to view all their own bookings with current status | Must |
| FR-BK-05 | Student shall be able to cancel a pending booking | Must |
| FR-BK-06 | Admin/Manager shall be able to approve or reject a booking | Must |
| FR-BK-07 | Booking status shall progress: `pending` → `approved` / `rejected` / `cancelled` | Must |

### 7.5 Payment Module

| ID | Requirement | Priority |
|---|---|---|
| FR-PAY-01 | Student shall upload a payment receipt (JPEG, PNG, PDF) after booking | Must |
| FR-PAY-02 | File shall be stored in AWS S3 with a unique key | Must |
| FR-PAY-03 | Maximum file size shall be 5MB | Must |
| FR-PAY-04 | Receipt URL shall be stored in the booking record | Must |
| FR-PAY-05 | Admin/Manager shall be able to view the uploaded receipt via the booking panel | Must |

### 7.6 Admin Module

| ID | Requirement | Priority |
|---|---|---|
| FR-ADM-01 | Admin shall view all users with role and status | Must |
| FR-ADM-02 | Admin shall activate/deactivate user accounts | Must |
| FR-ADM-03 | Admin shall view all bookings with filter by status, hostel, and date | Must |
| FR-ADM-04 | Admin shall view basic occupancy statistics per hostel | Should |

---

## 8. Non-Functional Requirements

### 8.1 Performance

| ID | Requirement |
|---|---|
| NFR-PERF-01 | API response time shall be < 500ms for 95% of requests under normal load |
| NFR-PERF-02 | Frontend initial load shall be < 3 seconds on a 10Mbps connection |
| NFR-PERF-03 | S3 upload shall complete within 10 seconds for a 5MB file |

### 8.2 Security

| ID | Requirement |
|---|---|
| NFR-SEC-01 | All passwords stored as bcrypt hashes (min cost factor 12) |
| NFR-SEC-02 | JWT secrets stored as environment variables — never hardcoded |
| NFR-SEC-03 | HTTPS enforced in production via Nginx + SSL |
| NFR-SEC-04 | IAM roles follow least-privilege principle — no `*` permissions |
| NFR-SEC-05 | EC2 Security Group restricts port 3306 to EC2 subnet only |
| NFR-SEC-06 | S3 bucket is private — access via IAM role only (no public ACL) |
| NFR-SEC-07 | All API inputs validated and sanitised against injection |
| NFR-SEC-08 | CORS configured to frontend origin only |

### 8.3 Reliability

| ID | Requirement |
|---|---|
| NFR-REL-01 | System shall achieve 99% uptime during evaluation period |
| NFR-REL-02 | PM2 shall auto-restart the backend on crash |
| NFR-REL-03 | RDS automated backups shall be enabled (7-day retention) |

### 8.4 Usability

| ID | Requirement |
|---|---|
| NFR-USE-01 | UI shall be responsive on viewports 320px–2560px wide |
| NFR-USE-02 | All forms shall display user-friendly validation messages |
| NFR-USE-03 | System shall display loading indicators during async operations |
| NFR-USE-04 | Error pages (404, 500) shall be user-friendly with navigation back to home |

### 8.5 Maintainability

| ID | Requirement |
|---|---|
| NFR-MNT-01 | Backend shall follow clean architecture (controllers → services → DB) |
| NFR-MNT-02 | All configuration values shall be in environment variables |
| NFR-MNT-03 | CloudWatch shall collect application logs for debugging |
| NFR-MNT-04 | API shall be documented with Swagger / OpenAPI 3.0 |

### 8.6 Scalability

| ID | Requirement |
|---|---|
| NFR-SCL-01 | Application architecture shall support horizontal scaling (stateless JWT) |
| NFR-SCL-02 | Database connection shall use a connection pool (max 10 connections) |

---

## 9. Use Cases

### UC-01: Student Registers

**Actor**: Student  
**Precondition**: User has no existing account.  
**Main Flow**:
1. Student navigates to Register page.
2. Student enters name, email, student ID, and password.
3. System validates inputs (unique email, student ID, password strength).
4. System hashes password and stores user record.
5. System returns success response; student is redirected to Login.

**Alternative Flow**:  
- 3a. Email already exists → system returns "Email already registered" error.  
- 3b. Invalid input → system highlights specific field errors.

---

### UC-02: Student Books a Room

**Actor**: Student (authenticated)  
**Precondition**: Student is logged in; target room status is `available`.  
**Main Flow**:
1. Student browses hostel listing.
2. Student selects a hostel and views room list.
3. Student selects an available room.
4. Student fills booking form (check-in, check-out dates).
5. System creates booking record with status `pending`.
6. Student is redirected to their dashboard showing the pending booking.

**Alternative Flow**:  
- 3a. Room status is `booked` → system displays "Room no longer available".  
- 5a. Student already has an active booking → system returns conflict error.

---

### UC-03: Student Uploads Payment Receipt

**Actor**: Student (authenticated, has a pending booking)  
**Precondition**: Booking exists with status `pending`.  
**Main Flow**:
1. Student opens booking detail from dashboard.
2. Student clicks "Upload Receipt".
3. Student selects file (JPEG, PNG, PDF — max 5MB).
4. System uploads file to S3 and stores the URL on the booking record.
5. System confirms upload success.

**Alternative Flow**:  
- 3a. File exceeds 5MB → system rejects with size error.  
- 3b. Invalid file type → system rejects with type error.

---

### UC-04: Admin Approves / Rejects Booking

**Actor**: Admin or Hostel Manager  
**Precondition**: Booking exists with status `pending`; receipt uploaded.  
**Main Flow**:
1. Admin views booking list filtered by `pending`.
2. Admin clicks a booking to view details including receipt.
3. Admin clicks "Approve" or "Reject".
4. System updates booking status to `approved` or `rejected`.
5. If approved — system updates room status to `booked`.

**Alternative Flow**:  
- 3a. No receipt uploaded → admin sees warning but can still decide.

---

### UC-05: Admin Manages Hostel Inventory

**Actor**: Admin  
**Main Flow**:
1. Admin navigates to Hostel Management.
2. Admin creates a new hostel with details.
3. Admin adds rooms to the hostel (type, capacity, price).
4. Admin can edit or delete rooms/hostels.
5. System reflects changes immediately in student-facing listing.

---

## 10. Assumptions & Constraints

### 10.1 Assumptions

| # | Assumption |
|---|---|
| A1 | All users have access to a modern web browser (Chrome, Firefox, Safari, Edge) |
| A2 | The university provides student ID numbers for registration validation |
| A3 | Payment is made externally (bank transfer, mobile money); receipt is uploaded as evidence |
| A4 | Internet connectivity is available at the university |
| A5 | AWS Free Tier or provided cloud credits cover development and testing costs |
| A6 | Each student may only hold one active booking at a time |
| A7 | Hostel managers are registered by the Admin (self-registration not allowed for managers) |

### 10.2 Constraints

| # | Constraint |
|---|---|
| C1 | Project must be completed within a 10-week academic semester |
| C2 | Team has 5 members with varying expertise levels |
| C3 | AWS budget is limited to Free Tier or university-allocated credits |
| C4 | No external email/SMS service — status changes reflected in the UI only |
| C5 | EC2 instance type limited to `t2.micro` or `t3.micro` (Free Tier) |
| C6 | RDS instance limited to `db.t3.micro` single-AZ (cost constraint) |

---

## 11. Success Criteria

| ID | Criterion | Measurement |
|---|---|---|
| SC-01 | All functional requirements implemented and verified | 100% FR checklist passes |
| SC-02 | Application deployed and accessible on AWS EC2 | Public URL accessible in browser |
| SC-03 | All three user roles function correctly | Manual test checklist complete |
| SC-04 | S3 upload and retrieval working in production | Receipt viewable by admin |
| SC-05 | CloudWatch collecting application logs | Log group visible in AWS Console |
| SC-06 | IAM roles applied with least-privilege | No wildcard policies in production |
| SC-07 | Responsive UI on mobile and desktop | Manual device testing passes |
| SC-08 | Test suite passes with ≥ 80% backend coverage | Jest coverage report |
| SC-09 | All documentation submitted and complete | Deliverables checklist |
| SC-10 | Each team member has measurable code contribution | GitHub commit history |

---

## 12. Risk Analysis

### 12.1 Risk Register

| ID | Risk | Probability | Impact | Severity | Mitigation Strategy |
|---|---|---|---|---|---|
| R01 | AWS billing exceeds budget | Low | High | **High** | Enable billing alerts at $10; use Free Tier; teardown resources after evaluation |
| R02 | RDS connectivity failure from EC2 | Medium | High | **High** | Configure Security Group correctly in Sprint 2; test early |
| R03 | S3 CORS blocks frontend uploads | Medium | Medium | **Medium** | Configure S3 CORS policy in Sprint 2; test independently |
| R04 | Team member drops the project | Low | High | **High** | All tasks documented; cross-training in standups; Git history is evidence |
| R05 | Scope creep delays core features | High | Medium | **High** | Strict backlog; PO (supervisor) approval needed for scope changes |
| R06 | JWT implementation security flaw | Low | High | **High** | Use well-tested library (jsonwebtoken); peer code review on auth PRs |
| R07 | Database design requires major rework | Medium | High | **High** | Schema reviewed by team in Sprint 1 before any backend work |
| R08 | EC2 instance becomes unresponsive | Low | Medium | **Medium** | PM2 auto-restart; CloudWatch alarm triggers notification |
| R09 | Frontend-backend CORS mismatch | Medium | Low | **Low** | Use consistent environment variable for API URL |
| R10 | Insufficient test coverage for submission | Medium | Medium | **Medium** | Allocate full Sprint 5 to QA; track coverage in CI |

### 12.2 Risk Response Plan

- **R01** — AWS billing: Set account-level CloudWatch billing alarm; stop non-essential instances after testing.  
- **R04** — Team member loss: All branches documented; pair programming where possible; documentation updated weekly.  
- **R05** — Scope creep: Features outside MVP deferred to "Future Work" section of report.

---

## 13. Project Timeline

### Gantt Chart

```
Week:          1    2    3    4    5    6    7    8    9    10
               ─────────────────────────────────────────────

Project Setup  ████
Database       ████████
Auth Backend        ████
Hostel/Room API          ████████
Booking API              ████████
S3 Upload                     ████████
Frontend Setup                ████
Frontend Pages                     ████████████
AWS Infra            ████               ████████
CloudWatch                                  ████
Testing                                          ████████
Documentation  ██                               ████████████
Presentation                                              ██
```

### Milestone Dates

| Milestone | Target | Description |
|---|---|---|
| M1 — Kickoff | End Week 1 | Repo, DB schema, AWS accounts ready |
| M2 — Auth Done | End Week 2 | Register/login/JWT working |
| M3 — API Complete | End Week 4 | All backend endpoints functional |
| M4 — Frontend MVP | End Week 6 | All pages connected to API |
| M5 — AWS Live | End Week 8 | Production deployment running |
| M6 — QA Sign-off | End Week 9 | All tests pass, no P0 bugs |
| M7 — Submission | End Week 10 | All docs submitted, demo rehearsed |

---

## 14. Budget Estimate

| Resource | Service | Estimated Monthly Cost |
|---|---|---|
| Compute | EC2 t3.micro | Free Tier / ~$8.50/month |
| Database | RDS db.t3.micro (MySQL) | Free Tier / ~$15/month |
| Storage | S3 (< 5GB) | < $0.12/month |
| Monitoring | CloudWatch (basic) | Free Tier |
| Data Transfer | Minimal student usage | ~$1/month |
| **Total** | | **< $25/month** |

> **Note**: AWS Free Tier covers EC2 t2.micro (750h/month) and RDS db.t3.micro (750h/month) for 12 months for new accounts. Total cost approaches $0 within Free Tier limits.

---

## 15. Team & Responsibilities

| Member | Role | Key Deliverables |
|---|---|---|
| **Member 1** | Frontend Lead | React pages, components, responsive UI, dashboard |
| **Member 2** | Backend Lead | Express API, authentication, JWT, middleware |
| **Member 3** | Database & API | MySQL schema, CRUD endpoints, stored procedures |
| **Member 4** | Cloud & DevOps | AWS EC2, RDS, S3, CloudWatch, IAM, CI/CD |
| **Member 5** | QA, Testing & Docs | Test plans, unit tests, documentation, user manual |

---

*Document prepared by the CloudStay Team — University Capstone Project*  
*Version 1.0 — August 2024*

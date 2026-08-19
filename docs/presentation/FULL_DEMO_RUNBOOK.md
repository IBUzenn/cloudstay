# CloudStay — Master Presentation & Live Demonstration Runbook

> **Purpose**: Step-by-step operational runbook for executing the live presentation and software demonstration for the CloudStay Hostel Booking System capstone defense.

---

## ⏱️ Executive Time Allocation (20 Minutes Total)

| Section | Speaker | Focus | Allocated Time |
|---|---|---|---|
| **Section 1: Introduction & Frontend** | Member 1 | Project problem, SPA architecture, React UI, router guards | 4 Minutes |
| **Section 2: Backend API & Security** | Member 2 | Express REST API, JWT auth, bcrypt, `FOR UPDATE` transactions | 4 Minutes |
| **Section 3: Database & Data Engineering** | Member 3 | MySQL 3NF schema, stored procs, inventory triggers, connection pool | 4 Minutes |
| **Section 4: DevOps & Cloud Architecture** | Member 4 | Docker Compose, AWS EC2/RDS/S3, Nginx proxy, IAM roles, CI/CD | 4 Minutes |
| **Section 5: Quality Assurance & Wrap-up** | Member 5 | Jest test execution, 100% pass verification, documentation suite | 4 Minutes |

---

## 🎬 Step-by-Step Live Demonstration Runbook

### Step 1: Opening & Repository Overview (Member 1)
* **Screen**: GitHub Repository (`https://github.com/IBUzenn/cloudstay`)
* **Actions**: Show project root directory, README badges, and overall repository structure.
* **Key Point**: CloudStay is a 3-tier cloud-native student hostel booking web application.

### Step 2: System Architecture (Member 1)
* **Screen**: Display [`AWS_ARCHITECTURE.md`](file:///d:/project/workspace-019fd9d2-5d23-7f48-a670-ef2224de5516/CloudStay/docs/deployment/AWS_ARCHITECTURE.md) Mermaid diagram.
* **Actions**: Explain browser request flow -> Nginx -> Express REST API -> RDS MySQL & S3.
* **Key Point**: Clear separation between public static assets and private database infrastructure.

### Step 3: Local Docker Launch (Member 4)
* **Screen**: Terminal
* **Command**: `docker compose up --build -d` followed by `docker compose ps`
* **Actions**: Demonstrate single-command startup. Point to 3 healthy running containers (`cloudstay-mysql`, `cloudstay-backend`, `cloudstay-frontend`).
* **Key Point**: Zero manual setup required—everything containerized and pre-configured.

### Step 4: Public Hostel Browsing (Member 1)
* **Screen**: Browser tab at `http://localhost:5173`
* **Actions**: Filter hostels by name and location (e.g. "Blue Block Hostel"). Show available room count badges.
* **Key Point**: Real-time room availability rendered via React SPA and backend REST endpoints.

### Step 5: Student Registration & Login (Member 1 & Member 2)
* **Screen**: Browser at `http://localhost:5173/register`
* **Actions**: Register new student `demo.student@student.edu`. Submit form. Navigate to `/login` and sign in.
* **Key Point**: Express backend hashes password via bcrypt (cost 12) and issues signed JWT access & refresh tokens.

### Step 6: Room Selection & Booking Submission (Member 1)
* **Screen**: Browser at `http://localhost:5173/hostels/1`
* **Actions**: Select room `BB-101`. Click **Book Room**. Complete check-in/out dates and submit.
* **Key Point**: Express service executes pessimistic row lock (`SELECT ... FOR UPDATE`) inside MySQL transaction to eliminate concurrent booking collisions.

### Step 7: Payment Receipt Upload (Member 1 & Member 4)
* **Screen**: Browser at `http://localhost:5173/student/upload-receipt/<bookingId>`
* **Actions**: Select sample payment receipt image (`receipt.jpg`) and submit upload.
* **Key Point**: Backend Multer middleware processes memory buffer and uploads directly to AWS S3 using `@aws-sdk/client-s3` with AES256 server-side encryption.

### Step 8: Database Integrity Inspection (Member 3)
* **Screen**: Terminal executing MySQL CLI inside container
* **Command**:
  ```bash
  docker exec -it cloudstay-mysql mysql -u root -pcloudstay_root_2024 -e "
    USE cloudstay;
    SELECT 'users' AS tbl, COUNT(*) AS cnt FROM users
    UNION ALL SELECT 'hostels', COUNT(*) FROM hostels
    UNION ALL SELECT 'rooms', COUNT(*) FROM rooms
    UNION ALL SELECT 'bookings', COUNT(*) FROM bookings;
    SHOW PROCEDURE STATUS WHERE Db = 'cloudstay';
  "
  ```
* **Actions**: Point out updated booking row count, active user count, and 6 registered stored procedures.
* **Key Point**: 3NF schema, stored procedures, and triggers maintain strict database consistency.

### Step 9: Admin Review & Approval Workflow (Member 1 & Member 2)
* **Screen**: Browser at `http://localhost:5173/login` (Sign in as `admin@cloudstay.edu` / `Admin@1234`)
* **Actions**: Navigate to Admin Dashboard -> Booking Review. Locate student booking and click **Approve**.
* **Key Point**: Executed backend endpoint calls stored procedure `sp_update_booking_status`, updating room status to `'booked'`.

### Step 10: API Security Verification (Member 2)
* **Screen**: Terminal using `curl.exe`
* **Command**:
  ```bash
  # Attempt unauthorized access without Bearer token
  curl.exe -i http://localhost:5000/api/admin/bookings
  ```
* **Actions**: Highlight HTTP status `401 Unauthorized`.
* **Key Point**: Role-Based Access Control (RBAC) middleware protects all sensitive administrative routes.

### Step 11: Automated Test Suite Execution (Member 5)
* **Screen**: Terminal
* **Command**: `cd backend && npm test`
* **Actions**: Run Jest test suite live. Highlight 8 test suites passing and **33/33 tests passed (100% pass rate)**.
* **Key Point**: Rigorous automated unit and integration test coverage.

### Step 12: AWS Cloud Architecture & Security Audit (Member 4)
* **Screen**: AWS Management Console or [`AWS_DEPLOYMENT_GUIDE.md`](file:///d:/project/workspace-019fd9d2-5d23-7f48-a670-ef2224de5516/CloudStay/docs/deployment/AWS_DEPLOYMENT_GUIDE.md)
* **Actions**: Explain EC2 instance profile, RDS MySQL security group rules (Port 3306 restricted to EC2 SG), S3 encryption, and Nginx proxy settings.
* **Key Point**: Production cloud setup adheres to AWS security best practices and least-privilege IAM design.

### Step 13: Presentation Conclusion & Q&A Transition (Member 5)
* **Screen**: Summary slide / GitHub repository home
* **Actions**: Thank panel, summarize core achievements (React 18 SPA, Express REST API, MySQL 8.0, AWS Cloud Infrastructure, 100% Test Pass).
* **Key Point**: Open floor for panel questions.

---

## 📌 Emergency Troubleshooting & Fallback Checklist

| Potential Issue | Immediate Action | Backup Command / Plan |
|---|---|---|
| Docker container fails to start | Check container logs | `docker compose logs backend` |
| Database volume stale | Reset MySQL named volume | `docker compose down -v && docker compose up -d` |
| Port 5173 or 5000 in use | Kill conflicting process | `Stop-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess -Force` |
| Browser cached old state | Hard refresh / Incognito | `Ctrl + Shift + R` |

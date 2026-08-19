# CloudStay — Member Defense Cheat Sheets

> **Purpose**: Individual quick-reference cheat sheets for each of the 5 team members to prepare for technical questions during the project defense.

---

## 👤 Member 1 Cheat Sheet — Team Lead & Frontend Architect

### 10 Key Facts to Remember
1. CloudStay frontend is a Single Page Application (SPA) built using **React 18** and **Vite 5**.
2. Client-side routing is handled by **React Router v6** in `frontend/src/App.jsx`.
3. Global authentication state is managed via `AuthContext.jsx` in `frontend/src/context/`.
4. Axios interceptors automatically attach `Authorization: Bearer <token>` to outgoing API requests (`frontend/src/api/axios.js`).
5. `VITE_API_BASE_URL` is a build-time environment variable compiled directly into static JS bundle assets.
6. The app supports 4 distinct user roles: Guest, Student, Hostel Manager, and System Administrator.
7. Frontend static assets are served in production via **Nginx 1.27 Alpine** in port 80.
8. Client-side form validation prevents malformed API calls prior to submission.
9. Navigation guards redirect unauthorized users attempting to access protected routes (`/admin`, `/student/dashboard`).
10. UI styling relies on Vanilla CSS tokens in `index.css` without heavy external UI dependencies.

### 5 Lecturer Questions & Ideal Answers
* **Q1: Why did you use Vite instead of Create React App?**
  * *Answer*: Vite uses native ES modules during development for near-instant server start and Hot Module Replacement (HMR). Its production build uses Rollup to create small, tree-shaken static bundles.
* **Q2: How does the application prevent a guest user from typing `/admin/dashboard` in the address bar?**
  * *Answer*: In `App.jsx`, routes are wrapped in custom `ProtectedRoute` and `AdminRoute` components that inspect the user's role from `AuthContext`. If the user is unauthenticated or lacks the required role, they are redirected to `/login` or `/forbidden`.
* **Q3: What happens when the user refreshes the page? Does login state get lost?**
  * *Answer*: No. `AuthContext` initializes by checking `localStorage` for stored user profiles and JWT refresh tokens, restoring session state automatically on browser reload.
* **Q4: How does the frontend handle API error messages?**
  * *Answer*: Axios response interceptors catch non-2xx HTTP response status codes and extract error messages returned by our backend error handling middleware, displaying them via `react-hot-toast` notifications.
* **Q5: Why is `VITE_API_BASE_URL` set to `http://localhost:5000/api` instead of `http://backend:5000/api`?**
  * *Answer*: `VITE_API_BASE_URL` is compiled into code that runs inside the user's web browser on the host machine. The browser cannot resolve Docker container internal DNS hostnames like `backend`. It can only communicate with exposed host ports (`localhost`).

### 3 Technical Terms to Know
- **Single Page Application (SPA)**: A web app that loads a single HTML page and dynamically updates content without full page refreshes.
- **Axios Interceptor**: A middleware function that transforms outgoing HTTP requests or incoming HTTP responses globally.
- **Build-Time Variable**: An environment variable evaluated during compilation (`npm run build`) and hardcoded into static bundles.

### 3 Things NOT to Claim
1. Do NOT claim the frontend uses Redux or Zustand (it uses React Context API).
2. Do NOT claim TailwindCSS was used (it uses custom Vanilla CSS).
3. Do NOT claim Vite environment variables can be changed at runtime without rebuilding the container.

### Files to Point To
- `frontend/src/App.jsx`
- `frontend/src/context/AuthContext.jsx`
- `frontend/src/api/axios.js`

---

## 👤 Member 2 Cheat Sheet — Backend & Security Engineer

### 10 Key Facts to Remember
1. The backend is an Express REST API running on **Node.js 18** (`backend/src/server.js`).
2. Authentication uses dual JWT tokens: 1-hour Access Tokens and 7-day Refresh Tokens (`auth.service.js`).
3. Passwords are encrypted using **bcryptjs** with a salt cost factor of 12.
4. Active refresh tokens are stored in the MySQL database and revoked upon user logout.
5. Role-Based Access Control (RBAC) is enforced by `auth.middleware.js` and `role.middleware.js`.
6. Concurrent booking race conditions are prevented using MySQL pessimistic locking (`SELECT ... FOR UPDATE`).
7. Application HTTP headers are secured using **Helmet** middleware.
8. Environment variables are loaded via `dotenv` from root and backend `.env` files.
9. All route inputs are validated using **express-validator** in `backend/src/validators/`.
10. Winston logger records structured application logs to `logs/combined.log` and `logs/error.log`.

### 5 Lecturer Questions & Ideal Answers
* **Q1: Why did you use dual JWT tokens instead of a single long-lived access token?**
  * *Answer*: Short-lived access tokens (1 hour) limit the window of misuse if a token is intercepted. Long-lived refresh tokens (7 days) allow users to stay logged in securely, while enabling server-side revocation in MySQL if a token is compromised.
* **Q2: How do you handle two students trying to book the last room simultaneously?**
  * *Answer*: In `booking.service.js`, we wrap booking creation in a MySQL transaction and execute `SELECT status FROM rooms WHERE id = ? FOR UPDATE`. This locks the room row. The second request waits until the first transaction finishes, sees the status is no longer `'available'`, and fails gracefully with HTTP 400.
* **Q3: What is the purpose of bcrypt cost factor 12?**
  * *Answer*: The cost factor controls key derivation iterations ($2^{12} = 4096$ rounds). It deliberately slows down password hashing to make brute-force and dictionary attacks computationally infeasible.
* **Q4: How does your API handle unhandled asynchronous errors?**
  * *Answer*: All async controllers pass errors to Express `next(err)`. Our centralized `error.middleware.js` catches all exceptions, logs them with Winston, and returns structured JSON responses (`{ success: false, message: ... }`).
* **Q5: How is CORS configured?**
  * *Answer*: We use the `cors` package in Express, setting `origin: process.env.CORS_ORIGIN`. This restricts API access to authorized frontend origins (e.g. `http://localhost:5173`).

### 3 Technical Terms to Know
- **Pessimistic Locking (`FOR UPDATE`)**: A database transaction strategy that locks selected rows to prevent concurrent modifications until the transaction commits.
- **RBAC (Role-Based Access Control)**: Restricting system access based on assigned user roles (`student`, `manager`, `admin`).
- **JWT Signature**: Cryptographic hash appended to a JWT token ensuring payload data cannot be tampered with.

### 3 Things NOT to Claim
1. Do NOT claim session state is stored in Node memory (it uses stateless JWT + MySQL refresh tokens).
2. Do NOT claim passwords are encrypted using MD5 or SHA256 (they use bcrypt).
3. Do NOT claim OAuth2 or Social Login was implemented (only email/password JWT auth exists).

### Files to Point To
- `backend/src/services/auth.service.js`
- `backend/src/services/booking.service.js`
- `backend/src/middleware/auth.middleware.js`

---

## 👤 Member 3 Cheat Sheet — Database Administrator & Data Engineer

### 10 Key Facts to Remember
1. CloudStay database uses **MySQL 8.0** with InnoDB storage engine for ACID compliance.
2. The schema (`database/schema.sql`) is normalized to **Third Normal Form (3NF)**.
3. Core tables: `users`, `hostels`, `rooms`, `bookings`, `refresh_tokens`.
4. Automated triggers (`trg_rooms_after_insert`, `trg_rooms_after_delete`) maintain `total_rooms` in `hostels`.
5. Database views (`v_room_availability`, `v_booking_summary`) simplify query logic and improve execution speed.
6. Stored procedures (`database/procedures.sql`) manage transactional workflows (`sp_create_booking`, `sp_update_booking_status`).
7. Database connection pooling is configured in `backend/src/config/database.js` using `mysql2/promise` (`DB_POOL_MAX=10`).
8. Foreign key constraints enforce referential integrity across users, hostels, rooms, and bookings (`ON DELETE RESTRICT`).
9. Seed dataset (`database/seeds.sql`) provides 10 users, 4 hostels, 29 rooms, and 8 initial bookings.
10. `LEAVE` control statements in stored procedures require explicit `BEGIN` labels (`sp_create_booking: BEGIN`).

### 5 Lecturer Questions & Ideal Answers
* **Q1: Why did you use stored procedures instead of putting all SQL in Node.js code?**
  * *Answer*: Stored procedures encapsulate complex transactional logic directly on the database engine. This reduces network roundtrips, ensures procedural execution rules are enforced consistently, and protects against SQL injection.
* **Q2: What do your database triggers do?**
  * *Answer*: `trg_rooms_after_insert` and `trg_rooms_after_delete` execute automatically whenever rooms are added or removed. They calculate `COUNT(*)` from `rooms` and update `hostels.total_rooms`, ensuring inventory counts remain synchronized.
* **Q3: Why is InnoDB required for CloudStay rather than MyISAM?**
  * *Answer*: InnoDB supports ACID transactions, row-level locking (`FOR UPDATE`), and foreign key constraints, which are mandatory for booking concurrency. MyISAM only supports table-level locking and lacks transaction support.
* **Q4: How do database views improve performance?**
  * *Answer*: Views like `v_booking_summary` pre-compile complex table joins across `bookings`, `users`, `rooms`, and `hostels`. The backend queries the view directly rather than executing large multi-table join syntax in Node.js.
* **Q5: How does connection pooling work in `mysql2`?**
  * *Answer*: Instead of opening and closing a TCP socket for every query, `mysql2.createPool` maintains a reusable pool of database connections. When a request finishes, the connection is returned to the pool, improving backend throughput.

### 3 Technical Terms to Know
- **3rd Normal Form (3NF)**: Database normalization standard requiring tables to be in 2NF with no transitive functional dependencies.
- **Connection Pool**: A cache of database connections maintained by the backend to handle concurrent database queries efficiently.
- **Database Trigger**: A procedural code block automatically executed by the database engine in response to INSERT/UPDATE/DELETE events.

### 3 Things NOT to Claim
1. Do NOT claim MongoDB or NoSQL was used (MySQL 8.0 relational DB is used).
2. Do NOT claim Prisma or TypeORM was used (raw SQL queries with `mysql2` pool are used).
3. Do NOT claim database files are stored inside temporary container memory (named volume `mysql_data` is used).

### Files to Point To
- `database/schema.sql`
- `database/procedures.sql`
- `database/seeds.sql`
- `backend/src/config/database.js`

---

## 👤 Member 4 Cheat Sheet — DevOps & Cloud Infrastructure Engineer

### 10 Key Facts to Remember
1. Local multi-container orchestration is defined in root `docker-compose.yml`.
2. Services: `cloudstay-mysql` (port 3306), `cloudstay-backend` (port 5000), `cloudstay-frontend` (port 5173/80).
3. Backend Dockerfile (`backend/Dockerfile`) uses `node:18-alpine` with `dumb-init` for process signal handling.
4. Frontend Dockerfile (`frontend/Dockerfile`) uses a multi-stage build (Node build -> Nginx 1.27 Alpine static serving).
5. In AWS, Amazon RDS MySQL replaces the local `mysql` container.
6. S3 receipt uploads in `upload.service.js` use `@aws-sdk/client-s3` (`PutObjectCommand`) with server-side AES256 encryption.
7. EC2 authenticates to S3 via an IAM Role (`cloudstay-ec2-role`) using least-privilege principles (no hardcoded keys).
8. Nginx reverse proxy routes public `/api/` traffic to local Node port 5000 and serves static React assets.
9. Security group `cloudstay-rds-sg` restricts port 3306 exclusively to traffic originating from `cloudstay-ec2-sg`.
10. `.github/workflows/ci.yml` runs automated Jest tests and Vite builds on push/PR via GitHub Actions.

### 5 Lecturer Questions & Ideal Answers
* **Q1: Why did you use a multi-stage Docker build for the frontend?**
  * *Answer*: Stage 1 uses Node to run `npm run build`. Stage 2 copies only the compiled static HTML/JS/CSS assets into a lightweight `nginx:alpine` image. This reduces final image size from ~500MB to under 25MB and eliminates Node runtime security vulnerabilities.
* **Q2: Why is `DB_HOST=mysql` locally, but `<RDS_ENDPOINT>` in AWS?**
  * *Answer*: Inside Docker Compose, `mysql` is the internal service hostname resolved by Docker's DNS bridge. In AWS, database hosting is offloaded to managed Amazon RDS, so `DB_HOST` is set to the RDS instance DNS endpoint.
* **Q3: How does the backend upload receipts to S3 without AWS Access Keys in `.env`?**
  * *Answer*: On EC2, `@aws-sdk/client-s3` automatically fetches temporary IAM role credentials from the EC2 Instance Metadata Service (IMDSv2) via the attached `cloudstay-ec2-role` IAM instance profile.
* **Q4: Why should RDS port 3306 never be open to `0.0.0.0/0`?**
  * *Answer*: Opening database ports publicly exposes the database to automated brute-force and port scanning attacks. Restricting port 3306 to `cloudstay-ec2-sg` ensures only our EC2 backend can communicate with RDS.
* **Q5: What is `dumb-init` used for in `backend/Dockerfile`?**
  * *Answer*: Node.js was not designed to run as PID 1 inside Docker containers and does not forward OS signals (like SIGTERM). `dumb-init` acts as PID 1, reaping zombie processes and ensuring graceful container shutdown.

### 3 Technical Terms to Know
- **Multi-Stage Build**: Docker build technique using multiple `FROM` instructions to produce small production images without build tooling.
- **Instance Metadata Service (IMDSv2)**: On-instance AWS endpoint (`http://169.254.169.254`) supplying temporary IAM credentials to EC2 applications.
- **Reverse Proxy**: Server (Nginx) sitting in front of web applications, forwarding client requests and handling SSL/routing.

### 3 Things NOT to Claim
1. Do NOT claim Kubernetes or ECS was used (Docker Compose and EC2 are used).
2. Do NOT claim Terraform or CloudFormation was used for provisioning (manual AWS console / CLI setup).
3. Do NOT claim S3 bucket files are publicly readable (buckets use private ACLs and server-side encryption).

### Files to Point To
- `docker-compose.yml`
- `backend/Dockerfile`
- `frontend/Dockerfile`
- `backend/src/services/upload.service.js`
- `.github/workflows/ci.yml`

---

## 👤 Member 5 Cheat Sheet — Quality Assurance & Documentation Specialist

### 10 Key Facts to Remember
1. CloudStay backend test suite contains **8 test suites** and **33 individual tests** with a **100% pass rate**.
2. Testing tools: **Jest** (test runner & assertion library) and **Supertest** (HTTP endpoint integration testing).
3. Test suites cover unit tests (`backend/tests/unit/`) and API integration tests (`backend/tests/integration/`).
4. `auth.api.test.js` tests register, login, invalid credentials, validation failures, and token expiration.
5. `booking.api.test.js` tests student booking submissions, date validation, and status transitions.
6. `upload.api.test.js` mocks Multer memory buffers and S3 `PutObjectCommand` to test receipt upload handlers.
7. `security.test.js` verifies HTTP security headers (Helmet), CORS headers, and 401/403 authorization middleware.
8. Manual QA checklists (`docs/testing/MANUAL_TESTING_CHECKLIST.md`) cover all 3 user roles across major browsers.
9. Documentation suite includes User Manual (`docs/report/USER_MANUAL.md`) and Technical Report (`docs/report/TECHNICAL_REPORT.md`).
10. Automated tests run in CI via GitHub Actions (`npm test`).

### 5 Lecturer Questions & Ideal Answers
* **Q1: How do your integration tests run without overwriting real database data?**
  * *Answer*: In `auth.api.test.js` and `booking.api.test.js`, we use `jest.mock('../../src/config/database')` to mock `mysql2` database queries. This isolates API endpoint logic and ensures tests execute fast without needing a live MySQL database during unit CI runs.
* **Q2: How did you test AWS S3 file uploads in Jest?**
  * *Answer*: In `upload.api.test.js`, we mock `@aws-sdk/client-s3` using `s3Client.send.mockResolvedValue({})`. Supertest sends a fake file buffer via `.attach('receipt', buffer)`, verifying that the controller handles upload responses correctly without making real AWS network calls.
* **Q3: What code coverage metrics did you achieve?**
  * *Answer*: Running `npm run test:coverage` generates coverage reports in `coverage/lcov-report/`. Our test suites cover core business services (`auth.service`, `booking.service`, `hostel.service`) and Express controllers.
* **Q4: How did you perform security testing?**
  * *Answer*: In `security.test.js`, we make API requests lacking authorization tokens to confirm the API returns HTTP 401. We also send requests with invalid roles to verify HTTP 403 response codes, and verify Helmet security headers (`X-Content-Type-Options`, `X-Frame-Options`).
* **Q5: How do you verify that frontend builds are bug-free before deployment?**
  * *Answer*: In addition to backend API testing, our CI pipeline executes `npm run build` in `frontend/`. This runs Vite's TypeScript/JSX compiler and Rollup bundler, ensuring zero build syntax errors exist.

### 3 Technical Terms to Know
- **Mocking**: Simulating real dependencies (like databases or S3 SDKs) with controlled test objects during unit testing.
- **Supertest**: Node.js library for testing HTTP servers by simulating REST API requests without binding to network ports.
- **Code Coverage**: Metric measuring the percentage of application source code executed during automated test suite runs.

### 3 Things NOT to Claim
1. Do NOT claim Cypress or Selenium E2E browser automation was used (Jest and Supertest were used).
2. Do NOT claim test coverage is 100% across every single file (33 tests cover core services and routes).
3. Do NOT claim unit tests connect to production AWS S3 buckets (AWS SDK calls are mocked in tests).

### Files to Point To
- `backend/tests/integration/auth.api.test.js`
- `backend/tests/integration/upload.api.test.js`
- `backend/tests/unit/booking.service.test.js`
- `docs/testing/Test-Plan.md`

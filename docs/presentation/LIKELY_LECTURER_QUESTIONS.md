# CloudStay — Comprehensive Lecturer Defense Q&A

> **Purpose**: Technical question and answer reference covering all architecture, database, DevOps, security, and cloud deployment topics likely to be asked by evaluation panels during project defense.

---

## 1. Docker & Containerization Questions

### Q1: What is the difference between an image and a container in your system?
**Answer**: A Docker **image** is an immutable, read-only blueprint containing application source code, runtime, libraries, and environment dependencies (e.g. `cloudstay-backend:latest`). A **container** is a running, isolated instance of an image instantiated by Docker Engine. In CloudStay, `docker compose up --build` compiles images from Dockerfiles and starts running containers (`cloudstay-frontend`, `cloudstay-backend`, `cloudstay-mysql`).

### Q2: Why did you use a multi-stage Docker build for the frontend?
**Answer**: Stage 1 uses Node 18 to install dev dependencies and execute `npm run build` (Vite compilation). Stage 2 copies only the compiled static HTML, JS, and CSS files into a lightweight `nginx:1.27-alpine` web server image. This reduces final image size from ~500MB down to ~23MB and removes Node.js runtime security vulnerabilities from the production container.

### Q3: How do the backend and database containers communicate inside Docker?
**Answer**: Docker Compose creates a private bridge network (`cloudstay-network`). Containers on this network resolve each other using their Docker service names as hostnames. The backend connects to MySQL using `DB_HOST=mysql` on port 3306 via Docker's internal DNS.

### Q4: Why does the frontend container use `http://localhost:5000/api` instead of `http://backend:5000/api`?
**Answer**: `VITE_API_BASE_URL` is a build-time environment variable baked directly into the static client JavaScript bundle. The browser runs on the user's host machine (outside Docker), which cannot resolve internal Docker network hostnames like `backend`. It must communicate with exposed host ports (`localhost:5000`).

---

## 2. AWS Cloud Architecture Questions

### Q5: Why did you choose Amazon RDS for MySQL instead of running MySQL inside an EC2 container in production?
**Answer**: Running MySQL inside an EC2 container introduces single-point-of-failure risk, manual backup maintenance, and storage scaling bottlenecks. Amazon RDS is a managed relational database service providing automated daily backups, point-in-time recovery, automated OS/engine patching, high availability multi-AZ failover, and hardware scaling without application downtime.

### Q6: How does EC2 authenticate with Amazon S3 without hardcoding AWS access keys?
**Answer**: We assign an **IAM Role** (`cloudstay-ec2-role`) with an attached IAM Instance Profile to the EC2 instance. When the backend AWS SDK (`@aws-sdk/client-s3`) initializes, it automatically fetches temporary credentials from the EC2 Instance Metadata Service (IMDSv2 at `http://169.254.169.254`). No AWS keys are saved in source code or `.env` files.

### Q7: Explain your AWS Network Security Group design.
**Answer**: We use two separate Security Groups:
1. `cloudstay-ec2-sg` (EC2 Instance): Allows inbound HTTP (port 80) and HTTPS (port 443) from `0.0.0.0/0`, and SSH (port 22) restricted strictly to our administrative IP (`/32`).
2. `cloudstay-rds-sg` (RDS MySQL): Allows inbound MySQL (port 3306) **only from `cloudstay-ec2-sg`**. Port 3306 is not publicly accessible from the internet.

### Q8: How does Nginx act as a reverse proxy on EC2?
**Answer**: Nginx listens on public port 80/443. Traffic to `/` serves static React SPA assets from `/var/www/CloudStay/frontend/dist` with fallback to `index.html` (`try_files $uri $uri/ /index.html`). Traffic to `/api/` is proxied internally to `http://127.0.0.1:5000/api/`, terminating SSL and hiding internal application ports.

---

## 3. Database Architecture & Concurrency Questions

### Q9: How does CloudStay prevent double bookings when two users attempt to reserve the same room simultaneously?
**Answer**: In `backend/src/services/booking.service.js`, booking creation executes within an explicit MySQL transaction using pessimistic row locking:
```sql
START TRANSACTION;
SELECT status FROM rooms WHERE id = ? FOR UPDATE;
```
The `FOR UPDATE` clause locks the room row. If a concurrent transaction attempts to read or lock the same row, it is blocked until the first transaction commits or rolls back. If the room is no longer `'available'`, the transaction aborts and returns an HTTP 400 error.

### Q10: What role do database triggers play in CloudStay?
**Answer**: `trg_rooms_after_insert` and `trg_rooms_after_delete` automatically synchronize inventory counters in the `hostels` table. Whenever a room is inserted or deleted, the trigger calculates `COUNT(*)` from `rooms` for that `hostel_id` and updates `hostels.total_rooms`, ensuring data consistency without relying on application code.

### Q11: Explain how database views improve backend efficiency.
**Answer**: Views like `v_booking_summary` and `v_room_availability` pre-compile multi-table relational joins across `bookings`, `users`, `rooms`, and `hostels`. Instead of writing complex 4-table join queries in Node.js, backend services execute simple queries against `v_booking_summary`, improving execution speed and code readability.

### Q12: Why did you use `mysql2/promise` with connection pooling?
**Answer**: `mysql2/promise` supports async/await syntax and maintains a pool of reusable TCP database sockets (`DB_POOL_MAX=10`). Connection pooling eliminates the overhead of opening and closing a database socket for every HTTP request, allowing the API to handle high concurrent user traffic efficiently.

---

## 4. Authentication, API & Security Questions

### Q13: Explain your dual-token JWT authentication flow.
**Answer**: Upon successful login (`POST /api/auth/login`), the backend generates:
1. **Access Token** (1 hour expiry): Signed with `JWT_SECRET`, carried in the `Authorization: Bearer <token>` header for stateless route authorization.
2. **Refresh Token** (7 days expiry): Signed with `JWT_REFRESH_SECRET`, saved in the `refresh_tokens` database table.
When the access token expires, the client calls `POST /api/auth/refresh` to receive a new access token without re-entering credentials. On logout, the refresh token is revoked in MySQL.

### Q14: How are passwords secured in the database?
**Answer**: User passwords are encrypted using **bcryptjs** with a cost factor of 12 (`$2a$12$...`). Bcrypt incorporates a unique salt per password and runs 4,096 hashing rounds, rendering rainbow table lookups and GPU brute-force attacks computationally infeasible.

### Q15: How is Role-Based Access Control (RBAC) enforced?
**Answer**: Express route handlers use two middleware functions:
1. `auth.middleware.js`: Extracts and verifies the JWT access token from the HTTP Bearer header.
2. `role.middleware.js`: Compares `req.user.role` against required roles (e.g. `authorize('admin', 'manager')`). If unauthorized, it immediately returns HTTP 403 Forbidden.

### Q16: How does CloudStay protect against SQL Injection?
**Answer**: All database queries use parameterized SQL statements (`pool.query('SELECT * FROM users WHERE email = ?', [email])`) or stored procedures. Parameters are sent to MySQL separately from SQL commands, preventing malicious user inputs from altering query structure.

---

## 5. DevOps, CI/CD & Testing Questions

### Q17: How does your GitHub Actions CI/CD pipeline work?
**Answer**: Defined in `.github/workflows/ci.yml`, on every push or pull request to `main` or `development`:
1. `actions/checkout@v4` checks out repository code.
2. `actions/setup-node@v4` sets up Node.js 18 and caches dependencies via `cache-dependency-path`.
3. Job 1 (`test-backend`) executes `npm ci` and runs Jest tests (`npm run test:coverage`).
4. Job 2 (`build-frontend`) executes `npm ci` and compiles Vite production assets (`npm run build`).

### Q18: How do you unit test S3 file uploads without calling real AWS services?
**Answer**: In `backend/tests/integration/upload.api.test.js`, we use `jest.mock('@aws-sdk/client-s3')` to mock `s3Client.send.mockResolvedValue({})`. Supertest attaches a buffer via `.attach('receipt', buffer)`, testing Multer file validation and controller logic without invoking real network requests or incurring AWS charges.

### Q19: What happens if an S3 bucket upload fails at runtime?
**Answer**: In `upload.service.js`, S3 upload calls are wrapped in a try/catch block. If S3 fails (e.g., bucket unreadable), Winston logs the exact AWS error, and the service throws a custom `AppError('Failed to upload file to storage', 502)`. Express error middleware returns HTTP 502 Bad Gateway to the client, preventing silent failures.

### Q20: How do you handle CORS in production?
**Answer**: In Express (`backend/src/config/app.js`), CORS is configured using the `cors` package: `cors({ origin: process.env.CORS_ORIGIN })`. In production, `CORS_ORIGIN` is set strictly to our frontend domain or EC2 IP (`http://<EC2_PUBLIC_IP>:5173`), preventing unauthorized cross-origin requests from external malicious websites.

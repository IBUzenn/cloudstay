# Member 2 — Task Specifications

## Task List Summary

- `M2-BE-001`: Express App Architecture & Middleware Assembly
- `M2-BE-002`: Dual-Token JWT Auth Service & Revocation Store
- `M2-BE-003`: Hostel & Room Management CRUD API Services
- `M2-BE-004`: Transactional Booking Creation & Status State Machine
- `M2-BE-005`: Security Audit, Rate Limiting & Error Middleware

---

### Task M2-BE-001
- **Task ID:** M2-BE-001
- **Task:** Assemble Express application middleware stack and global route mounts.
- **Purpose:** Provide an extensible foundation for handling incoming HTTP requests.
- **Files involved:**
  - `backend/src/config/app.js`
  - `backend/src/server.js`
  - `backend/src/utils/logger.js`
- **Prerequisites:** Express dependencies installed in `backend/package.json`.
- **Implementation instructions:**
  - Mount global security middleware in order: `helmet()`, `cors()`, `express.json({ limit: '10kb' })`, `morgan()`, `rateLimit()`.
  - Mount route handlers: `/api/auth`, `/api/hostels`, `/api/rooms`, `/api/bookings`, `/api/admin`, `/api/health`.
  - Attach global 404 handler and central `errorHandler` middleware.
- **Expected result:** Server boots up cleanly on port 5000; `/api/health` returns status JSON.
- **Testing requirement:** Make a `GET /api/health` request using curl or Postman; verify 200 OK response.
- **Completion criteria:** Server starts without unhandled errors; health endpoint returns valid uptime payload.
- **Dependency:** None.

---

### Task M2-BE-002
- **Task ID:** M2-BE-002
- **Task:** Implement dual-token JWT authentication and server-side refresh token store.
- **Purpose:** Secure user login, session renewal, and logout token invalidation.
- **Files involved:**
  - `backend/src/services/auth.service.js`
  - `backend/src/controllers/auth.controller.js`
  - `backend/src/routes/auth.routes.js`
  - `backend/src/middleware/auth.middleware.js`
- **Prerequisites:** MySQL `users` and `refresh_tokens` tables available (Member 3).
- **Implementation instructions:**
  - `register()`: Hash password with `bcrypt.hash(password, 12)`; store user record in DB.
  - `login()`: Verify password with `bcrypt.compare()`; issue 1-hour access token & 7-day refresh token; store bcrypt hash of refresh token in `refresh_tokens` table.
  - `refreshAccessToken()`: Verify refresh token signature & compare hash against database before issuing new access token.
  - `logout()`: Delete all stored refresh tokens for `req.user.userId`.
- **Expected result:** Invalid passwords return 401 Unauthorized; logout invalidates the refresh token.
- **Testing requirement:** Test register, login, access protected route with Bearer token, refresh token, and logout.
- **Completion criteria:** All auth endpoints pass unit tests (`auth.service.test.js`).
- **Dependency:** Member 3 (`users` & `refresh_tokens` schema).

---

### Task M2-BE-003
- **Task ID:** M2-BE-003
- **Task:** Build Hostel & Room CRUD services and controllers.
- **Purpose:** Expose hostel listing and room availability endpoints.
- **Files involved:**
  - `backend/src/services/hostel.service.js`
  - `backend/src/controllers/hostel.controller.js`
  - `backend/src/controllers/room.controller.js`
  - `backend/src/routes/hostel.routes.js`
  - `backend/src/routes/room.routes.js`
- **Prerequisites:** MySQL `hostels` and `rooms` tables available (Member 3).
- **Implementation instructions:**
  - `findAll()`: Query active hostels (`is_active = 1`), parse JSON amenities, support `?location=` filtering and pagination.
  - `findById()`: Return single hostel record with available rooms count.
  - `create()`, `update()`, `softDelete()`: Admin endpoints for managing hostel catalog.
- **Expected result:** `GET /api/hostels` returns paginated list with parsed `amenities` array.
- **Testing requirement:** Query hostels endpoint with location search term; verify correct SQL filter application.
- **Completion criteria:** Endpoints return expected response envelope `{ success: true, data: [...] }`.
- **Dependency:** Member 3 (`hostels` & `rooms` schema).

---

### Task M2-BE-004
- **Task ID:** M2-BE-004
- **Task:** Implement race-condition safe booking creation and status state machine.
- **Purpose:** Prevent double-booking of rooms and enforce valid booking status transitions.
- **Files involved:**
  - `backend/src/services/booking.service.js`
  - `backend/src/controllers/booking.controller.js`
  - `backend/src/routes/booking.routes.js`
- **Prerequisites:** MySQL `bookings` table available (Member 3).
- **Implementation instructions:**
  - In `create()`: Begin transaction; lock room row with `SELECT ... FOR UPDATE`; verify room status is `available`; check student has no existing active/pending booking; insert booking with status `pending`; commit transaction.
  - In `updateStatus()`: Validate allowed transitions (`pending` → `approved`/`rejected`/`cancelled`; `approved` → `cancelled`). On approval, update room status to `booked`; on rejection/cancellation, update room status to `available`.
- **Expected result:** Concurrent booking requests for the same room result in one success (201) and one conflict (409).
- **Testing requirement:** Unit test `create()` and `updateStatus()` error conditions using Jest mocks.
- **Completion criteria:** Transaction rollback correctly occurs on error; status transitions strictly enforced.
- **Dependency:** Member 3 (`bookings` schema).

---

### Task M2-BE-005
- **Task ID:** M2-BE-005
- **Task:** Configure security middleware, rate limiters, RBAC guards, and global error handling.
- **Purpose:** Protect API from unauthorized access, brute-force attacks, and unhandled exceptions.
- **Files involved:**
  - `backend/src/middleware/role.middleware.js`
  - `backend/src/middleware/validate.middleware.js`
  - `backend/src/middleware/error.middleware.js`
  - `backend/src/utils/response.js`
- **Prerequisites:** None.
- **Implementation instructions:**
  - Implement `requireRole(roles)` middleware comparing `req.user.role` against permitted roles.
  - Implement `AppError` class distinguishing operational errors from unexpected crashes.
  - Implement `errorHandler` returning formatted JSON error envelope `{ success: false, message: ... }`.
- **Expected result:** Unauthenticated requests return 401; unauthorized roles return 403; rate limit breach returns 429.
- **Testing requirement:** Send request without Bearer token to admin route; verify 401 JSON response.
- **Completion criteria:** Backend passes security audit test suite (`security.test.js`).
- **Dependency:** None.

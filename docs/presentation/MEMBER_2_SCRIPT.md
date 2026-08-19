# CloudStay Presentation Script — Member 2: Backend & Security Engineer

> **Speaker**: Member 2 (Backend & Security Engineer)  
> **Duration**: ~3.5 to 4 minutes  
> **Focus**: Express REST API Architecture, Dual JWT Authentication, RBAC Middleware, Bcrypt Password Hashing, and Transactional Concurrency

---

## 🎙️ Spoken Presentation Script

### 1. Introduction & Backend Architecture (0:00 - 0:45)
"Thank you, Member 1. My name is Member 2, and I was responsible for designing and implementing the **Express.js REST API** and application security layer for CloudStay.

Our backend is built on **Node.js 18** and **Express 4**, organized following a modular Controller-Service-Repository architecture in `backend/src/`. This separation keeps our route handlers clean, decouples business logic into dedicated services, and centralizes database queries within our data pool."

---

### 2. Authentication & JWT Security Implementation (0:45 - 1:45)
"Security was a top priority throughout our API design:

1. **Dual-Token JWT Authentication**: In `auth.service.js`, when a user logs in, we issue two tokens:
   - A short-lived **Access Token** expiring in 1 hour, signed with `JWT_SECRET`. This token carries user identity and role claims.
   - A long-lived **Refresh Token** expiring in 7 days, signed with `JWT_REFRESH_SECRET`. Refresh tokens are stored in our MySQL `refresh_tokens` table.
   When an access token expires, the client calls `POST /api/auth/refresh` to obtain a new access token without requiring re-authentication. On logout, the refresh token is revoked in MySQL.
2. **Password Hashing**: User passwords are never stored in plain text. In `auth.service.js`, passwords are hashed using **bcryptjs** with a cost factor of 12 (`$2a$12$...`), protecting user credentials against dictionary and rainbow table attacks.
3. **Role-Based Access Control (RBAC)**: Enforced via `auth.middleware.js` and `role.middleware.js`. Route endpoints are strictly guarded:
   - Public: `/api/hostels`
   - Student: `POST /api/bookings`
   - Admin/Manager: `PUT /api/bookings/:id/status` and `/api/admin/*`
   If a non-admin attempts an administrative action, the API immediately returns `403 Forbidden` with a standardized JSON error response."

---

### 3. Concurrency Control & Database Atomicity (1:45 - 2:45)
"One of the biggest technical challenges in a booking system is handling **concurrent booking attempts**—for instance, when two students try to reserve the last available room at the exact same second.

To solve this, we implemented **pessimistic row locking** inside a MySQL transaction in `booking.service.js`:

```javascript
// From backend/src/services/booking.service.js
await connection.beginTransaction();
const [rooms] = await connection.query(
  'SELECT status FROM rooms WHERE id = ? FOR UPDATE',
  [roomId]
);
```

By executing `FOR UPDATE`, MySQL locks the room record until the transaction completes. If the room is already booked or pending, the transaction rolls back safely and returns an HTTP `400 Bad Request` informing the second user that the room is no longer available. This guarantees data integrity and prevents double bookings."

---

### 4. Screen Demonstration Instructions & Handoff (2:45 - 3:45)
*[Action on Screen: Open terminal or Postman / curl]*

"Let me demonstrate our authentication API using `curl`.

When I send a `POST` request to `http://localhost:5000/api/auth/login` with admin credentials `admin@cloudstay.edu`, the backend returns `200 OK` along with the JSON payload containing the user object and our signed JWT tokens.

Notice that if I attempt to call `GET /api/admin/bookings` without passing the `Authorization: Bearer <token>` header, our middleware intercepts the request and responds with `401 Unauthorized`.

Beyond authentication and middleware security, all business operations ultimately rely on a robust database schema.

I will now pass the presentation to **Member 3**, our Database Administrator, who will explain our MySQL 3NF schema, stored procedures, triggers, and relational database views."

---

## 📋 Member 2 Quick Reference

- **Key Files**: [`backend/src/routes/auth.routes.js`](file:///d:/project/workspace-019fd9d2-5d23-7f48-a670-ef2224de5516/CloudStay/backend/src/routes/auth.routes.js), [`backend/src/services/auth.service.js`](file:///d:/project/workspace-019fd9d2-5d23-7f48-a670-ef2224de5516/CloudStay/backend/src/services/auth.service.js), [`backend/src/services/booking.service.js`](file:///d:/project/workspace-019fd9d2-5d23-7f48-a670-ef2224de5516/CloudStay/backend/src/services/booking.service.js), [`backend/src/middleware/auth.middleware.js`](file:///d:/project/workspace-019fd9d2-5d23-7f48-a670-ef2224de5516/CloudStay/backend/src/middleware/auth.middleware.js)
- **Key Concepts**: Dual JWT authentication, bcrypt (cost 12), RBAC middleware, `FOR UPDATE` transaction locking.
- **Screen Focus**: Terminal showing `curl` login request returning JWT tokens and HTTP 401 unauthorized test.
